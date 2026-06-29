import { useEffect, useRef, useState } from "react";

function CountUpNumber({ end = 50000, duration = 1600, suffix = "+" }) {
  const [count, setCount] = useState(0);
  const [done, setDone] = useState(false);

  const numberRef = useRef(null);
  const hasStarted = useRef(false);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || hasStarted.current) return;

        hasStarted.current = true;

        const startTime = performance.now();

        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const value = Math.floor(eased * end);

          setCount(value);

          if (progress < 1) {
            requestAnimationFrame(animate);
          } else {
            setCount(end);
            setDone(true);
          }
        };

        requestAnimationFrame(animate);
      },
      {
        threshold: 0.35,
      }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
    };
  }, [end, duration]);

  return (
    <strong
      ref={numberRef}
      className={done ? "count-up-number count-up-done" : "count-up-number"}
    >
      {count.toLocaleString()}
      {suffix}
    </strong>
  );
}

export default CountUpNumber;