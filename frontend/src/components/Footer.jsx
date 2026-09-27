import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__row">
        <div>
          <div className="footer__brand">Kisan Price</div>
          <p className="footer__tag">A direct line between the field and the buyer.</p>
        </div>
        <div className="footer__links">
          <Link to="/explore">Explore listings</Link>
          <Link to="/upload">Upload a sample</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <div className="footer__meta">
          <p>Prototype build — demo data only.</p>
          <p>© {new Date().getFullYear()} Kisan Price</p>
        </div>
      </div>
    </footer>
  );
}
