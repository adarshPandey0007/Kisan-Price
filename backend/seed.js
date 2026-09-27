// Optional: run `node seed.js` once to add demo listings so Explore isn't empty.
import bcrypt from "bcryptjs";
import { v4 as uuid } from "uuid";
import { readDb, writeDb } from "./db.js";

const db = readDb();

const demoFarmers = [
  { name: "Ramesh Yadav", email: "ramesh@demo.in", region: "Kanpur, Uttar Pradesh", phone: "+91 98765 43210" },
  { name: "Suresh Patil", email: "suresh@demo.in", region: "Nagpur, Maharashtra", phone: "+91 91234 56780" },
  { name: "Gurpreet Singh", email: "gurpreet@demo.in", region: "Ludhiana, Punjab", phone: "+91 90000 11223" },
];

const demoPosts = [
  { cropName: "Basmati Rice", quality: "Premium", price: 62, unit: "kg", description: "Long-grain basmati, aged 12 months, low moisture, sun-dried on raised beds." },
  { cropName: "Wheat", quality: "Grade A", price: 25, unit: "kg", description: "Sharbati wheat, cleaned and graded, harvested this season." },
  { cropName: "Maize", quality: "Grade A", price: 21, unit: "kg", description: "Yellow maize, sun-dried, low moisture, tested for aflatoxin." },
];

async function seed() {
  if (db.users.length > 0) {
    console.log("Database already has data — skipping seed.");
    return;
  }
  const password = await bcrypt.hash("password123", 10);
  const users = demoFarmers.map((f) => ({
    id: uuid(),
    ...f,
    password,
    role: "farmer",
    createdAt: new Date().toISOString(),
  }));
  db.users.push(...users);

  demoPosts.forEach((p, i) => {
    db.posts.push({
      id: uuid(),
      farmerId: users[i % users.length].id,
      ...p,
      region: users[i % users.length].region,
      certificateUrl: null,
      imageUrls: [],
      createdAt: new Date().toISOString(),
    });
  });

  writeDb(db);
  console.log("Seeded 3 demo farmers (password: password123) and 3 listings.");
}

seed();
