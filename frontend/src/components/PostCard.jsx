import { ASSET_BASE } from "../api";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import StarRating from "./StarRating";

export default function PostCard({ post, onOpen, onDelete }) {
  const { t } = useLanguage();
  const { user } = useAuth();
  const cover = post.imageUrls?.[0];
  const rating = post.farmerRating?.average;
  // Only the farmer who created this listing can delete it.
  const isOwner = user?.role === "farmer" && user?.id === post.farmerId;

  return (
    <div className="post-card">
      <button className="post-card__main" onClick={() => onOpen(post)}>
        <div className="post-card__media">
          {cover ? (
            <img src={`${ASSET_BASE}${cover}`} alt={`${post.cropName} sample`} loading="lazy" />
          ) : (
            <div className="post-card__media-fallback">{post.cropName.slice(0, 1)}</div>
          )}
          <span className="post-card__quality">{post.quality}</span>
          {post.certificateUrl && <span className="post-card__cert">{t("explore.certificateAttached")}</span>}
        </div>

        <div className="post-card__body">
          <div className="post-card__top">
            <h3>{post.cropName}</h3>
            <span className="post-card__price">
              ₹{post.price}
              <small> /{post.unit}</small>
            </span>
          </div>

          <p className="post-card__farmer">
            {post.farmer?.name} · {post.region}
          </p>

          <p className="post-card__contact">
            {post.farmer?.phone} {post.farmer?.email ? `· ${post.farmer.email}` : ""}
          </p>

          <div className="post-card__rating">
            <StarRating value={rating || 0} readOnly size={14} />
            <span>{rating ? `${rating} (${post.farmerRating.count})` : t("explore.noRatings")}</span>
          </div>
        </div>
      </button>

      {isOwner && (
        <div className="post-card__owner-actions">
          <button
            type="button"
            className="post-card__delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete?.(post);
            }}
          >
            Delete listing
          </button>
        </div>
      )}
    </div>
  );
}
