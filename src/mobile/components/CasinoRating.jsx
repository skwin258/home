import { useEffect, useRef, useState } from "react";

import playingCardsImage from "../assets/Playing cards.png";
import slotMachineImage from "../assets/Slot machine.png";
import footballImage from "../assets/football.png";
import coloredBallImage from "../assets/Colored ball.png";

function CasinoRating() {
  const sectionRef = useRef(null);
  const hasAnimatedRef = useRef(false);

  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const startAnimation = () => {
      if (hasAnimatedRef.current) return;
      hasAnimatedRef.current = true;

      let currentRating = 0;
      let currentReview = 0;

      const ratingEnd = 4.9;
      const reviewEnd = 50000;
      const duration = 1800;
      const stepTime = 16;

      const ratingIncrement = ratingEnd / (duration / stepTime);
      const reviewIncrement = reviewEnd / (duration / stepTime);

      const timer = setInterval(() => {
        currentRating += ratingIncrement;
        currentReview += reviewIncrement;

        if (currentRating >= ratingEnd) {
          currentRating = ratingEnd;
        }

        if (currentReview >= reviewEnd) {
          currentReview = reviewEnd;
        }

        setRating(Number(currentRating.toFixed(1)));
        setReviewCount(Math.floor(currentReview));

        if (currentRating >= ratingEnd && currentReview >= reviewEnd) {
          clearInterval(timer);
        }
      }, stepTime);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          startAnimation();
          observer.disconnect();
        }
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const activeStars = Math.min(5, Math.ceil(rating));

  const formatReviewCount = (num) => {
    if (num >= 50000) return "50000+";
    return `${num}+`;
  };

  return (
    <section className="casino-rating" ref={sectionRef}>
      <div className="casino-rating-header">
        <h2>娛樂城評價</h2>
        <p>玩家一致好評 值得信賴</p>
      </div>

      <div className="rating-row">
        <strong className="rating-number">{rating.toFixed(1)}</strong>

        <div className="rating-stars" aria-label={`${rating.toFixed(1)} 星評價`}>
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              className={star <= activeStars ? "star active" : "star"}
            >
              ★
            </span>
          ))}
        </div>
      </div>

      <p className="rating-note">
        超過 <strong>{formatReviewCount(reviewCount)}</strong> 玩家好評
      </p>

      <div className="casino-game-grid">
        <div className="casino-game-card">
          <div className="casino-game-icon">
            <img src={playingCardsImage} alt="" aria-hidden="true" />
          </div>
          <strong>百家樂</strong>
        </div>

        <div className="casino-game-card">
          <div className="casino-game-icon">
            <img src={slotMachineImage} alt="" aria-hidden="true" />
          </div>
          <strong>老虎機</strong>
        </div>

        <div className="casino-game-card">
          <div className="casino-game-icon">
            <img src={footballImage} alt="" aria-hidden="true" />
          </div>
          <strong>運彩</strong>
        </div>

        <div className="casino-game-card">
          <div className="casino-game-icon">
            <img src={coloredBallImage} alt="" aria-hidden="true" />
          </div>
          <strong>彩票</strong>
        </div>
      </div>
    </section>
  );
}

export default CasinoRating;
