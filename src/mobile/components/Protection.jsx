import { useEffect, useRef, useState } from "react";

function Protection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const protections = [
    {
      icon: "⚖️",
      title: "合法合規",
      desc: "MGA、BVI、PAGCOR 牌照",
    },
    {
      icon: "🤝",
      title: "責任博彩",
      desc: "與 GAMCARE 攜手倡導",
    },
    {
      icon: "🎲",
      title: "社交合作",
      desc: "飛銳體育、DG、RSG 等知名系統夥伴",
    },
    {
      icon: "🎧",
      title: "24/7 客服",
      desc: "多語言即時支援",
    },
    {
      icon: "🛡️",
      title: "網站安全",
      desc: "SSL 加密、嚴守資訊安全",
    },
    {
      icon: "💳",
      title: "支付保護",
      desc: "銀行轉帳、ATM、USDT 加密交易",
    },
    {
      icon: "🎮",
      title: "遊戲公平",
      desc: "第三方 RNG 機制",
    },
    {
      icon: "🔐",
      title: "帳戶防護",
      desc: "多重認證與反詐騙系統",
    },
  ];

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
        threshold: 0.08,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`protection-section ${
        isVisible ? "protection-section-visible" : ""
      }`}
      ref={sectionRef}
    >
      <div className="protection-header">
        <h2>八大保障</h2>
        <p>安全安心 每一筆投注都有保障</p>
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
