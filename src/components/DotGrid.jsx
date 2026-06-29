import { useEffect, useRef } from "react";
import "./DotGrid.css";

function hexToRgb(hex) {
  const clean = hex.replace("#", "");
  const value = clean.length === 3
    ? clean.split("").map((char) => char + char).join("")
    : clean;

  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16),
  };
}

function DotGrid({
  dotSize = 2,
  gap = 24,
  baseColor = "#334155",
  activeColor = "#ffe14d",
  proximity = 140,
  className = "",
}) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const pointerRef = useRef({ x: -9999, y: -9999 });
  const pulseRef = useRef({ x: -9999, y: -9999, radius: 0, alpha: 0 });
  const isVisibleRef = useRef(false);

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    if (!wrap || !canvas) return undefined;

    const ctx = canvas.getContext("2d");
    const base = hexToRgb(baseColor);
    const active = hexToRgb(activeColor);
    let frameId = 0;

    const buildGrid = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;

      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const cell = dotSize + gap;
      const cols = Math.ceil(rect.width / cell) + 1;
      const rows = Math.ceil(rect.height / cell) + 1;
      const dots = [];

      for (let y = 0; y < rows; y += 1) {
        for (let x = 0; x < cols; x += 1) {
          dots.push({
            x: x * cell + (gap * 0.5),
            y: y * cell + (gap * 0.5),
          });
        }
      }

      dotsRef.current = dots;
    };

    const draw = () => {
      if (!isVisibleRef.current) {
        frameId = requestAnimationFrame(draw);
        return;
      }

      const rect = wrap.getBoundingClientRect();
      ctx.clearRect(0, 0, rect.width, rect.height);

      const pointer = pointerRef.current;
      const pulse = pulseRef.current;

      dotsRef.current.forEach((dot) => {
        const pointerDistance = Math.hypot(dot.x - pointer.x, dot.y - pointer.y);
        const pointerStrength = Math.max(0, 1 - pointerDistance / proximity);
        const pulseDistance = Math.hypot(dot.x - pulse.x, dot.y - pulse.y);
        const pulseStrength = pulse.alpha * Math.max(0, 1 - Math.abs(pulseDistance - pulse.radius) / 70);
        const strength = Math.min(1, pointerStrength + pulseStrength);

        const r = Math.round(base.r + (active.r - base.r) * strength);
        const g = Math.round(base.g + (active.g - base.g) * strength);
        const b = Math.round(base.b + (active.b - base.b) * strength);
        const size = dotSize + strength * 2.6;

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${0.42 + strength * 0.45})`;
        ctx.fill();
      });

      if (pulse.alpha > 0) {
        pulse.radius += 4.5;
        pulse.alpha *= 0.94;
      }

      frameId = requestAnimationFrame(draw);
    };

    const updatePointer = (event) => {
      const rect = wrap.getBoundingClientRect();
      pointerRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
      };
    };

    const clearPointer = () => {
      pointerRef.current = { x: -9999, y: -9999 };
    };

    const pulse = (event) => {
      const rect = wrap.getBoundingClientRect();
      pulseRef.current = {
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        radius: 0,
        alpha: 1,
      };
    };

    buildGrid();
    draw();

    const resizeObserver = new ResizeObserver(buildGrid);
    resizeObserver.observe(wrap);

    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.01 },
    );
    visibilityObserver.observe(wrap);

    window.addEventListener("mousemove", updatePointer, { passive: true });
    window.addEventListener("mouseleave", clearPointer);
    window.addEventListener("click", pulse);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("mousemove", updatePointer);
      window.removeEventListener("mouseleave", clearPointer);
      window.removeEventListener("click", pulse);
    };
  }, [activeColor, baseColor, dotSize, gap, proximity]);

  return (
    <div className={`dot-grid ${className}`}>
      <div ref={wrapRef} className="dot-grid__wrap">
        <canvas ref={canvasRef} className="dot-grid__canvas" />
      </div>
    </div>
  );
}

export default DotGrid;
