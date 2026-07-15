import { useEffect, useRef, useState } from "react";

import coloredBallImage from "../assets/Colored ball.png";
import earphoneImage from "../assets/earphone.png";
import footballImage from "../assets/football.png";
import lightningImage from "../assets/lightning.png";
import playingCardsImage from "../assets/Playing cards.png";
import shieldImage from "../assets/Shield.png";
import slotMachineImage from "../assets/Slot machine.png";
import trophyImage from "../assets/Trophy.png";

const protections = [
  { icon: shieldImage, title: "安全加密", desc: "SSL 加密保護會員資料" },
  { icon: lightningImage, title: "快速出入金", desc: "流程簡潔，處理更有效率" },
  { icon: earphoneImage, title: "24H 客服", desc: "專人協助，即時處理問題" },
  { icon: trophyImage, title: "穩定服務", desc: "長時間在線，體驗更順暢" },
  { icon: footballImage, title: "體育投注", desc: "熱門賽事與多元玩法" },
  { icon: playingCardsImage, title: "真人娛樂", desc: "高品質影像與流暢體驗" },
  { icon: slotMachineImage, title: "電子遊戲", desc: "精選遊戲，隨時開局" },
  { icon: coloredBallImage, title: "多元玩法", desc: "娛樂選項完整豐富" },
];

function Protection() {
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
      className={`protection-section ${isVisible ? "protection-section-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="protection-header">
        <h2>安全可靠</h2>
        <p>從資料保護到交易流程，打造更安心的娛樂體驗。</p>
      </div>

      <div className="protection-grid">
        {protections.map((item) => (
          <div className="protection-card" key={item.title}>
            <div className="protection-icon">
              <img src={item.icon} alt="" aria-hidden="true" loading="lazy" decoding="async" />
            </div>

            <strong>{item.title}</strong>
            <p>{item.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Protection;
