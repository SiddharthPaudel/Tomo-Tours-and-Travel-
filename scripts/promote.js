import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

// Import the service account key using the helper
const serviceAccount = require("../serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const emailToPromote = process.argv[2]; 

if (!emailToPromote) {
  console.error("❌ Error: Please provide an email. Example: npm run promote user@gmail.com");
  process.exit(1);
}

const makeAdmin = async () => {
  console.log(`🚀 Modern ESM Script: Searching for ${emailToPromote}...`);
  
  try {
    const userRef = db.collection("users").where("email", "==", emailToPromote);
    const snapshot = await userRef.get();
    
    if (snapshot.empty) {
      console.log("❌ Error: User not found in Firestore. Did they sign up?");
      process.exit(1);
    }

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.update(doc.ref, { role: "admin" });
    });

    await batch.commit();
    console.log(`\n✅ SUCCESS! ${emailToPromote} is now an Admin.`);
    process.exit(0);
  } catch (error) {
    console.error("❌ Firebase Admin Error:", error.message);
    process.exit(1);
  }
};

makeAdmin();