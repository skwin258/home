import "./index.css";
import "./App.css";

import Hero from "./components/Hero";
import AppDownload from "./components/AppDownload";
import CasinoRating from "./components/CasinoRating";
import SportsAnalysis from "./components/SportsAnalysis";
import RecentArticles from "./components/RecentArticles";
import HotGames from "./components/HotGames";
import Reviews from "./components/Reviews";
import AdvantageCompare from "./components/AdvantageCompare";
import Protection from "./components/Protection";
import FAQ from "./components/FAQ";
import FoxCTA from "./components/FoxCTA";
import FloatingRegisterButton from "./components/FloatingRegisterButton";

function App() {
  return (
    <main className="mobile-page">
      <Hero />
      <AppDownload />
      <CasinoRating />
      <SportsAnalysis />
      <RecentArticles />
      <HotGames />
      <Reviews />
      <AdvantageCompare />
      <Protection />
      <FAQ />
      <FoxCTA />
      <FloatingRegisterButton />
    </main>
  );
}

export default App;
