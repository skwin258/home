import { useEffect, useRef, useState } from "react";
import CountUpNumber from "./CountUpNumber";
import RevealOnScroll from "./RevealOnScroll";
import Stack from "./Stack";
import BorderGlow from "./BorderGlow";

const reviews = [
  {
    name: "林小姐",
    text: "樂哥服務真的沒話說，有問題都會處理，不會讓人等很久。",
    day: "2小時前",
    avatar: "/images/photo1.png",
  },
  {
    name: "陳先生",
    text: "客服回覆很快，流程也簡單，整體用起來很舒服。",
    day: "5小時前",
    avatar: "/images/photo2.png",
  },
  {
    name: "張先生",
    text: "BC博球真的很穩，介面好用、出入金也順，最重要的是有文樂哥帶，整個安心很多。",
    day: "1天前",
    avatar: "/images/photo3.png",
  },
  {
    name: "王先生",
    text: "整體感覺很穩，不管是操作、出入金還是服務，都讓人蠻放心的。",
    day: "2天前",
    avatar: "/images/photo4.png",
  },
  {
    name: "黃先生",
    text: "不得不說文樂哥真的很用心，從註冊到出入金都會一步一步協助，對新手超友善。",
    day: "3天前",
    avatar: "/images/photo5.png",
  },
  {
    name: "吳先生",
    text: "BC博球活動多、平台順，樂哥又會提醒該注意的地方，玩起來比較有保障感。",
    day: "4天前",
    avatar: "/images/photo6.png",
  },
  {
    name: "劉先生",
    text: "樂哥處理事情很有效率，不會拖拖拉拉，這點真的加分。",
    day: "5天前",
    avatar: "/images/photo7.png",
  },
  {
    name: "蔡先生",
    text: "賽特超會爆分",
    day: "6天前",
    avatar: "/images/photo8.png",
  },
  {
    name: "楊先生",
    text: "平台活動蠻多的，平常有空玩一下也有不少福利可以拿。",
    day: "1週前",
    avatar: "/images/photo9.png",
  },
  {
    name: "許小姐",
    text: "有問題都有人協助，整體流程清楚，玩起來比較安心。",
    day: "1週前",
    avatar: "/images/photo10.png",
  },
];

const categories = [
  { icon: "/images/Slot machine.png", label: "老虎機" },
  { icon: "/images/Playing cards.png", label: "百家樂" },
  { icon: "/images/football.png", label: "運彩" },
  { icon: "/images/Colored ball.png", label: "彩票" },
];

function ReviewCard({ review }) {
  return (
    <div className="casino-review-card">
      <div className="casino-review-avatar-wrap">
        <img src={review.avatar} alt={review.name} className="casino-review-avatar" />
      </div>

      <h3>{review.name}</h3>
      <div className="casino-review-stars">★★★★★</div>
      <p>{review.text}</p>
      <small>{review.day}</small>
    </div>
  );
}

function CasinoRatingSection() {
  const targetRating = 4.9;
  const duration = 2200;

  const [rating, setRating] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const sectionRef = useRef(null);

  const reviewCards = reviews.map((review) => (
    <ReviewCard key={`${review.name}-${review.day}`} review={review} />
  ));

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || hasStarted) return undefined;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        setHasStarted(true);
        const startTime = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setRating(targetRating * eased);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setRating(targetRating);
          }
        };

        requestAnimationFrame(animate);
      },
      { threshold: 0.35 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [hasStarted]);

  const activeStars = rating >= 4.75 ? 5 : Math.floor(rating);

  return (
    <section ref={sectionRef} className="casino-rating-section">
      <div className="casino-rating-bg"></div>

      <RevealOnScroll className="casino-section-fade">
        <div className="casino-rating-inner casino-rating-two-col">
          <div className="casino-rating-content">
            <p className="casino-rating-label">娛樂城評價</p>
            <h2>玩家真實回饋與熱門分類</h2>

            <div className="casino-score-row">
              <strong className="casino-score">{rating.toFixed(1)}</strong>

              <div className="casino-stars">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span key={star} className={star <= activeStars ? "active" : ""}>
                    ★
                  </span>
                ))}
              </div>
            </div>

            <p className="casino-review-text">
              累積 <CountUpNumber end={50000} duration={1800} suffix="+" /> 玩家好評
            </p>

            <div className="casino-category-grid">
              {categories.map((category, index) => (
                <BorderGlow
                  key={category.label}
                  className="casino-category-card"
                  backgroundColor="rgba(10, 12, 20, 0.9)"
                  borderRadius={18}
                  glowRadius={32}
                  glowIntensity={0.9}
                  edgeSensitivity={24}
                  fillOpacity={0.36}
                  animated={index === 0}
                  colors={["#ffe14d", "#6fa2ff", "#c084fc"]}
                  glowColor="50 95 66"
                >
                  <div className="casino-category-card-content">
                    <div className="casino-category-icon">
                      <img src={category.icon} alt={category.label} />
                    </div>
                    <p>{category.label}</p>
                  </div>
                </BorderGlow>
              ))}
            </div>
          </div>

          <div className="casino-review-stack-reveal">
            <div className="casino-review-stack-area">
              <Stack
                cards={reviewCards}
                randomRotation={false}
                sensitivity={160}
                sendToBackOnClick={true}
                autoplay={true}
                autoplayDelay={2600}
                pauseOnHover={true}
                mobileClickOnly={true}
              />
            </div>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
}

export default CasinoRatingSection;
