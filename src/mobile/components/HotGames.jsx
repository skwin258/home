import { useEffect, useRef, useState } from "react";

import hotGame1 from "../assets/hot-game-1.png";
import hotGame2 from "../assets/hot-game-2.png";
import hotGame3 from "../assets/hot-game-3.png";
import hotGame4 from "../assets/hot-game-4.png";

function HotGames() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const games = [
    {
      title: "?餃??",
      img: hotGame1,
    },
    {
      title: "?犖?",
      img: hotGame2,
    },
    {
      title: "擃鞈賭?",
      img: hotGame3,
    },
    {
      title: "敶拍巨?",
      img: hotGame4,
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
      className={`hot-games ${isVisible ? "hot-games-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="hot-games-title-row">
        <div>
          <h2>熱門遊戲</h2>
          <p>多款遊戲任您挑選</p>
        </div>
      </div>

      <div className="hot-games-list">
        {games.map((game) => (
          <div className="hot-game-banner" key={game.title}>
            <img src={game.img} alt={game.title} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HotGames;
