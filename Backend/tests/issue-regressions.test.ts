jest.mock('../src/config/firebase', () => ({
  db: { collection: jest.fn(), runTransaction: jest.fn() },
  auth: { verifyIdToken: jest.fn() },
}));

jest.mock('../src/config/cloudinary', () => ({
  __esModule: true,
  default: {
    uploader: {
      upload_stream: jest.fn(),
      destroy: jest.fn(),
    },
  },
}));

jest.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
    arrayUnion: jest.fn((value) => ({ operation: 'arrayUnion', value })),
    arrayRemove: jest.fn((value) => ({ operation: 'arrayRemove', value })),
  },
}));

const request = require('supertest');
const express = require('express');
const { db, auth } = jest.requireMock('../src/config/firebase');
const cloudinary = jest.requireMock('../src/config/cloudinary').default;

const documents: Record<string, Record<string, any>> = {
  admins: {},
  customers: {},
  guesthouses: {},
  ratings: {},
};
let failNextGuesthouseUpdate = false;
let lastTransaction: any;
let lastDocumentUpdate: Record<string, any> | undefined;

function snapshot(value: Record<string, any> | undefined) {
  return {
    exists: value !== undefined,
    data: () => value,
    get: (field: string) => value?.[field],
  };
}

function reference(collection: string, id: string) {
  return {
    collection,
    id,
    get: async () => snapshot(documents[collection][id]),
    update: jest.fn(async (patch: Record<string, any>) => {
      if (collection === 'guesthouses' && failNextGuesthouseUpdate) {
        failNextGuesthouseUpdate = false;
        throw new Error('Firestore update failed');
      }
      lastDocumentUpdate = patch;
      documents[collection][id] = { ...documents[collection][id], ...patch };
    }),
  };
}

function querySnapshot(collection: string, field: string, value: unknown) {
  const docs = Object.entries(documents[collection])
    .filter(([, data]) => data[field] === value)
    .map(([id, data]) => ({
      id,
      data: () => data,
      get: (key: string) => data[key],
    }));
  return { docs, size: docs.length, empty: docs.length === 0 };
}

db.collection.mockImplementation((collection: string) => ({
  doc: (id: string) => reference(collection, id),
  where: (field: string, _operator: string, value: unknown) => ({
    collection,
    field,
    value,
    get: async () => querySnapshot(collection, field, value),
  }),
}));

db.runTransaction.mockImplementation(async (callback: (transaction: any) => unknown) => {
  lastTransaction = {
    get: async (ref: any) =>
      ref.field
        ? querySnapshot(ref.collection, ref.field, ref.value)
        : snapshot(documents[ref.collection][ref.id]),
    set: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  return callback(lastTransaction);
});

const {
  getGuesthouseRatings,
  getMyRatings,
  upsertRating,
  deleteMyRating,
} = require('../src/controllers/ratingController');
const customerController = require('../src/controllers/customerController');
const guesthouseRoutes = require('../src/routes/guesthouses').default;
const { errorHandler } = require('../src/middleware/errorHandler');

const imageApp = express();
imageApp.use('/guesthouses', guesthouseRoutes);
imageApp.use(errorHandler);

function response() {
  const res: any = {
    json: jest.fn(),
    status: jest.fn(),
    end: jest.fn(),
  };
  res.status.mockReturnValue(res);
  res.end.mockReturnValue(res);
  return res;
}

beforeEach(() => {
  for (const collection of Object.keys(documents)) {
    documents[collection] = {};
  }
  documents.admins.admin1 = { admin_id: 'admin1' };
  documents.guesthouses.gh1 = { name: 'Test Guesthouse', rating_sum: 8, rating_count: 2 };
  documents.customers.customer1 = { customer_id: 'customer1', favourites: [] };
  failNextGuesthouseUpdate = false;
  lastDocumentUpdate = undefined;
  jest.clearAllMocks();
  auth.verifyIdToken.mockResolvedValue({ uid: 'admin1' });
  cloudinary.uploader.destroy.mockResolvedValue({ result: 'ok' });
});

describe('rating aggregate transactions', () => {
  test('creates a rating and updates all aggregate fields', async () => {
    const res = response();
    await upsertRating(
      { user: { uid: 'customer1' }, body: { guesthouse_id: 'gh1', score: 4 } },
      res,
      jest.fn(),
    );

    expect(lastTransaction.set).toHaveBeenCalledWith(
      expect.objectContaining({ id: 'customer1_gh1' }),
      expect.objectContaining({ score: 4, customer_id: 'customer1' }),
    );
    expect(lastTransaction.update.mock.calls[0][1]).toEqual(
      expect.objectContaining({ rating_sum: 12, rating_count: 3, average_rating: 4 }),
    );
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({
          rating_id: 'customer1_gh1',
          score: 4,
          comment: '',
        }),
      }),
    );
  });

  test('edits a rating without increasing the count', async () => {
    documents.ratings.customer1_gh1 = {
      rating_id: 'customer1_gh1',
      guesthouse_id: 'gh1',
      customer_id: 'customer1',
      score: 4,
      created_at: 'original-date',
    };
    const res = response();
    await upsertRating(
      { user: { uid: 'customer1' }, body: { guesthouse_id: 'gh1', score: 2 } },
      res,
      jest.fn(),
    );

    expect(lastTransaction.update.mock.calls[0][1]).toEqual(
      expect.objectContaining({ rating_sum: 6, rating_count: 2, average_rating: 3 }),
    );
    expect(lastTransaction.set.mock.calls[0][1].created_at).toBe('original-date');
  });

  test('deletes a rating and decrements the aggregate', async () => {
    documents.ratings.customer1_gh1 = {
      rating_id: 'customer1_gh1',
      guesthouse_id: 'gh1',
      customer_id: 'customer1',
      score: 4,
    };
    const res = response();
    await deleteMyRating(
      { user: { uid: 'customer1' }, params: { guesthouseId: 'gh1' } },
      res,
      jest.fn(),
    );

    expect(lastTransaction.delete).toHaveBeenCalled();
    expect(lastTransaction.update.mock.calls[0][1]).toEqual(
      expect.objectContaining({ rating_sum: 4, rating_count: 1, average_rating: 4 }),
    );
    expect(res.status).toHaveBeenCalledWith(204);
  });

  test('returns ratings for the current customer and a guesthouse', async () => {
    documents.ratings.customer1_gh1 = {
      rating_id: 'customer1_gh1',
      customer_id: 'customer1',
      guesthouse_id: 'gh1',
      score: 4,
    };
    const mine = response();
    await getMyRatings({ user: { uid: 'customer1' } }, mine, jest.fn());
    expect(mine.json).toHaveBeenCalledWith({
      success: true,
      data: [documents.ratings.customer1_gh1],
    });

    const byGuesthouse = response();
    await getGuesthouseRatings(
      { params: { guesthouseId: 'gh1' } },
      byGuesthouse,
      jest.fn(),
    );
    expect(byGuesthouse.json).toHaveBeenCalledWith({
      success: true,
      data: [documents.ratings.customer1_gh1],
    });
  });
});

