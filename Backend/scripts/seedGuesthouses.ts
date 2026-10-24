import { db } from '../src/config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

const SEED_GUESTHOUSES = [
  {
    name: 'Thamalakane River House',
    description:
      'A riverside guesthouse in Maun with solar-backed power, a private deck overlooking the Thamalakane River, and easy access to the Okavango Delta gateway.',
    amenities: ['Free Wi-Fi', 'Solar backup power', 'River deck', 'Free parking'],
    location: { latitude: -19.9833, longitude: 23.4167 },
    price_per_night_bwp: 450,
    city: 'Maun',
    country: 'Botswana',
    contact_details: {
      contact_name: 'Naledi Phiri',
      phone: '+267 71 234 567',
      email: 'bookings@thamalakaneriverhouse.bw',
    },
  },
  {
    name: 'Kalahari Rest Lodge',
    description:
      'A quiet, family-run lodge in Kang offering clean en-suite rooms, a communal kitchen, and friendly hosts familiar with Kalahari routes.',
    amenities: ['Free Wi-Fi', 'Communal kitchen', 'Air conditioning'],
    location: { latitude: -23.6833, longitude: 22.8333 },
    price_per_night_bwp: 320,
    city: 'Kang',
    country: 'Botswana',
    contact_details: {
      contact_name: 'Thabo Moatshe',
      phone: '+267 72 345 678',
      email: 'kalaharirest@example.com',
    },
  },
  {
    name: 'Acacia Student & Guest Lodge',
    description:
      'Affordable, no-frills accommodation in Palapye tailor-made for students and short stays, a short walk from BIUST.',
    amenities: ['Free Wi-Fi', 'Study desk', 'Kitchenette'],
    location: { latitude: -22.55, longitude: 27.1333 },
    price_per_night_bwp: 280,
    city: 'Palapye',
    country: 'Botswana',
    contact_details: {
      contact_name: 'Kago Setlhare',
      phone: '+267 73 456 789',
      email: 'acacialodge@example.com',
    },
  },
  {
    name: 'Mokolodi Haven Retreat',
    description:
      'A cozy, handpicked stay in Gaborone with fast Wi-Fi, air conditioning, and free parking — ready for quick, flexible booking.',
    amenities: ['Fast Wi-Fi', 'Air conditioning', 'Free parking'],
    location: { latitude: -24.6282, longitude: 25.9231 },
    price_per_night_bwp: 340,
    city: 'Gaborone',
    country: 'Botswana',
    contact_details: {
      contact_name: 'Boitumelo Kgosi',
      phone: '+267 74 567 890',
      email: 'mokolodihaven@example.com',
    },
  },
  {
    name: 'Tati River Cottage',
    description:
      'A peaceful cottage on the edge of Francistown, close to the Tati River, with a private garden and self-catering facilities.',
    amenities: ['Free Wi-Fi', 'Garden', 'Self-catering kitchen'],
    location: { latitude: -21.17, longitude: 27.5083 },
    price_per_night_bwp: 300,
    city: 'Francistown',
    country: 'Botswana',
    contact_details: {
      contact_name: 'Lesego Ndlovu',
      phone: '+267 75 678 901',
      email: 'tatirivercottage@example.com',
    },
  },
];

async function seed() {
  const guesthouses = db.collection('guesthouses');

  for (const g of SEED_GUESTHOUSES) {
    const existing = await guesthouses.where('name', '==', g.name).limit(1).get();
    if (!existing.empty) {
      console.log(`Skipping "${g.name}" — already exists (${existing.docs[0].id})`);
      continue;
    }

    const doc = await guesthouses.add({
      ...g,
      created_by: 'seed-script',
      average_rating: 0,
      rating_sum: 0,
      rating_count: 0,
      logo_url: null,
      gallery_urls: [],
      created_at: FieldValue.serverTimestamp(),
      updated_at: FieldValue.serverTimestamp(),
    });
    console.log(`Created "${g.name}" (${doc.id})`);
  }

  console.log('Done.');
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});