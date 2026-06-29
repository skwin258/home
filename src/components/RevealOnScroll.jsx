import { useEffect, useRef, useState } from "react";

function RevealOnScroll({ children, className = "" }) {
  const ref = useRef(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.25,
      }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={`${className} ${show ? "show" : ""}`}>
      {children}
    </div>
  );
}

export default RevealOnScroll;