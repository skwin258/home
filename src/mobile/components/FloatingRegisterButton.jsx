import { useEffect, useState } from "react";

const LINE_URL = "https://lin.ee/tmJOJNM";
const BUTTON_SIZE = 68;
const EDGE_GAP = 14;

function getInitialPosition() {
  const page = document.querySelector(".mobile-page");
  const rect = page?.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const rightEdge = rect ? Math.min(rect.right, viewportWidth) : viewportWidth;

  return {
    x: rightEdge - BUTTON_SIZE - EDGE_GAP,
    y: Math.max(EDGE_GAP, viewportHeight - BUTTON_SIZE - 188),
  };
}

function clampPosition(x, y) {
  const page = document.querySelector(".mobile-page");
  const rect = page?.getBoundingClientRect();
  const minX = rect ? Math.max(EDGE_GAP, rect.left + EDGE_GAP) : EDGE_GAP;
  const maxX = rect
    ? Math.min(window.innerWidth - BUTTON_SIZE - EDGE_GAP, rect.right - BUTTON_SIZE - EDGE_GAP)
    : window.innerWidth - BUTTON_SIZE - EDGE_GAP;
  const minY = EDGE_GAP;
  const maxY = window.innerHeight - BUTTON_SIZE - EDGE_GAP;

  return {
    x: Math.min(Math.max(x, minX), maxX),
    y: Math.min(Math.max(y, minY), maxY),
  };
}

function FloatingRegisterButton() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    const setInitial = () => {
      const next = getInitialPosition();
      setPosition(clampPosition(next.x, next.y));
    };

    setInitial();
    window.addEventListener("resize", setInitial);
    window.addEventListener("orientationchange", setInitial);

    return () => {
      window.removeEventListener("resize", setInitial);
      window.removeEventListener("orientationchange", setInitial);
    };
  }, []);

  if (!position) return null;

  return (
    <a
      className="floating-register-btn"
      href={LINE_URL}
      target="_blank"
      rel="noreferrer"
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
      }}
      aria-label="立即註冊"
    >
      <span>立即<br />註冊</span>
    </a>
  );
}

export default FloatingRegisterButton;
