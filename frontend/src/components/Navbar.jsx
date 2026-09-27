import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: t("nav.home"), end: true },
    { to: "/explore", label: t("nav.explore") },
    { to: "/upload", label: t("nav.upload") },
    { to: "/contact", label: t("nav.contact") },
  ];

  function handleLogout() {
    logout();
    navigate("/");
  }

  return (
    <header className="nav">
      <div className="nav__row">
        <NavLink to="/" className="nav__brand" onClick={() => setOpen(false)}>
          <span className="nav__brand-mark">Kisan</span> Price
        </NavLink>

        <button className="nav__toggle" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav__links ${open ? "nav__links--open" : ""}`}>
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) => `nav__link ${isActive ? "nav__link--active" : ""}`}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </NavLink>
          ))}

          <button
            className="nav__lang-toggle"
            onClick={toggleLanguage}
            aria-label="Switch language"
            title={lang === "en" ? "हिंदी में देखें" : "View in English"}
          >
            <span className={lang === "en" ? "nav__lang-active" : ""}>EN</span>
            <span className="nav__lang-sep">/</span>
            <span className={lang === "hi" ? "nav__lang-active" : ""}>हिं</span>
          </button>

          {user ? (
            <div className="nav__user">
              <span className="nav__user-chip">
                {user.name.split(" ")[0]} · <em>{user.role}</em>
              </span>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
                {t("nav.logout")}
              </button>
            </div>
          ) : (
            <NavLink to="/auth" className="btn btn--primary btn--sm" onClick={() => setOpen(false)}>
              {t("nav.loginRegister")}
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
