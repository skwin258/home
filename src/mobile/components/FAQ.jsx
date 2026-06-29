import { useEffect, useRef, useState } from "react";

function FAQ() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const faqs = [
    {
      question: "娛樂城是什麼？博球娛樂城是不是詐騙？",
      answer:
        "博球娛樂城為正出金娛樂城，並且獲得 DU 出金保證，非坊間一般無信用保證之線上賭場。",
    },
    {
      question: "博球娛樂城會不會出金？",
      answer:
        "博球娛樂城保證存提款穩定，額外有 DU 出金認證，及龐大的資本額，實力過硬、不容小覷。",
    },
    {
      question: "黑網詐騙娛樂城怎麼區分？",
      answer:
        "黑網詐騙可細分兩種：小出大不出及純詐騙黑網，可從品牌知名度、經營時間和網站架設畫面來簡單分辨。",
    },
    {
      question: "如何選擇安全的線上信用版娛樂城？",
      answer:
        "正規、現金版、信用版、詐騙黑網娛樂城，可依品牌、兌現方式、優劣勢來做分析選擇。",
    },
    {
      question: "娛樂城出金延遲怎麼辦？",
      answer:
        "若因系統障礙，造成會員無法於周一提款完成，博球娛樂城將立即派送補償金，以表達誠摯歉意。",
    },
    {
      question: "博球娛樂城有什麼優惠？",
      answer:
        "博球娛樂城提供新會員好禮、5000 折抵金、每周負返、復仇金、VIP 計畫，並不定期更新優惠回饋。",
    },
    {
      question: "娛樂城為什麼要實名制、驗證資料？",
      answer:
        "綁定銀行帳戶與真實姓名，是為了保障玩家帳戶安全，避免資料被詐騙集團利用。",
    },
    {
      question: "博球娛樂城有哪些付款方式？",
      answer: "目前支援網路銀行、ATM、USDT、超商代碼等付款方式。",
    },
    {
      question: "博球娛樂城如何出金 / 提款？",
      answer:
        "博球娛樂城的提款 / 出金方式採用第三方金流，以保障玩家資金的安全性。",
    },
    {
      question: "娛樂城合法嗎？",
      answer:
        "不同地區對線上娛樂城規範不同，玩家應依所在地法規自行判斷與遵守。",
    },
  ];

  const marqueeFaqs = [...faqs, ...faqs];

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
      className={`faq-section ${isVisible ? "faq-section-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="faq-header">
        <h2>常見問題 Q&A</h2>
        <p>快速了解博球娛樂城常見疑問</p>
      </div>

<div className="faq-slider-shell">
  <div className="faq-slider">
    <div className="faq-track">
      {marqueeFaqs.map((item, index) => (
        <article className="faq-slide-card" key={`${item.question}-${index}`}>
          <div className="faq-card-top">
            <span>Q</span>
            <strong>{item.question}</strong>
          </div>

          <p>{item.answer}</p>
        </article>
      ))}
    </div>
  </div>
</div>
    </section>
  );
}

export default FAQ;