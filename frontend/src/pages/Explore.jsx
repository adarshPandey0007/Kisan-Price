import { useEffect, useMemo, useState } from "react";
import { api } from "../api";
import PostCard from "../components/PostCard";
import PostModal from "../components/PostModal";

const FILTERS = ["All", "Premium", "Grade A", "Grade B", "Standard"];

export default function Explore() {
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");
  const [active, setActive] = useState(null);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

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
          <h1>Explore verified samples</h1>
          <p>Every card is an uploaded certificate and crop photo from a registered farmer.</p>
        </div>
        <input
          className="explore__search"
          placeholder="Search crop, region or farmer…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="explore__filters">
        {FILTERS.map((f) => (
          <button key={f} className={f === filter ? "active" : ""} onClick={() => setFilter(f)}>
            {f}
          </button>
        ))}
      </div>

      {status === "loading" && <p className="explore__status">Loading listings…</p>}
      {status === "error" && (
        <p className="explore__status">
          Couldn't reach the backend. Make sure the API server is running on the configured port.
        </p>
      )}
      {status === "done" && visible.length === 0 && (
        <p className="explore__status">No listings match yet — be the first to upload one.</p>
      )}

      <div className="explore__grid">
        {visible.map((post) => (
          <PostCard key={post.id} post={post} onOpen={setActive} />
        ))}
      </div>

      {active && <PostModal post={active} onClose={() => setActive(null)} />}
    </div>
  );
}
