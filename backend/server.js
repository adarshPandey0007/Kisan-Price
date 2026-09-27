import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import { v4 as uuid } from "uuid";
import { readDb, writeDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOAD_DIR = path.join(__dirname, "uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const JWT_SECRET = process.env.JWT_SECRET || "kisan-price-dev-secret-change-me";
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET && process.env.NODE_ENV === "production") {
  console.error("Refusing to start: set a JWT_SECRET environment variable in production.");
  process.exit(1);
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(UPLOAD_DIR));

// ---------- multer (image / certificate storage) ----------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuid()}${ext}`);
  },
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (/^image\//.test(file.mimetype)) cb(null, true);
    else cb(new Error("Only image files are allowed"));
  },
});

// ---------- helpers ----------
function publicUser(user) {
  const { password, ...rest } = user;
  return rest;
}

function averageRating(ratings, farmerId) {
  const mine = ratings.filter((r) => r.farmerId === farmerId);
  if (mine.length === 0) return { average: null, count: 0 };
  const sum = mine.reduce((a, r) => a + r.stars, 0);
  return { average: Math.round((sum / mine.length) * 10) / 10, count: mine.length };
}

function authMiddleware(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Login required" });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch {
    return res.status(401).json({ error: "Session expired, please log in again" });
  }
}

// ---------- auth ----------
app.post("/api/auth/register", async (req, res) => {
  const { name, email, password, role, region, phone } = req.body;
  if (!name || !email || !password || !role || !region || !phone) {
    return res.status(400).json({ error: "All fields are required" });
  }
  if (!["farmer", "vendor"].includes(role)) {
    return res.status(400).json({ error: "Role must be farmer or vendor" });
  }
  const db = readDb();
  if (db.users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
    return res.status(409).json({ error: "An account with this email already exists" });
  }
  const hashed = await bcrypt.hash(password, 10);
  const user = {
    id: uuid(),
    name,
    email,
    password: hashed,
    role,
    region,
    phone,
    createdAt: new Date().toISOString(),
  };
  db.users.push(user);
  writeDb(db);
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.status(201).json({ token, user: publicUser(user) });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const db = readDb();
  const user = db.users.find((u) => u.email.toLowerCase() === (email || "").toLowerCase());
  if (!user) return res.status(401).json({ error: "No account found with this email" });
  const ok = await bcrypt.compare(password || "", user.password);
  if (!ok) return res.status(401).json({ error: "Incorrect password" });
  const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "7d" });
  res.json({ token, user: publicUser(user) });
});

app.get("/api/me", authMiddleware, (req, res) => {
  const db = readDb();
  const user = db.users.find((u) => u.id === req.userId);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user: publicUser(user) });
});

// ---------- posts (crop listings) ----------
function decoratePost(db, post) {
  const farmer = db.users.find((u) => u.id === post.farmerId);
  const { average, count } = averageRating(db.ratings, post.farmerId);
  return {
    ...post,
    farmer: farmer
      ? { id: farmer.id, name: farmer.name, region: farmer.region, phone: farmer.phone, email: farmer.email }
      : null,
    farmerRating: { average, count },
  };
}

app.get("/api/posts", (req, res) => {
  const db = readDb();
  const posts = [...db.posts]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((p) => decoratePost(db, p));
  res.json({ posts });
});

app.get("/api/posts/:id", (req, res) => {
  const db = readDb();
  const post = db.posts.find((p) => p.id === req.params.id);
  if (!post) return res.status(404).json({ error: "Listing not found" });
  res.json({ post: decoratePost(db, post) });
});

app.post(
  "/api/posts",
  authMiddleware,
  upload.fields([
    { name: "certificate", maxCount: 1 },
    { name: "images", maxCount: 5 },
  ]),
  (req, res) => {
    const { cropName, quality, description, price, unit } = req.body;
    if (!cropName || !quality || !description || !price || !unit) {
      return res.status(400).json({ error: "All listing fields are required" });
    }
    const db = readDb();
    const farmer = db.users.find((u) => u.id === req.userId);
    if (!farmer) return res.status(404).json({ error: "User not found" });

    const certificateFile = req.files?.certificate?.[0];
    const imageFiles = req.files?.images || [];

    const post = {
      id: uuid(),
      farmerId: farmer.id,
      cropName,
      quality,
      description,
      price: Number(price),
      unit,
      region: farmer.region,
      certificateUrl: certificateFile ? `/uploads/${certificateFile.filename}` : null,
      imageUrls: imageFiles.map((f) => `/uploads/${f.filename}`),
      createdAt: new Date().toISOString(),
    };
    db.posts.push(post);
    writeDb(db);
    res.status(201).json({ post: decoratePost(db, post) });
  }
);

// ---------- ratings ----------
app.post("/api/ratings", authMiddleware, (req, res) => {
  const { farmerId, stars, comment } = req.body;
  if (!farmerId || !stars) return res.status(400).json({ error: "farmerId and stars are required" });
  if (farmerId === req.userId) return res.status(400).json({ error: "You can't rate yourself" });
  const db = readDb();
  const rating = {
    id: uuid(),
    farmerId,
    raterId: req.userId,
    stars: Math.min(5, Math.max(1, Number(stars))),
    comment: comment || "",
    createdAt: new Date().toISOString(),
  };
  db.ratings.push(rating);
  writeDb(db);
  const rater = db.users.find((u) => u.id === req.userId);
  res.status(201).json({ rating: { ...rating, raterName: rater?.name || "Anonymous" } });
});

app.get("/api/farmers/:id/ratings", (req, res) => {
  const db = readDb();
  const ratings = db.ratings
    .filter((r) => r.farmerId === req.params.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map((r) => {
      const rater = db.users.find((u) => u.id === r.raterId);
      return { ...r, raterName: rater?.name || "Anonymous" };
    });
  res.json({ ratings, ...averageRating(db.ratings, req.params.id) });
});

// ---------- contact ----------
app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) return res.status(400).json({ error: "All fields are required" });
  const db = readDb();
  db.contacts.push({ id: uuid(), name, email, message, createdAt: new Date().toISOString() });
  writeDb(db);
  res.status(201).json({ ok: true });
});

app.get("/api/health", (req, res) => res.json({ ok: true, service: "kisan-price-backend" }));

app.listen(PORT, () => {
  console.log(`Kisan Price backend running on http://localhost:${PORT}`);
});
