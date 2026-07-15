import { lazy, Suspense, useEffect, useState } from "react";
import "./index.css";
import "./App.css";

import Hero from "./components/Hero";
import AppDownload from "./components/AppDownload";
import CasinoRating from "./components/CasinoRating";
import FloatingRegisterButton from "./components/FloatingRegisterButton";

const SportsAnalysis = lazy(() => import("./components/SportsAnalysis"));
const RecentArticles = lazy(() => import("./components/RecentArticles"));
const HotGames = lazy(() => import("./components/HotGames"));
const Reviews = lazy(() => import("./components/Reviews"));
const AdvantageCompare = lazy(() => import("./components/AdvantageCompare"));
const Protection = lazy(() => import("./components/Protection"));
const FAQ = lazy(() => import("./components/FAQ"));
const FoxCTA = lazy(() => import("./components/FoxCTA"));

function DeferredContentFallback() {
  return <div className="mobile-deferred-space" aria-hidden="true" />;
}

function App() {
  const [loadDeferredContent, setLoadDeferredContent] = useState(false);

  useEffect(() => {
    const load = () => setLoadDeferredContent(true);

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(load, { timeout: 1200 });
      return () => window.cancelIdleCallback?.(idleId);
    }

    const timer = window.setTimeout(load, 600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <main className="mobile-page">
      <Hero />
      <AppDownload />
      <CasinoRating />

      {loadDeferredContent ? (
        <Suspense fallback={<DeferredContentFallback />}>
          <SportsAnalysis />
          <RecentArticles />
          <HotGames />
          <Reviews />
          <AdvantageCompare />
          <Protection />
          <FAQ />
          <FoxCTA />
        </Suspense>
      ) : (
        <DeferredContentFallback />
      )}

      <FloatingRegisterButton />
    </main>
  );
}

export default App;
