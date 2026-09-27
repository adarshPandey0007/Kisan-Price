import { useState } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Auth() {
  const [params] = useSearchParams();
  const [mode, setMode] = useState("register");
  const [role, setRole] = useState(params.get("role") === "vendor" ? "vendor" : "farmer");
  const [form, setForm] = useState({ name: "", email: "", password: "", region: "", phone: "" });
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      if (mode === "login") {
        await login(form.email, form.password);
      } else {
        await register({ ...form, role });
      }
      const redirectTo = location.state?.from?.pathname || "/explore";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-tabs">
          <button className={mode === "register" ? "active" : ""} onClick={() => setMode("register")}>
            Register
          </button>
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")}>
            Log in
          </button>
        </div>

        {mode === "register" && (
          <div className="role-toggle">
            <button className={role === "farmer" ? "active" : ""} onClick={() => setRole("farmer")} type="button">
              I'm a farmer
            </button>
            <button className={role === "vendor" ? "active" : ""} onClick={() => setRole("vendor")} type="button">
              I'm a vendor
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "register" && (
            <label>
              Full name
              <input required value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Ramesh Yadav" />
            </label>
          )}

          <label>
            Email
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
            />
          </label>

          <label>
            Password
            <input
              required
              type="password"
              minLength={6}
              value={form.password}
              onChange={(e) => update("password", e.target.value)}
              placeholder="At least 6 characters"
            />
          </label>

          {mode === "register" && (
            <>
              <label>
                Region
                <input
                  required
                  value={form.region}
                  onChange={(e) => update("region", e.target.value)}
                  placeholder="District, State"
                />
              </label>
              <label>
                Phone
                <input
                  required
                  value={form.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="+91 90000 00000"
                />
              </label>
            </>
          )}

          {error && <p className="form__hint form__hint--error">{error}</p>}

          <button className="btn btn--primary" type="submit" disabled={busy}>
            {busy ? "Please wait…" : mode === "register" ? `Create ${role} account` : "Log in"}
          </button>
        </form>
      </div>
    </div>
  );
}
