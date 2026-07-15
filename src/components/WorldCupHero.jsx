import "./WorldCupHero.css";

function WorldCupHero() {
  return (
    <section className="bc-hero" aria-labelledby="bc-hero-title">
      <div className="bc-hero__bg" aria-hidden="true" />
      <div className="bc-hero__vignette" aria-hidden="true" />

      <div className="bc-hero__content">
        <p className="bc-hero__eyebrow">
          <span />
          PREMIUM SPORTS & ENTERTAINMENT
        </p>

        <h1 id="bc-hero-title" className="bc-hero__title" aria-label="不只娛樂 更是一種品味">
          <span className="bc-hero__title-line bc-hero__title-line--first">不只娛樂</span>
          <span className="bc-hero__title-line bc-hero__title-line--second">更是一種品味</span>
        </h1>

        <p className="bc-hero__brand">BC78999</p>
        <p className="bc-hero__subtitle">體育・真人・電子，一站暢玩</p>

        <div className="bc-hero__actions" aria-label="主要操作">
          <a
            className="bc-hero__button bc-hero__button--primary"
            href="https://lin.ee/tmJOJNM"
            target="_blank"
            rel="noreferrer"
          >
            立即註冊
          </a>
          <a
            className="bc-hero__button bc-hero__button--secondary"
            href="https://lin.ee/tmJOJNM"
            target="_blank"
            rel="noreferrer"
          >
            現金版入口
          </a>
        </div>
      </div>
    </section>
  );
}

export default WorldCupHero;
