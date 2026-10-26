import 'dotenv/config';
import { auth, db } from '../src/config/firebase';
import { FieldValue } from 'firebase-admin/firestore';

async function main() {
  const snapshot = await db.collection('admins').get();
  console.log(`Found ${snapshot.size} admin doc(s) to check.\n`);

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const email = data.email;
    const fullName = data.full_name ?? data.name ?? email;
    const role = data.role === 'superadmin' ? 'superadmin' : 'admin';

    if (!email) {
      console.log(`SKIP ${docSnap.id} — no email field, can't resolve.`);
      continue;
    }

    let userRecord;
    try {
      userRecord = await auth.getUserByEmail(email);
    } catch {
      console.log(`NO AUTH ACCOUNT — ${email} (doc ${docSnap.id}) has no matching Firebase Auth user. This "admin" was never real — it must be re-added through Admin Management so it gets a real login.`);
      continue;
    }

    if (docSnap.id === userRecord.uid) {
      console.log(`OK — ${email} already correctly keyed.`);
      continue;
    }

    // Write the correctly-keyed doc
    await db.collection('admins').doc(userRecord.uid).set({
      admin_id: userRecord.uid,
      full_name: fullName,
      email,
      role,
      created_at: data.created_at ?? FieldValue.serverTimestamp(),
    }, { merge: true });

    // Remove the old mis-keyed doc
    await docSnap.ref.delete();

    console.log(`FIXED — ${email}: ${docSnap.id} → ${userRecord.uid}`);
  }

  console.log('\nDone.');
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});