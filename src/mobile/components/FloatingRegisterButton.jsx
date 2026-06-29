import { useEffect, useRef, useState } from "react";

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
  const dragRef = useRef({
    moved: false,
    pointerId: null,
    startX: 0,
    startY: 0,
    originX: 0,
    originY: 0,
  });

  useEffect(() => {
    const setInitial = () => {
      const next = getInitialPosition();
      setPosition(clampPosition(next.x, next.y));
    };

    setInitial();
    window.addEventListener("resize", setInitial);

    return () => window.removeEventListener("resize", setInitial);
  }, []);

  const handlePointerDown = (event) => {
    if (!position) return;

    dragRef.current = {
      moved: false,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      originX: position.x,
      originY: position.y,
    };

    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    if (drag.pointerId !== event.pointerId) return;

    const deltaX = event.clientX - drag.startX;
    const deltaY = event.clientY - drag.startY;

    if (Math.abs(deltaX) > 4 || Math.abs(deltaY) > 4) {
      drag.moved = true;
    }

    if (!drag.moved) return;

    const next = clampPosition(drag.originX + deltaX, drag.originY + deltaY);
    setPosition(next);
  };

  const handlePointerUp = (event) => {
    const drag = dragRef.current;
    if (drag.pointerId === event.pointerId) {
      drag.pointerId = null;
    }
  };

  const handleClick = (event) => {
    if (dragRef.current.moved) {
      event.preventDefault();
      dragRef.current.moved = false;
    }
  };

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
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onClick={handleClick}
      aria-label="立即註冊"
    >
      <span>立即<br />註冊</span>
    </a>
  );
}

export default FloatingRegisterButton;
