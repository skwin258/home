import { useEffect, useRef, useState } from "react";

const WORDPRESS_API = "https://bc78999.com/wp-json/wp/v2/posts";

function RecentArticles() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const decodeHtml = (html = "") => {
    const textarea = document.createElement("textarea");
    textarea.innerHTML = html;
    return textarea.value;
  };

  const stripHtml = (html = "") => {
    return decodeHtml(html.replace(/<[^>]*>/g, "")).trim();
  };

  const getPostImage = (post) => {
    return (
      post?._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
      "https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=1200&auto=format&fit=crop"
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";

    return new Date(dateString).toLocaleDateString("zh-TW", {
      timeZone: "Asia/Taipei",
      month: "2-digit",
      day: "2-digit",
    });
  };

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        setErrorText("");

        const url = `${WORDPRESS_API}?_embed=1&per_page=3`;

        console.log("WordPress API URL:", url);

        const res = await fetch(url);

        console.log("WordPress API status:", res.status);

        if (!res.ok) {
          throw new Error(`文章 API 請求失敗：${res.status}`);
        }

        const data = await res.json();

        console.log("WordPress articles:", data);

        if (!Array.isArray(data)) {
          throw new Error("文章資料格式錯誤");
        }

        if (data.length === 0) {
          throw new Error("目前 WordPress 沒有回傳文章");
        }

        setArticles(data);
      } catch (error) {
        console.error("WordPress articles error:", error);
        setErrorText(error.message || "目前無法取得文章");
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`recent-articles ${isVisible ? "recent-articles-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="section-header articles-header">
        <small>近期文章</small>
        <h2>最新消息 即時掌握</h2>
        <p> </p>
      </div>

      {loading && (
        <div className="articles-loading">
          <span></span>
          最新文章載入中...
        </div>
      )}

      {!loading && errorText && (
        <div className="articles-error">
          {errorText}
          <br />
          請打開 F12 Console 看 WordPress API status。
        </div>
      )}

      {!loading && !errorText && articles.length > 0 && (
        <div className="articles-list">
          {articles.map((post) => (
            <a
              className="article-card"
              href={post.link}
              target="_blank"
              rel="noreferrer"
              key={post.id}
            >
<div className="article-left">
  <div className="article-thumb-wrap">
    <img
      className="article-thumb"
      src={getPostImage(post)}
      alt={stripHtml(post.title?.rendered || "文章圖片")}
    />
  </div>

  <span className="article-date">{formatDate(post.date)}</span>
</div>

              <div className="article-content">
                <h3>{stripHtml(post.title?.rendered || "未命名文章")}</h3>
                <p>{stripHtml(post.excerpt?.rendered || "").slice(0, 46)}...</p>

                <div className="article-more">
                  <span>閱讀更多</span>
                  <strong>›</strong>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export default RecentArticles;