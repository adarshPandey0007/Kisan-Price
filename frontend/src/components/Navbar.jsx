import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links = [
    { to: "/", label: "Home", end: true },
    { to: "/explore", label: "Explore" },
    { to: "/upload", label: "Upload" },
    { to: "/contact", label: "Contact" },
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

          {user ? (
            <div className="nav__user">
              <span className="nav__user-chip">
                {user.name.split(" ")[0]} · <em>{user.role}</em>
              </span>
              <button className="btn btn--ghost btn--sm" onClick={handleLogout}>
                Log out
              </button>
            </div>
          ) : (
            <NavLink to="/auth" className="btn btn--primary btn--sm" onClick={() => setOpen(false)}>
              Log in / Register
            </NavLink>
          )}
        </nav>
      </div>
    </header>
  );
}
