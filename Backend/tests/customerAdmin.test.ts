export {};

jest.mock('../src/config/firebase', () => ({
  db: { collection: jest.fn() },
  auth: { verifyIdToken: jest.fn(), deleteUser: jest.fn() },
}));

jest.mock('firebase-admin/firestore', () => ({
  FieldValue: {
    serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
    arrayUnion: jest.fn((value: unknown) => ({ operation: 'arrayUnion', value })),
    arrayRemove: jest.fn((value: unknown) => ({ operation: 'arrayRemove', value })),
  },
}));

const express = require('express');
const request = require('supertest');
const { db, auth } = jest.requireMock('../src/config/firebase');
const {
  createCustomer,
  listCustomers,
  setCustomerStatus,
  deleteCustomer,
} = require('../src/controllers/customerController');
const { requireActiveCustomer } = require('../src/middleware/auth');
const { customerStatusSchema } = require('../src/schemas/customer');
const customerRoutes = require('../src/routes/customers').default;
const { errorHandler } = require('../src/middleware/errorHandler');


const documents: Record<string, Record<string, any>> = {
  admins: {},
  customers: {},
  guesthouses: {},
};
let lastUpdate: Record<string, any> | undefined;

function snapshot(id: string, value: Record<string, any> | undefined) {
  return {
    id,
    exists: value !== undefined,
    data: () => value,
    get: (field: string) => value?.[field],
  };
}

function reference(collection: string, id: string) {
  return {
    get: async () => snapshot(id, documents[collection][id]),
    create: jest.fn(async (data: Record<string, any>) => {
      if (documents[collection][id] !== undefined) {
        throw Object.assign(new Error('Document already exists'), { code: 6 });
      }
      documents[collection][id] = data;
    }),
    update: jest.fn(async (patch: Record<string, any>) => {
      lastUpdate = patch;
      documents[collection][id] = { ...documents[collection][id], ...patch };
    }),
    delete: jest.fn(async () => {
      delete documents[collection][id];
    }),
  };
}

db.collection.mockImplementation((collection: string) => ({
  doc: (id: string) => reference(collection, id),
  get: async () => ({
    docs: Object.entries(documents[collection]).map(([id, value]) => snapshot(id, value)),
  }),
}));

const tokens: Record<string, { uid: string; email: string }> = {
  'admin-token': { uid: 'admin1', email: 'admin@example.test' },
  'customer-token': { uid: 'c1', email: 'ann@example.test' },
  'suspended-token': { uid: 'c2', email: 'bea@example.test' },
};
auth.verifyIdToken.mockImplementation(async (token: string) => {
  const decoded = tokens[token];
  if (!decoded) throw new Error('invalid token');
  return decoded;
});

function response() {
  const res: any = { json: jest.fn(), status: jest.fn(), end: jest.fn() };
  res.status.mockReturnValue(res);
  res.end.mockReturnValue(res);
  return res;
}

const app = express();
app.use(express.json());
app.use('/customers', customerRoutes);
app.use(errorHandler);

beforeEach(() => {
  documents.admins = { admin1: { admin_id: 'admin1' } };
  documents.customers = {
    c1: { customer_id: 'c1', full_name: 'Ann', email: 'ann@example.test', status: 'active', favourites: [] },
    c2: { customer_id: 'c2', full_name: 'Bea', email: 'bea@example.test', status: 'suspended', favourites: [] },
  };
  documents.guesthouses = {};
  lastUpdate = undefined;
  auth.deleteUser.mockReset();
  auth.deleteUser.mockResolvedValue(undefined);
});


describe('customerStatusSchema', () => {
  test.each(['active', 'suspended'])('accepts %s', (status) => {
    expect(customerStatusSchema.validate({ status }).error).toBeUndefined();
  });

  test.each(['banned', '', 'ACTIVE'])('rejects %p', (status) => {
    expect(customerStatusSchema.validate({ status }).error).toBeDefined();
  });

  test('rejects a missing status', () => {
    expect(customerStatusSchema.validate({}).error).toBeDefined();
  });
});


