import { useEffect, useState } from "react";
import "./RecentArticlesSection.css";

const POSTS_API =
  "https://bc78999.com/wp-json/wp/v2/posts?_embed&per_page=10";

const VIMEO_URL = "https://player.vimeo.com/video/1088061794";

function stripHtml(html = "") {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || div.innerText || "";
}

function formatPostDate(dateString) {
  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "";

  return new Intl.DateTimeFormat("zh-TW", {
    month: "numeric",
    day: "numeric",
  }).format(date);
}

function getPostImage(post) {
  return (
    post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
    "https://bc78999.com/wp-content/uploads/2025/11/cropped-BC-LOGO.jpg"
  );
}

function RecentArticlesSection() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      try {
        const res = await fetch(POSTS_API);
        const data = await res.json();

        if (!ignore) {
          setPosts(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("取得近期文章失敗：", error);
        if (!ignore) setPosts([]);
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, []);

  return (
    <section className="recent-section">
      <div className="recent-bg"></div>

      <div className="recent-inner">
        <div className="recent-left">
          <p className="recent-label">Casino Guide</p>
          <h2>BC博球攻略</h2>
          <h3>近期文章</h3>

          <div className="recent-post-list">
            {loading && <div className="recent-loading">文章讀取中...</div>}

            {!loading && posts.length === 0 && (
              <div className="recent-loading">目前沒有文章</div>
            )}

            {!loading &&
              posts.slice(0, 10).map((post) => {
                const title = stripHtml(post.title?.rendered);
                const excerpt = stripHtml(post.excerpt?.rendered);
                const image = getPostImage(post);

                return (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noreferrer"
                    className="recent-post-card"
                    key={post.id}
                  >
                    <div className="recent-post-thumb">
                      <img src={image} alt={title} />
                      <span>{formatPostDate(post.date)}</span>
                    </div>

                    <div className="recent-post-content">
                      <h4>{title}</h4>
                      <p>{excerpt}</p>

                      <div className="recent-read-more">
                        閱讀更多 <span>›</span>
                      </div>
                    </div>
                  </a>
                );
              })}
          </div>
        </div>

        <div className="recent-video-wrap">
          <div className="recent-video-card">
            <iframe
              src={VIMEO_URL}
              title="BC博球影片"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RecentArticlesSection;
