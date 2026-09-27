import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { api } from "../api";
import Ticker from "../components/Ticker";

const STEPS = [
  {
    n: "1",
    title: "Upload the certificate and samples",
    body: "A farmer registers, then uploads the quality certificate along with photos of the actual crop batch.",
  },
  {
    n: "2",
    title: "Vendors review and compare",
    body: "Vendors browse verified listings on the explore feed, checking certificates, ratings, and asking price.",
  },
  {
    n: "3",
    title: "They connect directly",
    body: "Once a vendor likes a batch, contact details are right there — no middleman, no waiting on a call centre.",
  },
];

const FEATURES = [
  { title: "Verified certificates", body: "Every listing carries the quality certificate the buyer will actually check." },
  { title: "Direct contact, no broker", body: "Phone and region are shown on every sample — vendors reach farmers themselves." },
  { title: "Ratings that follow the farmer", body: "Past buyers rate quality and dealing, so trust builds with every sale." },
  { title: "Built for scale", body: "As more farmers and vendors join, the explore feed grows into a live mandi." },
];

export default function Home() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    api.getPosts().then((d) => setPosts(d.posts)).catch(() => {});
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <div className="hero__copy">
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Sell your harvest straight to buyers who verify before they buy.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 }}
          >
            Kisan Price is where farmers post quality certificates and crop
            samples, and vendors purchase with confidence — region, rating,
            and contact all in one listing.
          </motion.p>
          <motion.div
            className="hero__cta"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
          >
            <Link to="/auth?role=farmer" className="btn btn--primary">
              Join as a farmer
            </Link>
            <Link to="/auth?role=vendor" className="btn btn--ghost">
              Join as a vendor
            </Link>
          </motion.div>
          <p className="hero__note">Free to list. Free to browse. No brokers in between.</p>
        </div>

        <motion.div
          className="hero__panel"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <p className="hero__panel-label">Live on the explore feed</p>
          <Ticker items={posts} />
        </motion.div>
      </section>

      <section className="section steps">
        <h2>How a sale happens</h2>
        <div className="steps__grid">
          {STEPS.map((s) => (
            <div className="step" key={s.n}>
              <span className="step__n">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section features">
        <h2>Why farmers and vendors choose Kisan Price</h2>
        <div className="features__grid">
          {FEATURES.map((f) => (
            <div className="feature" key={f.title}>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section cta-band">
        <h2>Have a batch ready to sell?</h2>
        <p>Upload the certificate and photos in a couple of minutes.</p>
        <Link to="/upload" className="btn btn--primary">
          Upload a sample
        </Link>
      </section>
    </div>
  );
}
