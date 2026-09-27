import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="footer">
      <div className="footer__row">
        <div>
          <div className="footer__brand">Kisan Price</div>
          <p className="footer__tag">{t("footer.tagline")}</p>
        </div>
        <div className="footer__links">
          <Link to="/explore">{t("footer.exploreListings")}</Link>
          <Link to="/upload">{t("footer.uploadSample")}</Link>
          <Link to="/contact">{t("footer.contact")}</Link>
        </div>
        <div className="footer__meta">
          <p>{t("footer.prototype")}</p>
          <p>© {new Date().getFullYear()} Kisan Price</p>
        </div>
      </div>
    </footer>
  );
}
