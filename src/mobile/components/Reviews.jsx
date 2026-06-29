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

function Reviews() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const reviews = [
    {
      name: "林小姐",
      text: "樂哥服務真的沒話說，有問題都會處理，不會讓人等很久。",
      time: "2小時前",
      avatar: photo1,
    },
    {
      name: "陳先生",
      text: "客服回覆很快，流程也簡單，整體用起來很舒服。",
      time: "5小時前",
      avatar: photo2,
    },
    {
      name: "張先生",
      text: "BC博球真的很穩，介面好用、出入金也順，最重要的是有文樂哥帶，整個安心很多。",
      time: "1天前",
      avatar: photo3,
    },
    {
      name: "王先生",
      text: "整體感覺很穩，不管是操作、出入金還是服務，都讓人蠻放心的。",
      time: "2天前",
      avatar: photo4,
    },
    {
      name: "黃先生",
      text: "不得不說文樂哥真的很用心，從註冊到出入金都會一步一步協助，對新手超友善。",
      time: "3天前",
      avatar: photo5,
    },
    {
      name: "吳先生",
      text: "BC博球活動多、平台順，樂哥又會提醒該注意的地方，玩起來比較有保障感。",
      time: "4天前",
      avatar: photo6,
    },
    {
      name: "劉先生",
      text: "樂哥處理事情很有效率，不會拖拖拉拉，這點真的加分。",
      time: "5天前",
      avatar: photo7,
    },
    {
      name: "蔡先生",
      text: "賽特超會爆分",
      time: "6天前",
      avatar: photo8,
    },
    {
      name: "楊先生",
      text: "平台活動蠻多的，平常有空玩一下也有不少福利可以拿。",
      time: "1週前",
      avatar: photo9,
    },
    {
      name: "許小姐",
      text: "有問題都有人協助，整體流程清楚，玩起來比較安心。",
      time: "1週前",
      avatar: photo10,
    },
  ];

  const loopReviews = [...reviews, ...reviews];

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
      className={`reviews-section ${isVisible ? "reviews-section-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="reviews-header">
        <h2>好評推薦</h2>
        <p>來自真實玩家的聲音</p>
      </div>

      <div className="reviews-slider">
        <div className="reviews-track">
          {loopReviews.map((review, index) => (
            <div className="review-card" key={`${review.name}-${index}`}>
              <div className="review-avatar">
                <img src={review.avatar} alt={review.name} />
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
