import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import DotGrid from "./DotGrid";
import "./PopularGamesSection.css";

const gameGroups = [
  {
    id: "slots",
    label: "電子熱門遊戲",
    visible: 6,
    speed: 2200,
    games: ["001", "008", "009", "010", "011", "012"],
  },
  {
    id: "live",
    label: "真人熱門遊戲",
    visible: 4,
    speed: 2500,
    games: ["007", "005", "002", "006"],
  },
  {
    id: "sports",
    label: "體育熱門遊戲",
    visible: 1,
    speed: 2800,
    games: ["004"],
  },
  {
    id: "lottery",
    label: "彩票遊戲",
    visible: 2,
    speed: 2400,
    games: ["5", "6"],
  },
];

function getImagePath(id) {
  return `/images/${id}.png`;
}

function GameCarousel({ group }) {
  const [index, setIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [metrics, setMetrics] = useState({ step: 0, width: 0 });
  const trackRef = useRef(null);
  const dragStartRef = useRef(0);
  const dragFrameRef = useRef(0);
  const latestDragOffsetRef = useRef(0);
  const resumeTimerRef = useRef(0);
  const items = useMemo(() => [...group.games, ...group.games, ...group.games], [group.games]);

  const measureCarousel = () => {
    const track = trackRef.current;
    const firstCard = track?.querySelector(".game-card");
    if (!track || !firstCard) return;

    const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const step = cardWidth + gap;
    const width = group.visible * cardWidth + (group.visible - 1) * gap;

    setMetrics((current) => {
      if (Math.abs(current.step - step) < 0.5 && Math.abs(current.width - width) < 0.5) {
        return current;
      }

      return { step, width };
    });
  };

  const goTo = (direction) => {
    setIndex((current) => (current + direction + group.games.length) % group.games.length);
  };

  useEffect(() => {
    if (isPaused || isDragging) return undefined;

    const timer = window.setInterval(() => {
      goTo(1);
    }, group.speed);

    return () => window.clearInterval(timer);
  }, [group.speed, isDragging, isPaused]);

  useLayoutEffect(() => {
    measureCarousel();

    const resizeObserver = new ResizeObserver(measureCarousel);
    if (trackRef.current) resizeObserver.observe(trackRef.current);
    window.addEventListener("resize", measureCarousel);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener("resize", measureCarousel);
      if (dragFrameRef.current) cancelAnimationFrame(dragFrameRef.current);
      window.clearTimeout(resumeTimerRef.current);
    };
  }, [group.visible]);

  const onPointerDown = (event) => {
    setIsPaused(true);
    setIsDragging(true);
    setDragOffset(0);
    latestDragOffsetRef.current = 0;
    window.clearTimeout(resumeTimerRef.current);
    dragStartRef.current = event.clientX;
    trackRef.current?.setPointerCapture?.(event.pointerId);
  };

  const onPointerMove = (event) => {
    if (!isDragging) return;

    latestDragOffsetRef.current = event.clientX - dragStartRef.current;

    if (dragFrameRef.current) return;

    dragFrameRef.current = requestAnimationFrame(() => {
      dragFrameRef.current = 0;
      setDragOffset(latestDragOffsetRef.current);
    });
  };

  const finishDrag = () => {
    if (!isDragging) return;

    const step = metrics.step;
    const threshold = Math.min(90, Math.max(38, step * 0.22));

    const finalOffset = latestDragOffsetRef.current || dragOffset;

    if (Math.abs(finalOffset) > threshold) {
      goTo(finalOffset < 0 ? 1 : -1);
    }

    latestDragOffsetRef.current = 0;
    setDragOffset(0);
    setIsDragging(false);
    resumeTimerRef.current = window.setTimeout(() => setIsPaused(false), 700);
  };

  return (
    <article
      className={`game-row game-row--${group.id}`}
      style={{ "--visible": group.visible }}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        if (!isDragging) setIsPaused(false);
      }}
    >
      <div className="game-row__header" style={{ width: metrics.width ? `${metrics.width}px` : undefined }}>
        <h3>{group.label}</h3>
      </div>

      <div className="game-carousel" style={{ width: metrics.width ? `${metrics.width}px` : undefined }}>
        <div
          ref={trackRef}
          className={`game-carousel__track ${isDragging ? "is-dragging" : ""}`}
          style={{
            transform: `translateX(${-index * metrics.step + dragOffset}px)`,
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={finishDrag}
          onPointerCancel={finishDrag}
        >
          {items.map((game, itemIndex) => (
            <div className="game-card" key={`${group.id}-${game}-${itemIndex}`}>
              <img src={getImagePath(game)} alt={`${group.label} ${game}`} draggable="false" />
            </div>
          ))}
        </div>
      </div>
    </article>
  );
}

function PopularGamesSection() {
  return (
    <section className="popular-games-section" aria-labelledby="popular-games-title">
      <div className="popular-games-bg">
        <DotGrid dotSize={2.1} gap={26} baseColor="#263044" activeColor="#ffe14d" proximity={150} />
      </div>

      <div className="popular-games-inner">
        <div className="section-heading">
          <span>Popular Games</span>
          <h2 id="popular-games-title">熱門遊戲推薦</h2>
        </div>

        <div className="game-groups">
          {gameGroups.map((group) => (
            <GameCarousel group={group} key={group.id} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default PopularGamesSection;
