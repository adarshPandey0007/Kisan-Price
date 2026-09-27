import { useState } from "react";
import { CROPS, STATES, getPrediction } from "../data/mandiData";
import { useLanguage } from "../context/LanguageContext";

export default function PriceCheck() {
  const { t } = useLanguage();
  const [crop, setCrop] = useState("");
  const [state, setState] = useState("");
  const [mandi, setMandi] = useState("");
  const [result, setResult] = useState(null);

  const mandiOptions = state ? STATES[state] || [] : [];
  const canSubmit = crop && state && mandi;

  function handleStateChange(value) {
    setState(value);
    setMandi("");
    setResult(null);
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;
    setResult(getPrediction(crop, state, mandi));
  }

  return (
    <div className="price-check">
      <div className="price-check__card">
        <h2>
          <span className="price-check__leaf" aria-hidden="true">
            🌿
          </span>
          {t("priceCheck.title")}
        </h2>
        <p>{t("priceCheck.subtitle")}</p>

        <form onSubmit={handleSubmit} className="price-check__form">
          <label>
            {t("priceCheck.selectCrop")}
            <select value={crop} onChange={(e) => setCrop(e.target.value)}>
              <option value="">{t("priceCheck.selectCropPlaceholder")}</option>
              {CROPS.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t("priceCheck.selectState")}
            <select value={state} onChange={(e) => handleStateChange(e.target.value)}>
              <option value="">{t("priceCheck.selectStatePlaceholder")}</option>
              {Object.keys(STATES).map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </label>

          <label>
            {t("priceCheck.selectMandi")}
            <select value={mandi} onChange={(e) => setMandi(e.target.value)} disabled={!state}>
              <option value="">{state ? t("priceCheck.selectMandiPlaceholder") : t("priceCheck.chooseStateFirst")}</option>
              {mandiOptions.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <button className="btn btn--primary price-check__submit" type="submit" disabled={!canSubmit}>
            {t("priceCheck.submit")}
          </button>
        </form>

        {result && (
          <div className="price-check__result">
            <p className="price-check__result-label">
              {crop} · {mandi}, {state}
            </p>
            <p className="price-check__result-price">
              ₹{result.price} <small>/{result.unit}</small>
            </p>
            <p className={`price-check__trend price-check__trend--${result.trendDirection}`}>
              {result.trendDirection === "up" ? "▲" : "▼"} {result.trendPercent}% {t("priceCheck.trendVsLastWeek")}
            </p>
            <p className="price-check__range">
              {t("priceCheck.typicalRange")}: ₹{result.low} – ₹{result.high} /{result.unit}
            </p>
            <p className="price-check__disclaimer">{t("priceCheck.disclaimer")}</p>
          </div>
        )}
      </div>
    </div>
  );
}
