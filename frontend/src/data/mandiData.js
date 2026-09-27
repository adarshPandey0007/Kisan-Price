// Demo data for the Price Check tool. This is illustrative, not a live
// mandi feed — swap getPrediction() for a real API/data source later.
import { GRAINS } from "./grains";

export const CROPS = GRAINS;

export const STATES = {
  "Uttar Pradesh": ["Kanpur Mandi", "Meerut Mandi", "Lucknow Mandi"],
  "Punjab": ["Ludhiana Mandi", "Amritsar Mandi"],
  "Haryana": ["Karnal Mandi", "Hisar Mandi"],
  "Maharashtra": ["Nagpur Mandi", "Pune Mandi"],
  "Madhya Pradesh": ["Indore Mandi", "Bhopal Mandi"],
  "Karnataka": ["Bengaluru Mandi", "Hubli Mandi"],
  "Rajasthan": ["Jaipur Mandi", "Kota Mandi"],
  "Bihar": ["Patna Mandi", "Gaya Mandi"],
};

const BASE_PRICE_PER_KG = {
  "Wheat": 24,
  "Basmati Rice": 62,
  "Non-Basmati Rice": 32,
  "Maize": 21,
  "Barley": 19,
  "Jowar (Sorghum)": 27,
  "Bajra (Pearl Millet)": 23,
  "Ragi (Finger Millet)": 34,
};

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seededRandom(seed) {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Deterministic "prediction" — same crop/state/mandi always returns the
// same numbers, so the demo feels stable rather than random each click.
export function getPrediction(cropName, state, mandi) {
  const base = BASE_PRICE_PER_KG[cropName] || 22;
  const seed = hashString(`${cropName}|${state}|${mandi}`);
  const r1 = seededRandom(seed);
  const r2 = seededRandom(seed + 1);

  const factor = 0.88 + r1 * 0.3;
  const price = Math.round(base * factor * 100) / 100;
  const trendDirection = r2 > 0.5 ? "up" : "down";
  const trendPercent = Math.round((r2 * 6 + 0.5) * 10) / 10;
  const low = Math.round(price * 0.92 * 100) / 100;
  const high = Math.round(price * 1.08 * 100) / 100;

  return { price, low, high, trendDirection, trendPercent, unit: "kg" };
}
