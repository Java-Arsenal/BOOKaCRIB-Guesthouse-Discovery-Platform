import 'dotenv/config';
import { auth, db } from '../src/config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

async function main() {
  const email = process.argv[2];
  const password = process.argv[3];
  const fullName = process.argv[4];

  if (!email || !password || !fullName) {
    console.error('Usage: tsx scripts/createFirstAdmin.ts <email> <password> "<full name>"');
    process.exit(1);
  }

  const userRecord = await auth.createUser({ email, password, displayName: fullName });

  await db.collection('admins').doc(userRecord.uid).set({
    admin_id: userRecord.uid,
    full_name: fullName,
    email,
    role: 'superadmin',
    created_at: FieldValue.serverTimestamp(),
  });

  console.log(`Admin created: ${userRecord.uid} (${email})`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
