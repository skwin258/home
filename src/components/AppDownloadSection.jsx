import LaserFlow from "./LaserFlow";
import CountUpNumber from "./CountUpNumber";
import RevealOnScroll from "./RevealOnScroll";

function AppDownloadSection() {
  return (
    <section className="next-page laser-section app-download-section">

      <LaserFlow
        color="#CF9EFF"
        horizontalBeamOffset={-0.16}
        verticalBeamOffset={0.05}
        horizontalSizing={0.85}
        verticalSizing={2.6}
        wispDensity={1}
        wispSpeed={15}
        wispIntensity={4.5}
        flowSpeed={0.35}
        flowStrength={0.25}
        fogIntensity={0.42}
        fogScale={0.3}
        fogFallSpeed={0.6}
        decay={1.1}
        falloffStart={1.2}
      />

      <div className="app-download-layout reverse">
        <RevealOnScroll className="app-phone-reveal">
          <div className="app-phone-image-wrap">
            <img
              src="/images/app-phone.png"
              alt="APP 手機畫面"
              className="app-phone-main-img"
            />
          </div>
        </RevealOnScroll>

        <div className="app-download-text">
          <p className="app-label">APP下載</p>

          <h2>
            隨時隨地
            <br />
            輕鬆開局
          </h2>

          <p>
            支援 iOS / Android，手機操作更直覺，投注、客服、優惠一鍵完成。
          </p>

          <div className="app-store-row">
            <img
              src="/images/app_google.webp"
              alt="Google Play"
              className="store-badge"
            />

            <img
              src="/images/app_IOS.webp"
              alt="App Store"
              className="store-badge"
            />
          </div>

          <div className="app-data-row">
            <div>
              <CountUpNumber end={50000} duration={1800} suffix="+" />
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
        </div>
      </div>
    </section>
  );
}

export default AppDownloadSection;