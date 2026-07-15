import { useEffect, useRef, useState } from "react";

import hotGame1 from "../assets/hot-game-1.png";
import hotGame2 from "../assets/hot-game-2.png";
import hotGame3 from "../assets/hot-game-3.png";
import hotGame4 from "../assets/hot-game-4.png";

const games = [
  { title: "熱門老虎機", img: hotGame1 },
  { title: "真人娛樂", img: hotGame2 },
  { title: "體育投注", img: hotGame3 },
  { title: "電子遊戲", img: hotGame4 },
];

function HotGames() {
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
      className={`hot-games ${isVisible ? "hot-games-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="hot-games-title-row">
        <div>
          <h2>熱門遊戲</h2>
          <p>精選體育、真人與電子娛樂，隨時開局。</p>
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
