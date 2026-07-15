import { useEffect, useRef, useState } from "react";

import foxCta from "../assets/fox-cta.png";

const LINE_URL = "https://lin.ee/tmJOJNM";

function FoxCTA() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`fox-cta-section ${isVisible ? "fox-cta-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="fox-cta-img-wrap">
        <img
          className="fox-cta-img"
          src={foxCta}
          alt="立即加入 BC78999"
          loading="lazy"
          decoding="async"
        />
      </div>

      <div className="fox-cta-actions">
        <a className="fox-register-btn" href={LINE_URL} target="_blank" rel="noreferrer">
          立即註冊
        </a>

        <a className="fox-line-btn" href={LINE_URL} target="_blank" rel="noreferrer">
          <span className="fox-line-icon">LINE</span>
          加入 LINE 客服
        </a>
      </div>
    </section>
  );
}

export default FoxCTA;
