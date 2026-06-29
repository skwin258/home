function CasinoRating() {
  return (
    <section className="casino-rating">
      <div className="section-header">
        <small>娛樂城評價</small>
        <h2>玩家一致好評 值得信賴</h2>
        <p>
          匯集熱門遊戲、快速存提、真人客服與穩定系統，打造更順暢的手機娛樂體驗。
        </p>
      </div>

      <div className="rating-main-card">
        <div className="rating-score-box">
          <strong>4.9</strong>
          <span>綜合評分</span>
        </div>

        <div className="rating-content">
          <div className="rating-stars">★★★★★</div>
          <h3>超過 50,000+ 玩家推薦</h3>
          <p>存提快速、介面流暢、活動豐富，手機版操作更直覺。</p>
        </div>
      </div>

      <div className="casino-game-grid">
        <div className="casino-game-card">
          <div className="casino-game-icon">🎲</div>
          <strong>百家樂</strong>
          <span>真人牌桌</span>
        </div>

        <div className="casino-game-card">
          <div className="casino-game-icon">🎰</div>
          <strong>老虎機</strong>
          <span>熱門電子</span>
        </div>

        <div className="casino-game-card">
          <div className="casino-game-icon">⚽</div>
          <strong>體育投注</strong>
          <span>賽事盤口</span>
        </div>

        <div className="casino-game-card">
          <div className="casino-game-icon">👑</div>
          <strong>真人娛樂</strong>
          <span>即時互動</span>
        </div>
      </div>
    </section>
  );
}

export default CasinoRating;