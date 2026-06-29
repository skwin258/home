import foxImage from "../assets/fox.png";
import lightningImage from "../assets/lightning.png";
import shieldImage from "../assets/Shield.png";
import earphoneImage from "../assets/earphone.png";
import trophyImage from "../assets/Trophy.png";

const LINE_URL = "https://lin.ee/tmJOJNM";

function Hero() {
  return (
    <section className="hero-section">
      <div className="topbar-spacer" aria-hidden="true" />

      <div className="hero">
        <img className="fox-bg" src={foxImage} alt="BC78999 活動主視覺" />
      </div>

      <section className="action-area">
        <a className="main-btn" href={LINE_URL} target="_blank" rel="noreferrer">
          <span>立即註冊</span>
          <strong>›</strong>
        </a>

        <a className="line-btn" href={LINE_URL} target="_blank" rel="noreferrer">
          <span className="line-icon">LINE</span>
          <span>加入 LINE 好友</span>
        </a>
      </section>

      <section className="feature-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <img src={lightningImage} alt="" aria-hidden="true" />
          </div>
          <div className="feature-title">快速出入金</div>
          <div className="feature-sub">3分鐘到帳</div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={shieldImage} alt="" aria-hidden="true" />
          </div>
          <div className="feature-title">安全防護</div>
          <div className="feature-sub">多重加密</div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={earphoneImage} alt="" aria-hidden="true" />
          </div>
          <div className="feature-title">24H客服</div>
          <div className="feature-sub">真人服務</div>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <img src={trophyImage} alt="" aria-hidden="true" />
          </div>
          <div className="feature-title">穩定平台</div>
          <div className="feature-sub">流暢不卡頓</div>
        </div>
      </section>
    </section>
  );
}

export default Hero;
