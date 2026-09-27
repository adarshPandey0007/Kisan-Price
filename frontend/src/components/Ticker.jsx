const FALLBACK = [
  { cropName: "Basmati Rice", quality: "Premium", price: 62, unit: "kg", region: "Kanpur, UP" },
  { cropName: "Turmeric", quality: "Grade A", price: 145, unit: "kg", region: "Warangal, TS" },
  { cropName: "Ginger", quality: "Grade A", price: 55, unit: "kg", region: "Shillong, ML" },
  { cropName: "Wheat", quality: "Standard", price: 24, unit: "kg", region: "Meerut, UP" },
];

export default function Ticker({ items }) {
  const rows = (items && items.length > 0 ? items : FALLBACK).slice(0, 6);
  const loop = [...rows, ...rows];

  return (
    <div className="ticker">
      <div className="ticker__track">
        {loop.map((row, i) => (
          <div className="ticker__row" key={i}>
            <span className="ticker__crop">{row.cropName}</span>
            <span className="ticker__quality">{row.quality}</span>
            <span className="ticker__region">{row.region}</span>
            <span className="ticker__price">
              ₹{row.price}/{row.unit}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
