import "./App.css";
import WorldCupHero from "./components/WorldCupHero";
import AppDownloadSection from "./components/AppDownloadSection";
import CasinoRatingSection from "./components/CasinoRatingSection";
import SplashCursor from "./components/SplashCursor";
import SportsOddsSection from "./components/SportsOddsSection";
import RecentArticlesSection from "./components/RecentArticlesSection";
import PopularGamesSection from "./components/PopularGamesSection";
import AdvantageSection from "./components/AdvantageSection";
import TravelInsuranceSection from "./components/TravelInsuranceSection";
import CasinoQASection from "./components/CasinoQASection";
import BackgroundMusic from "./components/BackgroundMusic";

function DesktopApp() {
  return (
    <main>
      <BackgroundMusic />
      <WorldCupHero />

      <div className="splash-area">
        <SplashCursor
          className="section-splash"
          activeSelector=".app-download-section"
          RAINBOW_MODE={false}
          COLOR="#B66CFF"
          DYE_RESOLUTION={720}
          SIM_RESOLUTION={96}
          SPLAT_RADIUS={0.18}
          SPLAT_FORCE={4200}
          DENSITY_DISSIPATION={2.8}
          VELOCITY_DISSIPATION={2.4}
        />

        <AppDownloadSection />
        <CasinoRatingSection />
        <SportsOddsSection />
        <RecentArticlesSection />
        <PopularGamesSection />
        <AdvantageSection />
        <TravelInsuranceSection />
        <CasinoQASection />
      </div>
    </main>
  );
}

export default DesktopApp;
