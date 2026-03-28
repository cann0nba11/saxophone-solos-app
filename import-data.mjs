import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { readFileSync } from "fs";
import { parse } from "csv-parse/sync";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const csvData = readFileSync("./saxophone_solos_final4.csv", "utf-8");
const records = parse(csvData, { columns: true, skip_empty_lines: true });

console.log(`Importing ${records.length} records...`);

for (const record of records) {
  await addDoc(collection(db, "solos"), {
    year: parseInt(record.Year),
    decade: record.Decade,
    songTitle: record["Song Title"],
    artist: record.Artist,
    soloist: record.Soloist,
    saxophoneType: record["Saxophone Type"],
  });
  process.stdout.write(".");
}

console.log("\nImport complete!");