describe('createCustomer status', () => {
  test('a new profile starts as active', async () => {
    const res = response();
    await createCustomer(
      { user: { uid: 'new1', email: 'new1@example.test' }, body: { full_name: 'New Person' } },
      res,
      jest.fn(),
    );
    expect(documents.customers.new1.status).toBe('active');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({ status: 'active' }),
    });
  });
});


describe('requireActiveCustomer', () => {
  test('returns 401 when there is no signed-in user', async () => {
    const next = jest.fn();
    await requireActiveCustomer({}, {}, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 401, code: 'UNAUTHENTICATED' }),
    );
  });

  test('lets an active customer through', async () => {
    const next = jest.fn();
    await requireActiveCustomer({ user: { uid: 'c1' } }, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('lets a profile with no status through (older profiles)', async () => {
    documents.customers.c3 = { customer_id: 'c3', full_name: 'Old Profile' };
    const next = jest.fn();
    await requireActiveCustomer({ user: { uid: 'c3' } }, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('lets someone with no profile through (profile creation must still work)', async () => {
    const next = jest.fn();
    await requireActiveCustomer({ user: { uid: 'nobody' } }, {}, next);
    expect(next).toHaveBeenCalledWith();
  });

  test('blocks a suspended customer with 403', async () => {
    const next = jest.fn();
    await requireActiveCustomer({ user: { uid: 'c2' } }, {}, next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 403, code: 'ACCOUNT_SUSPENDED' }),
    );
  });
});


describe('listCustomers', () => {
  test('returns only the admin-safe fields, with dates as text and a default status', async () => {
    documents.customers = {
      c1: {
        customer_id: 'c1',
        full_name: 'Ann',
        email: 'ann@example.test',
        status: 'suspended',
        favourites: ['gh1'],
        created_at: { toDate: () => new Date('2026-10-01T10:00:00.000Z') },
      },
      c2: { full_name: 'Bea' },
    };
    const res = response();
    await listCustomers({}, res);
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: [
        {
          customer_id: 'c1',
          full_name: 'Ann',
          email: 'ann@example.test',
          status: 'suspended',
          created_at: '2026-10-01T10:00:00.000Z',
        },
        { customer_id: 'c2', full_name: 'Bea', email: null, status: 'active', created_at: null },
      ],
    });
  });

  test('returns an empty list when there are no customers', async () => {
    documents.customers = {};
    const res = response();
    await listCustomers({}, res);
    expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
  });
});


describe('setCustomerStatus', () => {
  test('suspends a customer and returns the updated profile', async () => {
    const res = response();
    await setCustomerStatus(
      { params: { customerId: 'c1' }, body: { status: 'suspended' } },
      res,
      jest.fn(),
    );
    expect(documents.customers.c1.status).toBe('suspended');
    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: expect.objectContaining({ full_name: 'Ann', status: 'suspended' }),
    });
  });

  test('reactivates a suspended customer', async () => {
    await setCustomerStatus(
      { params: { customerId: 'c2' }, body: { status: 'active' } },
      response(),
      jest.fn(),
    );
    expect(documents.customers.c2.status).toBe('active');
  });

  test('returns 404 for an unknown customer and changes nothing', async () => {
    const next = jest.fn();
    await setCustomerStatus(
      { params: { customerId: 'missing' }, body: { status: 'suspended' } },
      response(),
      next,
    );
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 404, code: 'CUSTOMER_NOT_FOUND' }),
    );
    expect(lastUpdate).toBeUndefined();
  });

  test('rejects a blank customer ID with 400', async () => {
    const next = jest.fn();
    await setCustomerStatus(
      { params: { customerId: '   ' }, body: { status: 'suspended' } },
      response(),
      next,
    );
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 400, code: 'INVALID_CUSTOMER_ID' }),
    );
  });
});


