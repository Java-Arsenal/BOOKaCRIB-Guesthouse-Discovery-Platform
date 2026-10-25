import { upsertRatingSchema } from '../src/schemas/ratings';
import { createCustomerSchema, updateCustomerSchema } from '../src/schemas/customer';

describe('upsertRatingSchema', () => {
    test.each([1, 2, 3, 4, 5])('accepts a score of %i', (score) => {
        const { error } = upsertRatingSchema.validate({ guesthouse_id: 'gh1', score });
        expect(error).toBeUndefined();
    });

    test.each([0, 6, 4.5, -1])('rejects a score of %p', (score) => {
        const { error } = upsertRatingSchema.validate({ guesthouse_id: 'gh1', score });
        expect(error).toBeDefined();
    });

    test('rejects a missing score', () => {
        const { error } = upsertRatingSchema.validate({ guesthouse_id: 'gh1' });
        expect(error).toBeDefined();
    });

    test('rejects a missing guesthouse_id', () => {
        const { error } = upsertRatingSchema.validate({ score: 4 });
        expect(error).toBeDefined();
    });

    test('allows an empty comment', () => {
        const { error } = upsertRatingSchema.validate({ guesthouse_id: 'gh1', score: 4, comment: ''});
        expect(error).toBeUndefined();
    });

    test('rejects a comment over 500 characters', () => {
        const { error } = upsertRatingSchema.validate({
            guesthouse_id: 'gh1',
            score: 4,
            comment: 'a'.repeat(501),
        });
    });

    describe.each([
        ['createCustomerSchema', createCustomerSchema],
        ['updateCustomerSchema', updateCustomerSchema],
    ])('%s', (_name, schema) => {
        test('accepts a normal name', () => {
            const { error } = schema.validate({ full_name: 'Test Customer' });
            expect(error).toBeUndefined();
        });

        test('rejects a missing name', () => {
            const { error } = schema.validate({});
            expect(error).toBeDefined();
        });

        test('rejects a one-character name', () => {
            const { error } = schema.validate({ full_name: 'A' });
            expect(error).toBeDefined();
        });

        test('trims spaces around the name', () => {
            const { value } = schema.validate({ full_name: ' Ann ' });
            expect(value.full_name).toBe('Ann');
        });
    });
})