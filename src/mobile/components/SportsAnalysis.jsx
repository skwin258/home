import { useEffect, useRef, useState } from "react";

const CATEGORY_API = "/sports-api/api/event/getCategoryList";
const EVENT_API = "/sports-api/api/event/getEventList";
const SPORTS_ANALYSIS_URL =
  "https://bc78999.com/category/%e9%81%8b%e5%bd%a9%e5%88%86%e6%9e%90/";

const DEFAULT_TEAM_LOGO =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80">
      <rect width="80" height="80" rx="40" fill="#10213d"/>
      <circle cx="40" cy="40" r="25" fill="#1f8cff" opacity="0.35"/>
      <text x="40" y="47" text-anchor="middle" font-size="18" font-family="Arial" fill="#ffffff" font-weight="700">VS</text>
    </svg>
  `);

const TEAM_LOGO_MAP = {
  /* 美棒 MLB */
  "MIA-邁阿密馬林魚": "https://a.espncdn.com/i/teamlogos/mlb/500/mia.png",
  "ATL-亞特蘭大勇士": "https://a.espncdn.com/i/teamlogos/mlb/500/atl.png",
  "NYY-紐約洋基": "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png",
  "NY-紐約洋基": "https://a.espncdn.com/i/teamlogos/mlb/500/nyy.png",
  "TOR-多倫多藍鳥": "https://a.espncdn.com/i/teamlogos/mlb/500/tor.png",
  "LAD-洛杉磯道奇": "https://a.espncdn.com/i/teamlogos/mlb/500/lad.png",
  "LA-洛杉磯道奇": "https://a.espncdn.com/i/teamlogos/mlb/500/lad.png",
  "OAK-奧克蘭運動家": "https://a.espncdn.com/i/teamlogos/mlb/500/oak.png",
  "ARI-亞利桑那響尾蛇": "https://a.espncdn.com/i/teamlogos/mlb/500/ari.png",
  "COL-科羅拉多洛磯": "https://a.espncdn.com/i/teamlogos/mlb/500/col.png",
  "WSH-華盛頓國民": "https://a.espncdn.com/i/teamlogos/mlb/500/wsh.png",
  "NYM-紐約大都會": "https://a.espncdn.com/i/teamlogos/mlb/500/nym.png",
  "BOS-波士頓紅襪": "https://a.espncdn.com/i/teamlogos/mlb/500/bos.png",
  "TB-坦帕灣光芒": "https://a.espncdn.com/i/teamlogos/mlb/500/tb.png",
  "CHC-芝加哥小熊": "https://a.espncdn.com/i/teamlogos/mlb/500/chc.png",
  "STL-聖路易紅雀": "https://a.espncdn.com/i/teamlogos/mlb/500/stl.png",
  "SF-舊金山巨人": "https://a.espncdn.com/i/teamlogos/mlb/500/sf.png",
  "SD-聖地牙哥教士": "https://a.espncdn.com/i/teamlogos/mlb/500/sd.png",
  "SEA-西雅圖水手": "https://a.espncdn.com/i/teamlogos/mlb/500/sea.png",
  "HOU-休士頓太空人": "https://a.espncdn.com/i/teamlogos/mlb/500/hou.png",
  "TEX-德州遊騎兵": "https://a.espncdn.com/i/teamlogos/mlb/500/tex.png",
  "LAA-洛杉磯天使": "https://a.espncdn.com/i/teamlogos/mlb/500/laa.png",
  "DET-底特律老虎": "https://a.espncdn.com/i/teamlogos/mlb/500/det.png",
  "CLE-克里夫蘭守護者": "https://a.espncdn.com/i/teamlogos/mlb/500/cle.png",
  "MIN-明尼蘇達雙城": "https://a.espncdn.com/i/teamlogos/mlb/500/min.png",
  "KC-堪薩斯皇家": "https://a.espncdn.com/i/teamlogos/mlb/500/kc.png",
  "CWS-芝加哥白襪": "https://a.espncdn.com/i/teamlogos/mlb/500/chw.png",
  "MIL-密爾瓦基釀酒人": "https://a.espncdn.com/i/teamlogos/mlb/500/mil.png",
  "CIN-辛辛那提紅人": "https://a.espncdn.com/i/teamlogos/mlb/500/cin.png",
  "PIT-匹茲堡海盜": "https://a.espncdn.com/i/teamlogos/mlb/500/pit.png",
  "PHI-費城費城人": "https://a.espncdn.com/i/teamlogos/mlb/500/phi.png",
  "BAL-巴爾的摩金鶯": "https://a.espncdn.com/i/teamlogos/mlb/500/bal.png",

  /* 籃球 NBA 常見縮寫 */
  LAL: "https://a.espncdn.com/i/teamlogos/nba/500/lal.png",
  GSW: "https://a.espncdn.com/i/teamlogos/nba/500/gs.png",
  BOS: "https://a.espncdn.com/i/teamlogos/nba/500/bos.png",
  NYK: "https://a.espncdn.com/i/teamlogos/nba/500/ny.png",
  MIA: "https://a.espncdn.com/i/teamlogos/nba/500/mia.png",
  DAL: "https://a.espncdn.com/i/teamlogos/nba/500/dal.png",
  DEN: "https://a.espncdn.com/i/teamlogos/nba/500/den.png",
  PHX: "https://a.espncdn.com/i/teamlogos/nba/500/phx.png",
  MIL: "https://a.espncdn.com/i/teamlogos/nba/500/mil.png",
  PHI: "https://a.espncdn.com/i/teamlogos/nba/500/phi.png",
  LAC: "https://a.espncdn.com/i/teamlogos/nba/500/lac.png",
  SAS: "https://a.espncdn.com/i/teamlogos/nba/500/sa.png",
  OKC: "https://a.espncdn.com/i/teamlogos/nba/500/okc.png",
  MIN: "https://a.espncdn.com/i/teamlogos/nba/500/min.png",
  CLE: "https://a.espncdn.com/i/teamlogos/nba/500/cle.png",

  /* 冰球 NHL 常見縮寫 */
  "BOS-Bruins": "https://a.espncdn.com/i/teamlogos/nhl/500/bos.png",
  NYR: "https://a.espncdn.com/i/teamlogos/nhl/500/nyr.png",
  "TOR-Maple Leafs": "https://a.espncdn.com/i/teamlogos/nhl/500/tor.png",
  MTL: "https://a.espncdn.com/i/teamlogos/nhl/500/mtl.png",
  EDM: "https://a.espncdn.com/i/teamlogos/nhl/500/edm.png",
  "COL-Avalanche": "https://a.espncdn.com/i/teamlogos/nhl/500/col.png",
  VGK: "https://a.espncdn.com/i/teamlogos/nhl/500/vgk.png",
  TBL: "https://a.espncdn.com/i/teamlogos/nhl/500/tb.png",

  /* 中華職棒 CPBL */
  兄弟: "https://upload.wikimedia.org/wikipedia/zh/thumb/3/35/CTBC_Brothers_logo.svg/512px-CTBC_Brothers_logo.svg.png",
  中信兄弟: "https://upload.wikimedia.org/wikipedia/zh/thumb/3/35/CTBC_Brothers_logo.svg/512px-CTBC_Brothers_logo.svg.png",
  統一: "https://upload.wikimedia.org/wikipedia/zh/thumb/5/5e/Uni-President_7-Eleven_Lions_logo.svg/512px-Uni-President_7-Eleven_Lions_logo.svg.png",
  統一獅: "https://upload.wikimedia.org/wikipedia/zh/thumb/5/5e/Uni-President_7-Eleven_Lions_logo.svg/512px-Uni-President_7-Eleven_Lions_logo.svg.png",
  樂天: "https://upload.wikimedia.org/wikipedia/zh/thumb/7/74/Rakuten_Monkeys_logo.svg/512px-Rakuten_Monkeys_logo.svg.png",
  樂天桃猿: "https://upload.wikimedia.org/wikipedia/zh/thumb/7/74/Rakuten_Monkeys_logo.svg/512px-Rakuten_Monkeys_logo.svg.png",
  富邦: "https://upload.wikimedia.org/wikipedia/zh/thumb/3/3b/Fubon_Guardians_logo.svg/512px-Fubon_Guardians_logo.svg.png",
  富邦悍將: "https://upload.wikimedia.org/wikipedia/zh/thumb/3/3b/Fubon_Guardians_logo.svg/512px-Fubon_Guardians_logo.svg.png",
  味全: "https://upload.wikimedia.org/wikipedia/zh/thumb/e/e6/Wei_Chuan_Dragons_logo.svg/512px-Wei_Chuan_Dragons_logo.svg.png",
  味全龍: "https://upload.wikimedia.org/wikipedia/zh/thumb/e/e6/Wei_Chuan_Dragons_logo.svg/512px-Wei_Chuan_Dragons_logo.svg.png",
  台鋼: "https://upload.wikimedia.org/wikipedia/zh/thumb/9/9d/TSG_Hawks_logo.svg/512px-TSG_Hawks_logo.svg.png",
  台鋼雄鷹: "https://upload.wikimedia.org/wikipedia/zh/thumb/9/9d/TSG_Hawks_logo.svg/512px-TSG_Hawks_logo.svg.png",

  /* 足球常見國家隊 */
  法國: "https://flagcdn.com/w160/fr.png",
  德國: "https://flagcdn.com/w160/de.png",
  西班牙: "https://flagcdn.com/w160/es.png",
  英格蘭: "https://flagcdn.com/w160/gb-eng.png",
  葡萄牙: "https://flagcdn.com/w160/pt.png",
  義大利: "https://flagcdn.com/w160/it.png",
  巴西: "https://flagcdn.com/w160/br.png",
  阿根廷: "https://flagcdn.com/w160/ar.png",
  荷蘭: "https://flagcdn.com/w160/nl.png",
  挪威: "https://flagcdn.com/w160/no.png",
  墨西哥: "https://flagcdn.com/w160/mx.png",
  美國: "https://flagcdn.com/w160/us.png",
  加拿大: "https://flagcdn.com/w160/ca.png",
  日本: "https://flagcdn.com/w160/jp.png",
  韓國: "https://flagcdn.com/w160/kr.png",
  卡達: "https://flagcdn.com/w160/qa.png",
  瑞士: "https://flagcdn.com/w160/ch.png",
};

function getTeamCode(teamName = "") {
  if (!teamName) return "";

  const text = String(teamName).trim();
  const code = text.split("-")[0]?.trim();

  return code || text;
}

function getTeamLogo(teamName = "") {
  if (!teamName) return DEFAULT_TEAM_LOGO;

  const text = String(teamName).trim();
  const code = getTeamCode(text).toUpperCase();

  if (TEAM_LOGO_MAP[text]) return TEAM_LOGO_MAP[text];
  if (TEAM_LOGO_MAP[code]) return TEAM_LOGO_MAP[code];

  const foundKey = Object.keys(TEAM_LOGO_MAP).find((key) => {
    const upperKey = key.toUpperCase();
    const keyCode = upperKey.split("-")[0];

    return (
      text.includes(key) ||
      upperKey === code ||
      keyCode === code ||
      upperKey.includes(text.toUpperCase()) ||
      text.toUpperCase().startsWith(keyCode + "-")
    );
  });

  if (foundKey) return TEAM_LOGO_MAP[foundKey];

  return DEFAULT_TEAM_LOGO;
}

function SportsAnalysis() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [event, setEvent] = useState(null);
  const [categoryName, setCategoryName] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState("");

  const getTaipeiRange = () => {
    const now = new Date();

    const start = new Date(now);
    start.setHours(0, 0, 0, 0);

    const end = new Date(now);
    end.setDate(end.getDate() + 30);
    end.setHours(23, 59, 59, 999);

    return {
      start: Math.floor(start.getTime() / 1000),
      end: Math.floor(end.getTime() / 1000),
      nowUnix: Math.floor(now.getTime() / 1000),
    };
  };

  const formatTaipeiTime = (timestamp) => {
    if (!timestamp) return "時間未定";

    return new Date(timestamp * 1000).toLocaleString("zh-TW", {
      timeZone: "Asia/Taipei",
      month: "2-digit",
      day: "2-digit",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const formatScore = (game) => {
    const guestScore = game?.guests_score;
    const masterScore = game?.master_score;

    if (
      guestScore === null ||
      guestScore === undefined ||
      masterScore === null ||
      masterScore === undefined
    ) {
      return "未開賽";
    }

    return `${guestScore} : ${masterScore}`;
  };

  useEffect(() => {
    const fetchNearestEvent = async () => {
      try {
        setLoading(true);
        setErrorText("");

        const { start, end, nowUnix } = getTaipeiRange();

        const categoryRes = await fetch(CATEGORY_API);
        if (!categoryRes.ok) throw new Error("分類 API 請求失敗");

        const categoryJson = await categoryRes.json();
        const categories = categoryJson?.data || [];

        if (!Array.isArray(categories) || categories.length === 0) {
          throw new Error("目前沒有分類資料");
        }

        const eventRequests = categories.map(async (category) => {
          const cid = category.id;
          const url = `${EVENT_API}?page=1&cid=${cid}&start=${start}&end=${end}`;

          try {
            const res = await fetch(url);
            if (!res.ok) return [];

            const json = await res.json();
            const items = json?.data?.items || [];

            return items.map((item) => ({
              ...item,
              cid,
              categoryName: category.title || category.name || "熱門賽事",
            }));
          } catch {
            return [];
          }
        });

        const results = await Promise.all(eventRequests);
        const allEvents = results.flat();

        const upcomingEvents = allEvents
          .filter((item) => item.starttime && item.starttime >= nowUnix)
          .sort((a, b) => a.starttime - b.starttime);

        if (upcomingEvents.length === 0) {
          setEvent(null);
          setCategoryName("");
          setErrorText("目前沒有最近賽事資料");
          return;
        }

        const nearest = upcomingEvents[0];

        setEvent(nearest);
        setCategoryName(nearest.categoryName || "熱門賽事");
      } catch (error) {
        setErrorText(error.message || "目前無法取得賽事資料");
      } finally {
        setLoading(false);
      }
    };

    fetchNearestEvent();
  }, []);

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
  threshold: 0.05,
  rootMargin: "0px 0px -80px 0px",
}
  );

  observer.observe(section);

  return () => observer.disconnect();
}, []);

  const guestLogo = getTeamLogo(event?.guests);
  const masterLogo = getTeamLogo(event?.master);

  return (
    <section
  className={`sports-analysis ${isVisible ? "sports-analysis-visible" : ""}`}
  ref={sectionRef}
>
      <div className="section-header sports-header">
        <h2>即時賽事 掌握盤口</h2>
        <p> </p>
      </div>

      {loading && (
        <div className="sports-loading">
          <span></span>
          最近賽事載入中...
        </div>
      )}

      {!loading && errorText && <div className="sports-error">{errorText}</div>}

{!loading && !errorText && event && (
<article className="sports-card sports-card-orbit">

  <div className="sports-card-top">
    <span className="league-badge">{categoryName}</span>
    <span className="game-time">{formatTaipeiTime(event.starttime)}</span>
  </div>

  <div className="match-row">
    <div className="team team-away">
      <div className="team-logo-wrap">
        <img
          className="team-logo-img"
          src={guestLogo}
          alt={event.guests || "客隊"}
        />
      </div>

      <strong>{event.guests || "客隊"}</strong>
    </div>

    <div className="score-box">
      <span>{formatScore(event)}</span>
      <small>VS</small>
    </div>

    <div className="team team-home">
      <div className="team-logo-wrap">
        <img
          className="team-logo-img"
          src={masterLogo}
          alt={event.master || "主隊"}
        />
      </div>

      <strong>{event.master || "主隊"}</strong>
    </div>
  </div>

  <div className="odds-grid">
    <div>
      <span>客隊讓分</span>
      <strong>{event.guests_refund || "-"}</strong>
    </div>

    <div>
      <span>主隊讓分</span>
      <strong>{event.master_refund || "-"}</strong>
    </div>

    <div>
      <span>大小盤</span>
      <strong>{event.bigscore || "-"}</strong>
    </div>
  </div>

  <a
    className="analysis-btn"
    href={SPORTS_ANALYSIS_URL}
  >
    查看賽事分析
  </a>
</article>
)}
    </section>
  );
}

export default SportsAnalysis;