describe('customer favourites', () => {
  test('returns the signed-in customer’s own favourites', async () => {
    documents.customers.customer1.favourites = ['gh1'];
    const res = response();
    await customerController.getFavourites(
      { user: { uid: 'customer1' } },
      res,
      jest.fn(),
    );
    expect(res.json).toHaveBeenCalledWith({ success: true, data: ['gh1'] });
  });

  test('stores a favourite using an idempotent array union', async () => {
    const res = response();
    await customerController.addFavourite(
      { user: { uid: 'customer1' }, params: { guesthouseId: 'gh1' } },
      res,
      jest.fn(),
    );
    expect(lastDocumentUpdate).toEqual({
      favourites: { operation: 'arrayUnion', value: 'gh1' },
    });
    expect(res.status).toHaveBeenCalledWith(204);
  });

  test('removes a favourite using an idempotent array remove', async () => {
    const res = response();
    await customerController.removeFavourite(
      { user: { uid: 'customer1' }, params: { guesthouseId: 'gh1' } },
      res,
      jest.fn(),
    );
    expect(lastDocumentUpdate).toEqual({
      favourites: { operation: 'arrayRemove', value: 'gh1' },
    });
    expect(res.status).toHaveBeenCalledWith(204);
  });
});

describe('guesthouse image upload route', () => {
  const png = Buffer.from([
    137, 80, 78, 71, 13, 10, 26, 10, 0, 0, 0, 0,
  ]);
  const uploaded = {
    secure_url: 'https://images.example.test/gh1/logo.png',
    public_id: 'guesthouses/gh1/logo',
  };

  beforeEach(() => {
    cloudinary.uploader.upload_stream.mockImplementation(
      (_options: unknown, callback: (error: null, result: unknown) => void) => ({
        end: jest.fn(() => callback(null, uploaded)),
      }),
    );
  });

  test.each([
    ['logo', 'logo_url'],
    ['gallery', 'gallery_urls'],
  ])('uploads and stores a %s image', async (kind, field) => {
    const res = await request(imageApp)
      .post('/guesthouses/gh1/images')
      .set('Authorization', 'Bearer test-token')
      .field('kind', kind)
      .attach('image', png, { filename: `${kind}.png`, contentType: 'image/png' });

    expect(res.status).toBe(201);
    expect(documents.guesthouses.gh1[field]).toBeDefined();
    expect(cloudinary.uploader.upload_stream).toHaveBeenCalledWith(
      { folder: 'guesthouses/gh1', resource_type: 'image' },
      expect.any(Function),
    );
  });

  test('removes the Cloudinary asset when Firestore update fails', async () => {
    failNextGuesthouseUpdate = true;
    const log = jest.spyOn(console, 'error').mockImplementation(() => undefined);
    const res = await request(imageApp)
      .post('/guesthouses/gh1/images')
      .set('Authorization', 'Bearer test-token')
      .field('kind', 'logo')
      .attach('image', png, { filename: 'logo.png', contentType: 'image/png' });

    expect(res.status).toBe(500);
    expect(cloudinary.uploader.destroy).toHaveBeenCalledWith(uploaded.public_id);
    log.mockRestore();
  });
});
