import { useEffect, useRef, useState } from "react";

function AdvantageCompare() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const rows = [
    {
      label: "玩法多元",
      bc: { text: "✓", crown: true },
      taiwan: { text: "✓", crown: false },
      cash: { text: "✓", crown: true },
    },
    {
      label: "額度",
      bc: { text: "無上限", crown: true },
      taiwan: { text: "有限制", crown: false },
      cash: { text: "有限制", crown: false },
    },
    {
      label: "場中投注",
      bc: { text: "✓", crown: true },
      taiwan: { text: "投注場次少", crown: false },
      cash: { text: "✓", crown: true },
    },
    {
      label: "下注時間",
      bc: { text: "24H", crown: true },
      taiwan: { text: "投注受限制", crown: false },
      cash: { text: "24H", crown: true },
    },
    {
      label: "每周優惠",
      bc: { text: "✓", crown: true },
      taiwan: { text: "無", crown: false },
      cash: { text: "✓", crown: true },
    },
  ];

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -80px 0px",
      }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  const renderValue = (value) => {
    if (value === "✓") {
      return <span className="advantage-check">✓</span>;
    }

    return <span>{value}</span>;
  };

  const renderCell = (cell, extraClass = "") => {
    return (
      <td className={extraClass}>
        <div className="advantage-cell">
          {cell.crown && <span className="cell-crown">👑</span>}
          {renderValue(cell.text)}
        </div>
      </td>
    );
  };

  return (
    <section
      className={`advantage-compare ${
        isVisible ? "advantage-compare-visible" : ""
      }`}
      ref={sectionRef}
    >
      <div className="advantage-header">
        <h2>優勢比較</h2>
        <p>多種玩法 選擇最適合你的投注方式</p>
      </div>

      <div className="advantage-table-wrap">
        <table className="advantage-table">
          <thead>
            <tr>
              <th></th>
              <th className="highlight-col">BC博球</th>
              <th>台灣運彩</th>
              <th>現金版</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.label}>
                <td className="row-title">{row.label}</td>
                {renderCell(row.bc, "highlight-col")}
                {renderCell(row.taiwan)}
                {renderCell(row.cash)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default AdvantageCompare;