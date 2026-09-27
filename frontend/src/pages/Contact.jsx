import { useState } from "react";
import { api } from "../api";

export default function Contact() {
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
        <h1>Talk to the Kisan Price team</h1>
        <p>Questions about listing your harvest, verifying a certificate, or partnering as a mandi — write to us.</p>
        <ul>
          <li>
            <strong>Support</strong>
            <span>support@kisanprice.in</span>
          </li>
          <li>
            <strong>Phone</strong>
            <span>+91 80000 12345</span>
          </li>
          <li>
            <strong>Office</strong>
            <span>Sector 12, Kanpur, Uttar Pradesh</span>
          </li>
        </ul>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <label>
          Name
          <input required value={form.name} onChange={(e) => update("name", e.target.value)} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        </label>
        <label>
          Message
          <textarea required rows={5} value={form.message} onChange={(e) => update("message", e.target.value)} />
        </label>

        {error && <p className="form__hint form__hint--error">{error}</p>}
        {status === "sent" && <p className="form__hint form__hint--ok">Message sent — we'll get back to you soon.</p>}

        <button className="btn btn--primary" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Send message"}
        </button>
      </form>
    </div>
  );
}
