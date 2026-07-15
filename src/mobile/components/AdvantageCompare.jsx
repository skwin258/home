import { useEffect, useRef, useState } from "react";

const rows = [
  {
    label: "平台體驗",
    bc: { text: "✓", crown: true },
    taiwan: { text: "✓", crown: false },
    cash: { text: "✓", crown: true },
  },
  {
    label: "出入金速度",
    bc: { text: "快速", crown: true },
    taiwan: { text: "一般", crown: false },
    cash: { text: "快速", crown: false },
  },
  {
    label: "遊戲種類",
    bc: { text: "完整", crown: true },
    taiwan: { text: "較少", crown: false },
    cash: { text: "完整", crown: true },
  },
  {
    label: "客服時間",
    bc: { text: "24H", crown: true },
    taiwan: { text: "限時", crown: false },
    cash: { text: "24H", crown: true },
  },
  {
    label: "安全防護",
    bc: { text: "✓", crown: true },
    taiwan: { text: "✓", crown: false },
    cash: { text: "✓", crown: true },
  },
];

function AdvantageCompare() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
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

  const renderCell = (cell, extraClass = "") => (
    <td className={extraClass}>
      <div className="advantage-cell">
        {cell.crown && <span className="cell-crown">★</span>}
        {renderValue(cell.text)}
      </div>
    </td>
  );

  return (
    <section
      className={`advantage-compare ${isVisible ? "advantage-compare-visible" : ""}`}
      ref={sectionRef}
    >
      <div className="advantage-header">
        <h2>平台優勢比較</h2>
        <p>核心體驗一次看懂，選擇更穩定的娛樂平台。</p>
      </div>

      <div className="advantage-table-wrap">
        <table className="advantage-table">
          <thead>
            <tr>
              <th></th>
              <th className="highlight-col">BC78999</th>
              <th>一般平台</th>
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
