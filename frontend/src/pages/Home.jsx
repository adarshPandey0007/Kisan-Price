import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";
import Ticker from "../components/Ticker";

export default function Home() {
  const { t } = useLanguage();
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.getPosts().then((d) => setPosts(d.posts)).catch(() => {});
  }, []);

  const steps = t("home.steps");
  const features = t("home.features");

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__copy">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {t("home.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            {t("home.heroSubtitle")}
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <Link to="/auth?role=farmer" className="btn btn--primary">
              {t("home.joinFarmer")}
            </Link>
            <Link to="/auth?role=vendor" className="btn btn--ghost">
              {t("home.joinVendor")}
            </Link>
          </motion.div>
          <p className="hero__note">{t("home.heroNote")}</p>
        </div>

        <motion.div
          className="hero__panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="hero__panel-label">{t("home.tickerLabel")}</p>
          <Ticker items={posts} />
        </motion.div>
      </section>

      <section className="section steps">
        <h2>{t("home.stepsTitle")}</h2>
        <div className="steps__grid">
          {steps.map((s, i) => (
            <div className="step" key={s.title}>
              <span className="step__n">{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section features">
        <h2>{t("home.featuresTitle")}</h2>
        <div className="features__grid">
          {features.map((f) => (
            <div className="feature" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section cta-band">
        <h2>{t("home.ctaTitle")}</h2>
        <p>{t("home.ctaBody")}</p>
        <Link to="/upload" className="btn btn--primary">
          {t("home.ctaButton")}
        </Link>
      </section>
    </div>
  );
}
