import { useState } from "react";
import "./CasinoQASection.css";

const qaItems = [
  {
    question: "娛樂城是什麼？博球娛樂城是不是詐騙？",
    answer:
      "博球娛樂城為正出金娛樂城，並且獲得 DU 出金保證，非坊間一般無信用保證之線上賭場。",
  },
  {
    question: "博球娛樂城會不會出金？",
    answer:
      "博球娛樂城保證存提款穩定，額外有 DU 出金認證及龐大的資本額，實力過硬、不容小覷。",
  },
  {
    question: "黑網詐騙娛樂城怎麼區分？",
    answer:
      "黑網詐騙可細分兩種：小出大不出及純詐騙黑網，可從品牌知名度、經營時間和網站架設畫面來簡單分辨。",
  },
  {
    question: "如何選擇一間安全的線上信用版娛樂城？",
    answer:
      "正規、現金版、信用版、詐騙黑網娛樂城，可依品牌、兌現方式、優劣勢來做分析選擇。",
  },
  {
    question: "娛樂城出金延遲怎麼辦？",
    answer:
      "若因系統障礙，造成博球娛樂城會員無法於周一提款完成，博球娛樂城將立即派送補償金，以表達誠摯歉意。",
  },
  {
    question: "博球娛樂城有什麼優惠？",
    answer:
      "博球娛樂城提供新會員好禮、5000 折抵金、每周負返、復仇金、VIP 計畫，並會不定期更新優惠回饋給玩家。",
  },
  {
    question: "娛樂城為什麼要實名制、驗證資料？",
    answer:
      "綁定銀行帳戶與真實姓名，是為保障玩家資料與資金安全，避免被詐騙集團利用人頭戶作為洗錢工具。",
  },
  {
    question: "博球娛樂城有哪些付款方式？",
    answer: "目前支援網路銀行、ATM、USDT、超商代碼等付款方式。",
  },
  {
    question: "博球娛樂城如何出金/提款？",
    answer:
      "博球娛樂城的提款與出金方式採用第三方金流，以保障玩家資金的安全性。",
  },
  {
    question: "娛樂城合法嗎？",
    answer:
      "博球娛樂城的提款與出金方式採用第三方金流，以保障玩家資金的安全性。",
  },
];

function CasinoQASection() {
  const [openIndex, setOpenIndex] = useState(null);
  const leftItems = qaItems.slice(0, 5);
  const rightItems = qaItems.slice(5);

  const renderItem = (item, indexOffset = 0) =>
    item.map((qa, itemIndex) => {
      const index = indexOffset + itemIndex;
      const isOpen = openIndex === index;

      return (
        <div className={`casino-qa-item ${isOpen ? "is-open" : ""}`} key={qa.question}>
          <button
            type="button"
            className="casino-qa-question"
            aria-expanded={isOpen}
            onClick={() => setOpenIndex(isOpen ? null : index)}
          >
            <span>{qa.question}</span>
            <b>+</b>
          </button>

          <div className="casino-qa-answer">
            <p>{qa.answer}</p>
          </div>
        </div>
      );
    });

  return (
    <section className="casino-qa-section" aria-labelledby="casino-qa-title">
      <div className="casino-qa-inner">
        <div className="casino-qa-intro">
          <h2 id="casino-qa-title">娛樂城Q&amp;A</h2>
          <p>CASINO Q&amp;A</p>
          <a
            className="casino-qa-pill"
            href="https://bc78999.com/category/%e9%97%9c%e6%96%bc%e5%a8%9b%e6%a8%82%e5%9f%8e/"
          >
            娛樂城常見問題 <span>➜</span>
          </a>
        </div>

        <div className="casino-qa-list">
          <div className="casino-qa-column">{renderItem(leftItems)}</div>
          <div className="casino-qa-column">{renderItem(rightItems, leftItems.length)}</div>
        </div>
      </div>
    </section>
  );
}

export default CasinoQASection;
