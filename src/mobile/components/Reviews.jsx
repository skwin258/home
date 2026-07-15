import { useEffect, useRef, useState } from "react";

import photo1 from "../assets/photo1.png";
import photo2 from "../assets/photo2.png";
import photo3 from "../assets/photo3.png";
import photo4 from "../assets/photo4.png";
import photo5 from "../assets/photo5.png";
import photo6 from "../assets/photo6.png";
import photo7 from "../assets/photo7.png";
import photo8 from "../assets/photo8.png";
import photo9 from "../assets/photo9.png";
import photo10 from "../assets/photo10.png";

const reviews = [
  { name: "玩家 A", text: "介面順手，出入金速度很穩，客服回覆也快。", time: "2 小時前", avatar: photo1 },
  { name: "玩家 B", text: "體育盤口清楚，真人遊戲也很順，手機操作不卡。", time: "5 小時前", avatar: photo2 },
  { name: "玩家 C", text: "優惠活動簡單明確，整體使用起來很安心。", time: "1 天前", avatar: photo3 },
  { name: "玩家 D", text: "APP 登入很快，下注流程乾淨直覺。", time: "2 天前", avatar: photo4 },
  { name: "玩家 E", text: "客服處理效率高，問題很快就協助完成。", time: "3 天前", avatar: photo5 },
  { name: "玩家 F", text: "畫面質感比一般平台好，遊戲種類也夠多。", time: "4 天前", avatar: photo6 },
  { name: "玩家 G", text: "提款速度穩定，長期使用下來體驗不錯。", time: "5 天前", avatar: photo7 },
  { name: "玩家 H", text: "體育、真人、電子都在同一站，很方便。", time: "6 天前", avatar: photo8 },
  { name: "玩家 I", text: "活動不複雜，手機版操作起來很輕鬆。", time: "1 週前", avatar: photo9 },
  { name: "玩家 J", text: "整體穩定，客服和出金速度都有水準。", time: "1 週前", avatar: photo10 },
];

function Reviews() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);
  const loopReviews = [...reviews, ...reviews];

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
      className={`reviews-section ${isVisible ? "reviews-section-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="reviews-header">
        <h2>玩家好評</h2>
        <p>真實體驗，穩定服務。</p>
      </div>

      <div className="reviews-slider">
        <div className="reviews-track">
          {loopReviews.map((review, index) => (
            <div className="review-card" key={`${review.name}-${index}`}>
              <div className="review-avatar">
                <img src={review.avatar} alt={review.name} loading="lazy" decoding="async" />
              </div>

              <strong>{review.name}</strong>
              <div className="review-stars">★★★★★</div>
              <p>{review.text}</p>
              <span>{review.time}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Reviews;
