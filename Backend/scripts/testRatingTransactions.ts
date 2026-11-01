import assert from 'node:assert/strict';
import { db } from '../src/config/firebase';
import { deleteMyRating, upsertRating } from '../src/controllers/ratingController';

if (!process.env.FIRESTORE_EMULATOR_HOST) {
  throw new Error('Start the Firebase emulators first. This script refuses to run against real data.');
}

const GH = 'txtest-gh';
const LEGACY = 'txtest-legacy';
const customers = Array.from({ length: 20 }, (_, i) => `txtest-c${i + 1}`);

function fakeRes(): any {
  const res: any = {};
  res.json = () => res;
  res.status = () => res;
  res.end = () => res;
  return res;
}

function rate(customerId: string, guesthouseId: string, score: number) {
  const errors: unknown[] = [];
  const done = upsertRating(
    { user: { uid: customerId }, body: { guesthouse_id: guesthouseId, score } } as any,
    fakeRes(),
    ((e: unknown) => errors.push(e)) as any,
  );
  return { done, errors };
}

async function remove(customerId: string, guesthouseId: string) {
  const errors: unknown[] = [];
  await deleteMyRating(
    { user: { uid: customerId }, params: { guesthouseId } } as any,
    fakeRes(),
    ((e: unknown) => errors.push(e)) as any,
  );
  return errors;
}

async function clean() {
  const refs = [
    db.collection('guesthouses').doc(GH),
    db.collection('guesthouses').doc(LEGACY),
    ...customers.flatMap((c) => [
      db.collection('ratings').doc(`${c}_${GH}`),
      db.collection('ratings').doc(`${c}_${LEGACY}`),
    ]),
  ];
  await Promise.all(refs.map((ref) => ref.delete()));
}

async function guesthouse(id: string): Promise<any> {
  return (await db.collection('guesthouses').doc(id).get()).data();
}

const tests: [string, () => Promise<void>][] = [
    [
    '20 customers rating at the same time: totals match the ratings that were stored',
    async () => {
      const scores = customers.map((_, i) => (i % 5) + 1);
      const calls = customers.map((c, i) => rate(c, GH, scores[i]!));
      await Promise.all(calls.map((call) => call.done));

      const accepted = scores.filter((_, i) => calls[i]!.errors.length === 0);
      console.log(`      ${accepted.length} accepted, ${calls.length - accepted.length} rejected under contention`);

      const sum = accepted.reduce((a, b) => a + b, 0);
      const gh = await guesthouse(GH);
      assert.equal(gh.rating_count, accepted.length);
      assert.equal(gh.rating_sum, sum);
      assert.equal(gh.average_rating, accepted.length === 0 ? 0 : sum / accepted.length);
      const stored = await db.collection('ratings').where('guesthouse_id', '==', GH).get();
      assert.equal(stored.size, accepted.length);
    },
  ],
  [
    '20 ratings arriving in groups of 5 are all accepted with the right totals',
    async () => {
      for (let g = 0; g < 4; g++) {
        const group = customers.slice(g * 5, g * 5 + 5).map((c, i) => rate(c, GH, i + 1));
        await Promise.all(group.map((call) => call.done));
        assert.deepEqual(group.flatMap((call) => call.errors), []);
      }
      const gh = await guesthouse(GH);
      assert.equal(gh.rating_count, 20);
      assert.equal(gh.rating_sum, 60);
      assert.equal(gh.average_rating, 3);
    },
  ],
  [
    'the same customer submitting 10 times at once is counted once',
    async () => {
      const calls = Array.from({ length: 10 }, () => rate('txtest-c1', GH, 4));
      await Promise.all(calls.map((call) => call.done));
      assert.deepEqual(calls.flatMap((call) => call.errors), []);
      const gh = await guesthouse(GH);
      assert.equal(gh.rating_count, 1);
      assert.equal(gh.rating_sum, 4);
      assert.equal(gh.average_rating, 4);
    },
  ],
  [
    'changing a rating keeps the count and swaps the score',
    async () => {
      await rate('txtest-c1', GH, 5).done;
      await rate('txtest-c1', GH, 3).done;
      const gh = await guesthouse(GH);
      assert.equal(gh.rating_count, 1);
      assert.equal(gh.rating_sum, 3);
      assert.equal(gh.average_rating, 3);
    },
  ],
  [
    'deleting a rating removes it from the totals',
    async () => {
      await rate('txtest-c1', GH, 5).done;
      await rate('txtest-c2', GH, 3).done;
      assert.deepEqual(await remove('txtest-c1', GH), []);
      const gh = await guesthouse(GH);
      assert.equal(gh.rating_count, 1);
      assert.equal(gh.rating_sum, 3);
      assert.equal(gh.average_rating, 3);
    },
  ],
  [
    'deleting a rating works on an older guesthouse with no totals yet',
    async () => {
      await db.collection('guesthouses').doc(LEGACY).set({ name: 'Older Guesthouse' });
      for (const [customer, score] of [['txtest-c1', 4], ['txtest-c2', 2]] as const) {
        const id = `${customer}_${LEGACY}`;
        await db.collection('ratings').doc(id).set({
          rating_id: id,
          guesthouse_id: LEGACY,
          customer_id: customer,
          score,
        });
      }
      assert.deepEqual(await remove('txtest-c1', LEGACY), []);
      const gh = await guesthouse(LEGACY);
      assert.equal(gh.rating_count, 1);
      assert.equal(gh.rating_sum, 2);
      assert.equal(gh.average_rating, 2);
    },
  ],
];

async function main() {
  let failed = 0;
  for (const [name, run] of tests) {
    await clean();
    await db
      .collection('guesthouses')
      .doc(GH)
      .set({ name: 'Transaction Test', rating_sum: 0, rating_count: 0, average_rating: 0 });
    try {
      await run();
      console.log(`PASS  ${name}`);
    } catch (err) {
      failed += 1;
      console.log(`FAIL  ${name}`);
      console.log(`      ${err instanceof Error ? err.message : String(err)}`);
    }
  }
  await clean();
  console.log(failed === 0 ? '\nAll tests passed.' : `\n${failed} test(s) failed.`);
  process.exitCode = failed === 0 ? 0 : 1;
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});