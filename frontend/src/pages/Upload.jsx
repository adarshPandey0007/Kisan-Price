import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { GRAINS } from "../data/grains";

const QUALITY_OPTIONS = ["Premium", "Grade A", "Grade B", "Standard"];
const UNIT_OPTIONS = ["kg", "quintal", "ton"];

export default function Upload() {
  const { token, user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [fields, setFields] = useState({ cropName: "", quality: "Grade A", description: "", price: "", unit: "kg" });
  const [certificate, setCertificate] = useState(null);
  const [images, setImages] = useState([]);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setFields((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("sending");
    try {
      const formData = new FormData();
      Object.entries(fields).forEach(([k, v]) => formData.append(k, v));
      if (certificate) formData.append("certificate", certificate);
      images.forEach((img) => formData.append("images", img));

      await api.createPost(formData, token);
      setStatus("sent");
      setTimeout(() => navigate("/explore"), 900);
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="upload-page">
      <div className="upload-card">
        <h1>{t("upload.title")}</h1>
        <p>
          {t("upload.loggedInAs")} <strong>{user?.name}</strong> ({user?.role}). {t("upload.helper")}
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <label>
            {t("upload.cropName")}
            <select required value={fields.cropName} onChange={(e) => update("cropName", e.target.value)}>
              <option value="">{t("upload.selectGrainPlaceholder")}</option>
              {GRAINS.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </label>

          <div className="upload-form__row">
            <label>
              {t("upload.quality")}
              <select value={fields.quality} onChange={(e) => update("quality", e.target.value)}>
                {QUALITY_OPTIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </label>

            <label>
              {t("upload.price")}
              <input required type="number" min="0" value={fields.price} onChange={(e) => update("price", e.target.value)} placeholder="0" />
            </label>

            <label>
              {t("upload.unit")}
              <select value={fields.unit} onChange={(e) => update("unit", e.target.value)}>
                {UNIT_OPTIONS.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label>
            {t("upload.description")}
            <textarea
              required
              rows={4}
              value={fields.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder={t("upload.descriptionPlaceholder")}
            />
          </label>

          <label>
            {t("upload.certificate")}
            <input type="file" accept="image/*" onChange={(e) => setCertificate(e.target.files[0])} />
          </label>

          <label>
            {t("upload.photos")}
            <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
          </label>

          {error && <p className="form__hint form__hint--error">{error}</p>}
          {status === "sent" && <p className="form__hint form__hint--ok">{t("upload.success")}</p>}

          <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
            {status === "sending" ? t("upload.uploading") : t("upload.publish")}
          </button>
        </form>
      </div>
    </div>
  );
}
