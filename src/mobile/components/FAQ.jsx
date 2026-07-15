import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    question: "如何註冊 BC78999？",
    answer: "點擊立即註冊或加入 LINE 客服，即可依照指引完成註冊與開通。",
  },
  {
    question: "平台支援哪些遊戲？",
    answer: "提供體育投注、真人娛樂、電子遊戲與多種熱門玩法，一站即可暢玩。",
  },
  {
    question: "出入金速度快嗎？",
    answer: "平台流程簡潔，交易會依照實際審核與金流狀態快速處理。",
  },
  {
    question: "手機可以使用嗎？",
    answer: "可以，手機版已針對觸控與滑動體驗調整，瀏覽與操作都更順暢。",
  },
  {
    question: "遇到問題怎麼辦？",
    answer: "可透過 LINE 客服聯繫專人協助，處理註冊、登入、交易與活動問題。",
  },
  {
    question: "資料安全嗎？",
    answer: "平台採用加密連線與多重安全機制，降低資料與交易風險。",
  },
];

function FAQ() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const marqueeFaqs = [...faqs, ...faqs];

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
      className={`faq-section ${isVisible ? "faq-section-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="faq-header">
        <h2>常見問題 Q&A</h2>
        <p>整理新手最常詢問的問題，快速了解平台使用方式。</p>
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
