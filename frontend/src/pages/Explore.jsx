import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import { useLanguage } from "../context/LanguageContext";
import PostCard from "../components/PostCard";
import PostModal from "../components/PostModal";
import PriceCheck from "../components/PriceCheck";

const FILTERS = ["All", "Premium", "Grade A", "Grade B", "Standard"];

export default function Explore() {
  const { t } = useLanguage();
  const [tab, setTab] = useState("feed");
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  const TABS = [
    { id: "feed", label: t("explore.tabFeed") },
    { id: "price", label: t("explore.tabPrice") },
  ];

  useEffect(() => {
    api
      .getPosts()
      .then((d) => setPosts(d.posts))
      .catch(() => setStatus("error"))
      .finally(() => setStatus("done"));
  }, []);

  const visible = useMemo(() => {
    return posts.filter((p) => {
      const matchesFilter = filter === "All" || p.quality === filter;
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        p.cropName.toLowerCase().includes(q) ||
        p.region.toLowerCase().includes(q) ||
        p.farmer?.name?.toLowerCase().includes(q);
      return matchesFilter && matchesSearch;
    });
  }, [posts, filter, search]);

  return (
    <div className="explore">
      <div className="explore__header">
        <div>
          <h1>{t("explore.title")}</h1>
          <p>{t("explore.subtitle")}</p>
        </div>
        <input
          className="explore__search"
          placeholder={t("explore.searchPlaceholder")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="explore__tabs">
        {TABS.map((tb) => (
          <button key={tb.id} className={tb.id === tab ? "active" : ""} onClick={() => setTab(tb.id)}>
            {tb.label}
          </button>
        ))}
      </div>

      {tab === "feed" && (
        <>
          <div className="explore__filters">
            {FILTERS.map((f) => (
              <button key={f} className={f === filter ? "active" : ""} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>

          {status === "loading" && <p className="explore__status">{t("explore.loading")}</p>}
          {status === "error" && <p className="explore__status">{t("explore.errorMsg")}</p>}
          {status === "done" && visible.length === 0 && (
            <p className="explore__status">{t("explore.empty")}</p>
          )}

          <div className="explore__grid">
            {visible.map((post) => (
              <PostCard key={post.id} post={post} onOpen={setActive} />
            ))}
          </div>

          {active && <PostModal post={active} onClose={() => setActive(null)} />}
        </>
      )}

      {tab === "price" && <PriceCheck />}
    </div>
  );
}
