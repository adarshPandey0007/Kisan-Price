import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { api, ASSET_BASE } from "../api";
import { useAuth } from "../context/AuthContext";
import StarRating from "./StarRating";

export default function PostModal({ post, onClose, onDelete }) {
  const { user, token } = useAuth();
  const isOwner = user?.role === "farmer" && user?.id === post.farmerId;
  const [ratings, setRatings] = useState([]);
  const [average, setAverage] = useState(post.farmerRating?.average);
  const [count, setCount] = useState(post.farmerRating?.count || 0);
  const [myStars, setMyStars] = useState(0);
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState("idle");
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    api
      .getFarmerRatings(post.farmerId)
      .then((data) => {
        setRatings(data.ratings);
        setAverage(data.average);
        setCount(data.count);
      })
      .catch(() => {});
    return () => {
      document.body.style.overflow = "";
    };
  }, [post.farmerId]);

  async function submitRating(e) {
    e.preventDefault();
    if (!myStars) return;
    setStatus("sending");
    try {
      const { rating } = await api.rateFarmer({ farmerId: post.farmerId, stars: myStars, comment }, token);
      setRatings((r) => [rating, ...r]);
      setCount((c) => c + 1);
      setAverage((a) => (a ? Math.round((((a * count) + myStars) / (count + 1)) * 10) / 10 : myStars));
      setMyStars(0);
      setComment("");
      setStatus("sent");
    } catch (err) {
      setStatus("error");
    }
  }

  const images = post.imageUrls || [];

  return (
    <AnimatePresence>
      <motion.div
        className="modal__overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal__panel"
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="modal__close" onClick={onClose} aria-label="Close">
            ✕
          </button>

          <div className="modal__grid">
            <div className="modal__gallery">
              {images.length > 0 ? (
                <>
                  <img src={`${ASSET_BASE}${images[activeImage]}`} alt={`${post.cropName} sample ${activeImage + 1}`} />
                  {images.length > 1 && (
                    <div className="modal__thumbs">
                      {images.map((img, i) => (
                        <button
                          key={img}
                          className={i === activeImage ? "modal__thumb--active" : ""}
                          onClick={() => setActiveImage(i)}
                        >
                          <img src={`${ASSET_BASE}${img}`} alt={`Thumbnail ${i + 1}`} />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="modal__gallery-fallback">No sample photos uploaded</div>
              )}

              {post.certificateUrl && (
                <a className="modal__cert-link" href={`${ASSET_BASE}${post.certificateUrl}`} target="_blank" rel="noreferrer">
                  View quality certificate ↗
                </a>
              )}
            </div>

            <div className="modal__details">
              <span className="tag">{post.quality}</span>
              <h2>{post.cropName}</h2>
              <p className="modal__price">
                ₹{post.price} <small>per {post.unit}</small>
              </p>
              <p className="modal__description">{post.description}</p>

              {isOwner && (
                <div className="modal__manage">
                  <h4>Manage your listing</h4>
                  <p className="form__hint">This listing is visible to buyers. You can remove it at any time.</p>
                  <button
                    type="button"
                    className="btn btn--danger btn--sm"
                    onClick={() => onDelete?.(post)}
                  >
                    Delete this post
                  </button>
                </div>
              )}

              <div className="modal__farmer">
                <h4>{post.farmer?.name}</h4>
                <p>{post.region}</p>
                <p>{post.farmer?.phone}</p>
                <p>{post.farmer?.email}</p>
                <div className="modal__farmer-rating">
                  <StarRating value={average || 0} readOnly />
                  <span>{average ? `${average} average · ${count} rating${count === 1 ? "" : "s"}` : "No ratings yet"}</span>
                </div>
              </div>

              <div className="modal__rate">
                <h4>Rate this farmer</h4>
                {user ? (
                  <form onSubmit={submitRating}>
                    <StarRating value={myStars} onChange={setMyStars} size={22} />
                    <textarea
                      placeholder="Share how the quality and dealing were..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={2}
                    />
                    <button className="btn btn--primary btn--sm" type="submit" disabled={!myStars || status === "sending"}>
                      {status === "sending" ? "Sending..." : "Submit rating"}
                    </button>
                    {status === "sent" && <p className="form__hint form__hint--ok">Thanks — your rating was added.</p>}
                    {status === "error" && <p className="form__hint form__hint--error">Could not submit. Try again.</p>}
                  </form>
                ) : (
                  <p className="form__hint">Log in to rate this farmer.</p>
                )}
              </div>

              {ratings.length > 0 && (
                <ul className="modal__reviews">
                  {ratings.slice(0, 4).map((r) => (
                    <li key={r.id}>
                      <StarRating value={r.stars} readOnly size={13} />
                      <span className="modal__review-name">{r.raterName}</span>
                      {r.comment && <p>{r.comment}</p>}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
