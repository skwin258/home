import { useEffect, useRef, useState } from "react";

const protections = [
  { icon: "盾", title: "安全加密", desc: "SSL 加密保護會員資料" },
  { icon: "金", title: "資金保障", desc: "多重風控守護交易安全" },
  { icon: "速", title: "快速出入金", desc: "流程簡潔，處理更有效率" },
  { icon: "客", title: "24H 客服", desc: "專人協助，即時處理問題" },
  { icon: "穩", title: "穩定系統", desc: "手機與桌機皆順暢操作" },
  { icon: "真", title: "真人娛樂", desc: "高品質影像與流暢體驗" },
  { icon: "體", title: "體育投注", desc: "熱門賽事與多元玩法" },
  { icon: "電", title: "電子遊戲", desc: "精選遊戲，隨時開局" },
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
              <span>{item.icon}</span>
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
