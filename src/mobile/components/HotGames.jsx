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
      title: "電子遊戲",
      img: hotGame1,
    },
    {
      title: "真人遊戲",
      img: hotGame2,
    },
    {
      title: "體育賽事",
      img: hotGame3,
    },
    {
      title: "彩票遊戲",
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
          <p>多種遊戲選擇 樂趣無窮</p>
        </div>
      </div>

      <div className="hot-games-list">
        {games.map((game) => (
          <div className="hot-game-banner" key={game.title}>
            <img src={game.img} alt={game.title} />
          </div>
        ))}
      </div>
    </section>
  );
}

export default HotGames;