jest.mock('../src/config/firebase', () => ({
    db: { collection: jest.fn() },
    auth: { verifyIdToken: jest.fn() },
}));

jest.mock('firebase-admin/firestore', () => ({
    FieldValue: {
        serverTimestamp: jest.fn(() => 'SERVER_TIMESTAMP'),
        arrayUnion: jest.fn((value: unknown) => ({ operation: 'arrayUnion', value })),
        arrayRemove: jest.fn((value: unknown) => ({ operation: 'arrayRemove', value })),
    },
}));

const { db } = jest.requireMock('../src/config/firebase');
const {
    createCustomer,
    getMe,
    updateMe,
    getFavourites,
    addFavourite,
    removeFavourite,
} = require('../src/controllers/customerController');

const documents: Record<string, Record<string, any>> = { customers: {}, guesthouses: {} };
let lastUpdate: Record<string, any> | undefined;

function snapshot(value: Record<string, any> | undefined) {
    return {
        exists: value !== undefined,
        data: () => value,
        get: (field: string) => value?.[field],
    };
}

function reference(collection: string, id: string) {
    return {
        get: async () => snapshot(documents[collection][id]),
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
    };
}

db.collection.mockImplementation((collection: string) => ({
    doc: (id: string) => reference(collection, id),
}));

function response() {
    const res: any = { json: jest.fn(), status: jest.fn(), end: jest.fn() };
    res.status.mockReturnValue(res);
    res.end.mockReturnValue(res);
    return res;
}

beforeEach(() => {
    documents.customers = {};
    documents.guesthouses = { gh1: { name: 'Test Guesthouse' } };
    lastUpdate = undefined;
});

describe('createCustomer', () => {
    test('creates a profile from the token and the name', async () => {
        const res = response();
        const next = jest.fn();
        await createCustomer(
            { user: { uid: 'c1', email: 'c1@example.test' }, body: { full_name: 'Test Customer' } },
            res,
            next,
        );

        expect(documents.customers.c1).toEqual(
            expect.objectContaining({
                customer_id: 'c1',
                full_name: 'Test Customer',
                email: 'c1@example.test',
                favourites: [],
            }),
        );
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ success: true }));
        expect(next).not.toHaveBeenCalled();
    });

    test('stores a null email when the token has none', async () => {
        await createCustomer(
            { user: { uid: 'c1' }, body: { full_name: 'Test Customer' } },
            response(),
            jest.fn(),
        );
        expect(documents.customers.c1.email).toBeNull();
    });

    test('refuses a duplicate profile with 409', async () => {
        documents.customers.c1 = { customer_id: 'c1', full_name: 'Existing' };
        const res = response();
        const next = jest.fn();
        await createCustomer(
            { user: { uid: 'c1' }, body: { full_name: 'Test Customer' } },
            res,
            next,
        );

        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ status: 409, code: 'CUSTOMER_EXISTS' }),
        );
        expect(res.status).not.toHaveBeenCalled();
        expect(documents.customers.c1.full_name).toBe('Existing');
    });
})

describe('getMe', () => {
    test('returns the signed-in customer profile', async () => {
        documents.customers.c1 = { customer_id: 'c1', full_name: 'Ann', favourites: [] };
        const res = response();
        await getMe({ user: { uid: 'c1' } }, res, jest.fn());
        expect(res.json).toHaveBeenCalledWith({ success: true, data: documents.customers.c1 });
    });

    test('returns 404 when no profile exists', async () => {
        const next = jest.fn();
        await getMe({ user: { uid: 'c1' } }, response(), next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ status: 404, code: 'CUSTOMER_NOT_FOUND' }),
        );
        expect(lastUpdate).toBeUndefined();
    });
});

describe('updateMe', () => {
    test('changes only the name', async () => {
        documents.customers.c1 = { customer_id: 'c1', full_name: 'Ann', favourites: ['gh1'] };
        const res = response();
        await updateMe({ user: { uid: 'c1' }, body: { full_name: 'Bea' } }, res, jest.fn());

        expect(lastUpdate).toEqual({ full_name: 'Bea' });
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            data: expect.objectContaining({ full_name: 'Bea', favourites: ['gh1'] }),
        });
    });

    test('returns 404 when no profile exists', async () => {
        const next = jest.fn();
        await updateMe({ user: { uid: 'c1' }, body: { full_name: 'Bea' } }, response(), next);
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ status: 404, code: 'CUSTOMER_NOT_FOUND' }),
        );
        expect(lastUpdate).toBeUndefined();
    });
});

describe('favourites failure cases', () => {
    test('getFavourites returns an empty list when the field is missing', async () => {
        documents.customers.c1 = { customer_id: 'c1' };
        const res = response();
        await getFavourites({ user: { uid: 'c1', } }, res, jest.fn());
        expect(res.json).toHaveBeenCalledWith({ success: true, data: [] });
    });

    test('getFavourites returns 404 without a profile', async () => {
        const next = jest.fn();
        await getFavourites({ user: { uid: 'c1' } }, response(), next);
        expect(next).toHaveBeenCalledWith(expect.objectContaining({ status: 404 }));
    });

    test('addFavourite returns 404 without a customer profile', async () => {
        const next = jest.fn();
        await addFavourite(
            { user: { uid: 'c1' }, params: { guesthouseId: 'gh1' } },
            response(),
            next,
        );
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ status: 404, code: 'CUSTOMER_NOT_FOUND' }),
        );
        expect(lastUpdate).toBeUndefined();
    });

    test('addFavourite returns 404 for an unknown guesthouse', async () => {
        documents.customers.c1 = { customer_id: 'c1', favourites: [] };
        const next = jest.fn();
        await addFavourite(
            { user: { uid: 'c1' }, params: { guesthouseId: 'missing' } },
            response(),
            next,
        );
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ status: 404, code: 'GUESTHOUSE_NOT_FOUND' }),
        );
        expect(lastUpdate).toBeUndefined();
    });

    test('addFavourite rejects a blank guesthouse ID with 400', async () => {
        documents.customers.c1 = { customer_id: 'c1', favourites: [] };
        const next = jest.fn();
        await addFavourite(
            { user: { uid: 'c1' }, params: { guesthouseId: '  ' } },
            response(),
            next,
        );
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ status: 400, code: 'INVALID_GUESTHOUSE_ID' }),
        );
    });

    test('removeFavourite returns 404 without a customer profile', async () => {
        const next = jest.fn();
        await removeFavourite(
            { user: { uid: 'c1' }, params: { guesthouseId: 'gh1' } },
            response(),
            next,
        );
        expect(next).toHaveBeenCalledWith(
            expect.objectContaining({ status: 404, code: 'CUSTOMER_NOT_FOUND' }),
        );
        expect(lastUpdate).toBeUndefined();
    });

    test('removeFavourite still works after the guesthouse was deleted', async () => {
        documents.customers.c1 = { customer_id: 'c1', favourites: ['gone'] };
        const res = response();
        await removeFavourite(
            { user: { uid: 'c1' }, params: { guesthouseId: 'gone' } },
            res,
            jest.fn(),
        );
        expect(lastUpdate).toEqual({ favourites: { operation: 'arrayRemove', value: 'gone' } });
        expect(res.status).toHaveBeenCalledWith(204);
    });
});