describe('deleteCustomer', () => {
  test('removes the profile and the login', async () => {
    const res = response();
    const next = jest.fn();
    await deleteCustomer({ params: { customerId: 'c1' } }, res, next);
    expect(documents.customers.c1).toBeUndefined();
    expect(auth.deleteUser).toHaveBeenCalledWith('c1');
    expect(res.status).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });

  test('still succeeds when the login was already gone', async () => {
    auth.deleteUser.mockRejectedValue(
      Object.assign(new Error('no user'), { code: 'auth/user-not-found' }),
    );
    const res = response();
    const next = jest.fn();
    await deleteCustomer({ params: { customerId: 'c1' } }, res, next);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(next).not.toHaveBeenCalled();
  });

  test('passes any other login-deletion error on to the error handler', async () => {
    const failure = Object.assign(new Error('boom'), { code: 'auth/internal-error' });
    auth.deleteUser.mockRejectedValue(failure);
    const res = response();
    const next = jest.fn();
    await deleteCustomer({ params: { customerId: 'c1' } }, res, next);
    expect(next).toHaveBeenCalledWith(failure);
    expect(res.status).not.toHaveBeenCalled();
  });

  test('returns 404 for an unknown customer and never touches the login', async () => {
    const next = jest.fn();
    await deleteCustomer({ params: { customerId: 'missing' } }, response(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 404, code: 'CUSTOMER_NOT_FOUND' }),
    );
    expect(auth.deleteUser).not.toHaveBeenCalled();
  });

  test('rejects a blank customer ID with 400', async () => {
    const next = jest.fn();
    await deleteCustomer({ params: { customerId: ' ' } }, response(), next);
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({ status: 400, code: 'INVALID_CUSTOMER_ID' }),
    );
  });
});


describe('customer routes', () => {
  const bearer = (token: string) => ({ Authorization: `Bearer ${token}` });

  test('listing customers without a token is refused with 401', async () => {
    const res = await request(app).get('/customers');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('UNAUTHENTICATED');
  });

  test('a customer cannot list customers (403)', async () => {
    const res = await request(app).get('/customers').set(bearer('customer-token'));
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('FORBIDDEN');
  });

  test('an admin can list customers, with their status', async () => {
    const res = await request(app).get('/customers').set(bearer('admin-token'));
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data.map((c: any) => c.status)).toEqual(['active', 'suspended']);
  });

  test('an admin can suspend a customer', async () => {
    const res = await request(app)
      .patch('/customers/c1/status')
      .set(bearer('admin-token'))
      .send({ status: 'suspended' });
    expect(res.status).toBe(200);
    expect(documents.customers.c1.status).toBe('suspended');
  });

  test('an invalid status is refused with 400 and nothing changes', async () => {
    const res = await request(app)
      .patch('/customers/c1/status')
      .set(bearer('admin-token'))
      .send({ status: 'banned' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(documents.customers.c1.status).toBe('active');
  });

  test('a customer cannot change anyone\'s status', async () => {
    const res = await request(app)
      .patch('/customers/c2/status')
      .set(bearer('customer-token'))
      .send({ status: 'active' });
    expect(res.status).toBe(403);
    expect(documents.customers.c2.status).toBe('suspended');
  });

  test('an admin can delete a customer, profile and login', async () => {
    const res = await request(app).delete('/customers/c1').set(bearer('admin-token'));
    expect(res.status).toBe(204);
    expect(documents.customers.c1).toBeUndefined();
    expect(auth.deleteUser).toHaveBeenCalledWith('c1');
  });

  test('a customer cannot delete a customer', async () => {
    const res = await request(app).delete('/customers/c2').set(bearer('customer-token'));
    expect(res.status).toBe(403);
    expect(documents.customers.c2).toBeDefined();
    expect(auth.deleteUser).not.toHaveBeenCalled();
  });

  test('an active customer can read their own profile', async () => {
    const res = await request(app).get('/customers/me').set(bearer('customer-token'));
    expect(res.status).toBe(200);
    expect(res.body.data.customer_id).toBe('c1');
  });

  test('a suspended customer is blocked from their own profile', async () => {
    const res = await request(app).get('/customers/me').set(bearer('suspended-token'));
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('ACCOUNT_SUSPENDED');
  });

  test('a suspended customer is blocked from favourites too', async () => {
    const res = await request(app).get('/customers/me/favourites').set(bearer('suspended-token'));
    expect(res.status).toBe(403);
    expect(res.body.error.code).toBe('ACCOUNT_SUSPENDED');
  });
});