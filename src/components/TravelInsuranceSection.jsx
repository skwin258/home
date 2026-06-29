import LightRays from "./LightRays";
import "./TravelInsuranceSection.css";

function TravelInsuranceSection() {
  return (
    <section className="travel-insurance-section" aria-labelledby="travel-insurance-title">
      <div className="travel-insurance-rays">
        <LightRays
          raysOrigin="top-center"
          raysColor="#ffe98a"
          raysSpeed={0.7}
          lightSpread={0.82}
          rayLength={1.65}
          fadeDistance={1.15}
          saturation={1.1}
          followMouse={true}
          mouseInfluence={0.08}
          noiseAmount={0.04}
          distortion={0.05}
        />
      </div>

      <div className="travel-insurance-inner">
        <div className="section-heading travel-insurance-heading">
          <span>Eight Major Safeguard</span>
          <h2 id="travel-insurance-title">博球旅平險 · 八大保障</h2>
        </div>

        <div className="safeguard-image-wrap">
          <img
            src="/images/Eight Major Safeguards.png"
            alt="Eight Major Safeguard 八大保障"
            className="safeguard-image"
          />
        </div>
      </div>
    </section>
  );
}

export default TravelInsuranceSection;
