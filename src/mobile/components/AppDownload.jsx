import { useEffect, useRef, useState } from "react";

import phoneImage from "../assets/phone.png";
import appStoreImage from "../assets/app_ios.webp";
import googlePlayImage from "../assets/app_google.webp";

function AppDownload() {
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [downloadCount, setDownloadCount] = useState(0);
  const [isCountDone, setIsCountDone] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const startCounter = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      let start = 0;
      const end = 50000;
      const duration = 1800;
      const stepTime = 32;
      const increment = end / (duration / stepTime);

      const timer = setInterval(() => {
        start += increment;

        if (start >= end) {
          start = end;
          clearInterval(timer);
          setIsCountDone(true);
        }

        setDownloadCount(Math.floor(start));
      }, stepTime);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounter();
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const formatDownloadCount = (num) => {
    if (num >= 50000) return "50000+";
    return `${num}+`;
  };

  return (
    <section
      className={`app-download ${isVisible ? "app-download-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="section-header">
        <small>APP DOWNLOAD</small>
        <h2>隨時開局 掌握精彩</h2>
        <p>支援 iOS / Android，快速登入，體育與娛樂一站暢玩。</p>
      </div>

      <div className="app-download-content">
        <div className="app-phone-wrap">
          <img
            className="app-phone-img"
            src={phoneImage}
            alt="BC78999 APP 預覽"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="store-buttons">
          <a href="#" className="store-btn" aria-label="下載 Google Play 版本">
            <img src={googlePlayImage} alt="Google Play" loading="lazy" decoding="async" />
          </a>

          <a href="#" className="store-btn" aria-label="下載 App Store 版本">
            <img src={appStoreImage} alt="App Store" loading="lazy" decoding="async" />
          </a>
        </div>
      </div>

      <div className="app-stats">
        <div>
          <strong className={isCountDone ? "count-finished" : ""}>
            {formatDownloadCount(downloadCount)}
          </strong>
          <span>下載人次</span>
        </div>

        <div>
          <strong>4.9</strong>
          <span>用戶評分</span>
        </div>

        <div>
          <strong>99.9%</strong>
          <span>穩定服務</span>
        </div>
      </div>
    </section>
  );
}

export default AppDownload;
