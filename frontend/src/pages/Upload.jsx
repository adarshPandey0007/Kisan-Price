import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../context/AuthContext";

const QUALITY_OPTIONS = ["Premium", "Grade A", "Grade B", "Standard"];
const UNIT_OPTIONS = ["kg", "quintal", "ton"];

export default function Upload() {
  const { token, user } = useAuth();
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
        <h1>Upload a crop sample</h1>
        <p>
          Logged in as <strong>{user?.name}</strong> ({user?.role}). Add the certificate, a few photos, and pricing —
          this goes straight to the explore feed.
        </p>

        <form onSubmit={handleSubmit} className="upload-form">
          <label>
            Crop name
            <input required value={fields.cropName} onChange={(e) => update("cropName", e.target.value)} placeholder="e.g. Basmati Rice" />
          </label>

          <div className="upload-form__row">
            <label>
              Quality grade
              <select value={fields.quality} onChange={(e) => update("quality", e.target.value)}>
                {QUALITY_OPTIONS.map((q) => (
                  <option key={q} value={q}>
                    {q}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Price
              <input required type="number" min="0" value={fields.price} onChange={(e) => update("price", e.target.value)} placeholder="0" />
            </label>

            <label>
              Unit
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
            Description
            <textarea
              required
              rows={4}
              value={fields.description}
              onChange={(e) => update("description", e.target.value)}
              placeholder="Moisture level, harvest date, storage conditions, anything a buyer would ask…"
            />
          </label>

          <label>
            Quality certificate (image)
            <input type="file" accept="image/*" onChange={(e) => setCertificate(e.target.files[0])} />
          </label>

          <label>
            Sample photos (up to 5)
            <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files).slice(0, 5))} />
          </label>

          {error && <p className="form__hint form__hint--error">{error}</p>}
          {status === "sent" && <p className="form__hint form__hint--ok">Uploaded — heading to the explore feed…</p>}

          <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Uploading…" : "Publish listing"}
          </button>
        </form>
      </div>
    </div>
  );
}
