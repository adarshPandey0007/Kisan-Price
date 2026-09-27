import { useState } from "react";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";

export default function Contact() {
  const { t } = useLanguage();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      await api.sendContact(form);
      setStatus("sent");
      setForm({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  return (
    <div className="contact-page">
      <div className="contact-info">
        <h1>{t("contact.title")}</h1>
        <p>{t("contact.subtitle")}</p>
        <ul>
          <li>
            <strong>{t("contact.support")}</strong>
            <span>support@kisanprice.in</span>
          </li>
          <li>
            <strong>{t("contact.phone")}</strong>
            <span>+91 80000 12345</span>
          </li>
          <li>
            <strong>{t("contact.office")}</strong>
            <span>Sector 12, Kanpur, Uttar Pradesh</span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          {t("contact.name")}
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label>
          {t("contact.email")}
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </label>
        <label>
          {t("contact.message")}
          <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} />
        </label>

        {error && <p className="form__hint form__hint--error">{error}</p>}
        {status === "sent" && <p className="form__hint form__hint--ok">{t("contact.sent")}</p>}

        <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? t("contact.sending") : t("contact.send")}
        </button>
      </form>
    </div>
  );
}
