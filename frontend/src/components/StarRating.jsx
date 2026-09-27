export default function StarRating({ value = 0, onChange, size = 18, readOnly = false }) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <span className="star-rating" role={readOnly ? "img" : "radiogroup"} aria-label={`${value} out of 5 stars`}>
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          disabled={readOnly}
          className={`star ${s <= Math.round(value) ? "star--filled" : ""}`}
          style={{ fontSize: size }}
          onClick={() => onChange && onChange(s)}
          aria-label={`${s} star${s > 1 ? "s" : ""}`}
        >
          ★
        </button>
      ))}
    </span>
  );
}
