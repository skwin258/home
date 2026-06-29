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
      const stepTime = 16;
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
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          setIsVisible(true);
          startCounter();
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
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
        <small>APP下載</small>
        <h2>隨時隨地 輕鬆開局</h2>
        <p>支援 iOS / Android，手機操作更直覺，投注、客服、優惠一鍵完成。</p>
      </div>

      <div className="app-download-content">
        <div className="app-phone-wrap">
          <img className="app-phone-img" src={phoneImage} alt="BC78999 APP 手機畫面" />
        </div>

        <div className="store-buttons">
          <a href="#" className="store-btn">
            <img src={googlePlayImage} alt="Google Play 下載" />
          </a>

          <a href="#" className="store-btn">
            <img src={appStoreImage} alt="App Store 下載" />
          </a>
        </div>
      </div>

      <div className="app-stats">
        <div>
          <strong className={isCountDone ? "count-finished" : ""}>
            {formatDownloadCount(downloadCount)}
          </strong>
          <span>下載次數</span>
        </div>

        <div>
          <strong>4.9★</strong>
          <span>綜合評分</span>
        </div>

        <div>
          <strong>99.9%</strong>
          <span>安全保障</span>
        </div>
      </div>
    </section>
  );
}

export default AppDownload;