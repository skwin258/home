import DotGrid from "./DotGrid";
import "./AdvantageSection.css";

const rows = [
  ["營運方式", "信用版", "實體運彩行", "現金版"],
  ["賠率", "0.95", "0.65-0.75", "0.96"],
  ["額度", "額度無上限", "額度限制", "額度限制"],
  ["場中投注", "場場開場中", "開場中投注場次少", "場場開場中"],
  ["下注時間", "24小時皆可下注", "投注時間受限制", "需儲值後才能下注"],
  ["每周優惠", "周周送折抵 並且開版即送5000折抵金", "無", "無"],
  ["提領", "提領不受限", "提領不受限", "提領須達門檻"],
];

const hotCells = {
  bc: new Set(["賠率", "額度", "場中投注", "下注時間", "每周優惠", "提領"]),
  sport: new Set(["提領"]),
  cash: new Set(["賠率", "場中投注"]),
};

function HotValue({ value, hot }) {
  return (
    <span className="advantage-value">
      {value}
      {hot && <span className="advantage-fire" aria-label="熱門">🔥</span>}
    </span>
  );
}

function AdvantageSection() {
  return (
    <section className="advantage-section" aria-labelledby="advantage-title">
      <div className="advantage-bg">
        <DotGrid dotSize={2} gap={24} baseColor="#233049" activeColor="#ffe14d" proximity={145} />
      </div>

      <div className="advantage-inner">
        <div className="section-heading advantage-heading">
          <span>BC Advantages</span>
          <h2 id="advantage-title">博球娛樂城優勢</h2>
        </div>

        <div className="advantage-card">
          <div className="advantage-table" role="table" aria-label="博球娛樂城優勢比較">
            <div className="advantage-row advantage-head" role="row">
              <div role="columnheader"></div>
              <div className="advantage-brand" role="columnheader">BC博球</div>
              <div role="columnheader">台灣運彩</div>
              <div role="columnheader">一般現金版</div>
            </div>

            {rows.map(([label, bc, sport, cash]) => (
              <div className="advantage-row" role="row" key={label}>
                <div className="advantage-label" role="rowheader">{label}</div>
                <div className="advantage-bc" role="cell">
                  <HotValue value={bc} hot={hotCells.bc.has(label)} />
                </div>
                <div role="cell">
                  <HotValue value={sport} hot={hotCells.sport.has(label)} />
                </div>
                <div role="cell">
                  <HotValue value={cash} hot={hotCells.cash.has(label)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdvantageSection;
