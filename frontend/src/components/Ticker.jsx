const FALLBACK = [
  { cropName: "Basmati Rice", quality: "Premium", price: 62, unit: "kg", region: "Kanpur, UP" },
  { cropName: "Wheat", quality: "Standard", price: 24, unit: "kg", region: "Meerut, UP" },
  { cropName: "Maize", quality: "Grade A", price: 21, unit: "kg", region: "Nagpur, MH" },
  { cropName: "Bajra (Pearl Millet)", quality: "Grade B", price: 23, unit: "kg", region: "Jaipur, RJ" },
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
