import { auth, db } from '../src/config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

async function seedEmulator() {
  if (!process.env.FIRESTORE_EMULATOR_HOST || !process.env.FIREBASE_AUTH_EMULATOR_HOST) {
    throw new Error('Start both Firebase emulators before running this seed script.');
  }

  const email = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.test';
  const password = process.env.SEED_ADMIN_PASSWORD ?? 'local-admin-password';
  let admin;
  try {
    admin = await auth.getUserByEmail(email);
  } catch (error) {
    if ((error as { code?: string }).code !== 'auth/user-not-found') throw error;
    admin = await auth.createUser({ email, password, displayName: 'Local Admin' });
  }

  await db.collection('admins').doc(admin.uid).set({
    admin_id: admin.uid,
    full_name: admin.displayName ?? 'Local Admin',
    email,
    role: 'superadmin',
    created_at: FieldValue.serverTimestamp(),
  });

  const now = FieldValue.serverTimestamp();
  const guesthouses = [
    {
      guesthouse_id: 'demo-gaborone',
      name: 'Mokolodi Guesthouse',
      description: 'A quiet guesthouse close to Gaborone nature and city attractions.',
      amenities: ['Wi-Fi', 'Parking', 'Breakfast'],
      location: { latitude: -24.6906, longitude: 25.8582 },
      price_per_night_bwp: 850,
      city: 'Gaborone',
      country: 'Botswana',
      contact_details: { phone: '+267 390 0000', email: 'stay@example.test' },
    },
    {
      guesthouse_id: 'demo-maun',
      name: 'Thamalakane Riverside Stay',
      description: 'A relaxed riverside base for exploring Maun and the Okavango Delta.',
      amenities: ['Wi-Fi', 'Pool', 'Airport shuttle'],
      location: { latitude: -19.9833, longitude: 23.4167 },
      price_per_night_bwp: 1200,
      city: 'Maun',
      country: 'Botswana',
      contact_details: { phone: '+267 686 0000', email: 'maun@example.test' },
    },
  ];

  const batch = db.batch();
  for (const guesthouse of guesthouses) {
    const { guesthouse_id, ...data } = guesthouse;
    batch.set(db.collection('guesthouses').doc(guesthouse_id), {
      ...data,
      created_by: admin.uid,
      average_rating: 4.5,
      logo_url: null,
      gallery_urls: [],
      created_at: now,
      updated_at: now,
    });
  }

  batch.set(db.collection('customers').doc('demo-customer'), {
    customer_id: 'demo-customer',
    full_name: 'Demo Customer',
    email: 'customer@example.test',
    favourites: ['demo-gaborone'],
    created_at: now,
  });
  batch.set(db.collection('ratings').doc('demo-customer_demo-gaborone'), {
    rating_id: 'demo-customer_demo-gaborone',
    guesthouse_id: 'demo-gaborone',
    customer_id: 'demo-customer',
    score: 4.5,
    comment: 'A comfortable stay in a convenient location.',
    created_at: now,
    updated_at: now,
  });
  await batch.commit();

  console.log(`Seeded Firebase emulators. Admin login: ${email} / ${password}`);
}

seedEmulator().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});