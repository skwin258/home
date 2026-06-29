import { lazy, Suspense, useEffect, useState } from "react";

const DesktopApp = lazy(() => import("./DesktopApp.jsx"));
const MobileApp = lazy(() => import("./mobile/App.jsx"));
const MOBILE_QUERY = "(max-width: 767px)";
const TOUCH_QUERY = "(hover: none) and (pointer: coarse)";

function isMobileDevice() {
  if (typeof window === "undefined") return false;

  const isNarrowScreen = window.matchMedia(MOBILE_QUERY).matches;
  const isTouchDevice = window.matchMedia(TOUCH_QUERY).matches;
  const isMobileUserAgent =
    navigator.userAgentData?.mobile ??
    /Android|iPhone|iPod|Mobile/i.test(navigator.userAgent);

  return isMobileUserAgent || (isNarrowScreen && isTouchDevice);
}

function App() {
  const [isMobile, setIsMobile] = useState(isMobileDevice);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_QUERY);
    const touchQuery = window.matchMedia(TOUCH_QUERY);
    const handleChange = () => setIsMobile(isMobileDevice());

    handleChange();
    mediaQuery.addEventListener("change", handleChange);
    touchQuery.addEventListener("change", handleChange);
    window.addEventListener("orientationchange", handleChange);

    return () => {
      mediaQuery.removeEventListener("change", handleChange);
      touchQuery.removeEventListener("change", handleChange);
      window.removeEventListener("orientationchange", handleChange);
    };
  }, []);

  return (
    <Suspense fallback={null}>
      {isMobile ? <MobileApp /> : <DesktopApp />}
    </Suspense>
  );
}

export default App;
