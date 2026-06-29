import { useEffect, useMemo, useState } from "react";
import Galaxy from "./Galaxy";
import "./SportsOddsSection.css";

const EVENT_CATEGORY_IDS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];
const DAY_SECONDS = 24 * 60 * 60;
const MAX_EVENT_PAGES = 10;

const CATEGORY_API = "/sports-api/api/event/getCategoryList";

const FALLBACK_LOGO =
  "https://upload.wikimedia.org/wikipedia/commons/8/8e/Football_%28soccer_ball%29.svg";

const DEFAULT_CATEGORIES = [
  { id: 1, title: "美棒" },
  { id: 2, title: "日棒" },
  { id: 3, title: "韓棒" },
  { id: 4, title: "中華職棒" },
  { id: 5, title: "其他棒球" },
  { id: 6, title: "籃球" },
  { id: 7, title: "其他籃球" },
  { id: 8, title: "冰球" },
  { id: 9, title: "其他冰球" },
  { id: 10, title: "頂級足球" },
  { id: 11, title: "其他足球" },
];

const SPORT_SEARCH_TERMS = {
  1: "baseball team logo",
  2: "baseball team logo",
  3: "baseball team logo",
  4: "baseball team logo",
  5: "baseball team logo",
  6: "basketball team logo",
  7: "basketball team logo",
  8: "ice hockey team logo",
  9: "ice hockey team logo",
  10: "football club",
  11: "football club",
};

const SPORT_FALLBACK_EMOJIS = {
  1: "⚾",
  2: "⚾",
  3: "⚾",
  4: "⚾",
  5: "⚾",
  6: "🏀",
  7: "🏀",
  8: "🏒",
  9: "🏒",
  10: "⚽",
  11: "⚽",
};

const LOGO_CACHE = new Map();

function getArrayFromResponse(data) {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.data?.list)) return data.data.list;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.list)) return data.list;
  return [];
}

function getTaipeiDateString(date = new Date()) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function getEventRange(dateString) {
  const selectedStart = Math.floor(
    new Date(`${dateString}T00:00:00+08:00`).getTime() / 1000
  );
  const now = Math.floor(Date.now() / 1000);

  return {
    start: Math.min(selectedStart - DAY_SECONDS * 7, now - DAY_SECONDS),
    end: Math.max(selectedStart + DAY_SECONDS * 30, now + DAY_SECONDS * 30),
  };
}

function isSameTaipeiDate(date, dateString) {
  if (!date) return false;
  return getTaipeiDateString(date) === dateString;
}

function buildEventApi({ cid, page, start, end }) {
  const params = new URLSearchParams({
    page: String(page),
    cid: String(cid),
    start: String(start),
    end: String(end),
  });

  return `/sports-api/api/event/getEventList?${params.toString()}`;
}

function getEventTime(event) {
  const raw =
    event.startTime ??
    event.start_time ??
    event.start ??
    event.matchTime ??
    event.match_time ??
    event.starttime ??
    event.eventTime ??
    event.event_time ??
    event.time ??
    event.match_date;

  if (!raw) return null;

  if (typeof raw === "number") {
    const ms = raw < 10000000000 ? raw * 1000 : raw;
    return new Date(ms);
  }

  const date = new Date(raw);
  return Number.isNaN(date.getTime()) ? null : date;
}

function pickTeamName(event, side) {
  if (side === "home") {
    return (
      event.homeName ??
      event.home_name ??
      event.homeTeam ??
      event.home_team ??
      event.home ??
      event.team1 ??
      event.master ??
      event.masterName ??
      event.master_name ??
      "主隊"
    );
  }

  return (
    event.awayName ??
    event.away_name ??
    event.awayTeam ??
    event.away_team ??
    event.away ??
    event.team2 ??
    event.guests ??
    event.guest ??
    event.guestName ??
    event.guest_name ??
    "客隊"
  );
}

function pickLeagueName(event, categoryMap) {
  return (
    event.categoryName ??
    event.category_name ??
    event.leagueName ??
    event.league_name ??
    event.competitionName ??
    event.competition_name ??
    categoryMap[event.event_category_id] ??
    categoryMap[event.cid] ??
    categoryMap[event.categoryId] ??
    "即時賽事"
  );
}

function pickStatusText(event) {
  const text =
    event.statusText ??
    event.status_text ??
    event.matchStatusText ??
    event.match_status_text ??
    event.gameStatusText ??
    event.game_status_text ??
    event.status_name ??
    "";

  if (text) return String(text);

  const status = String(
    event.status ??
      event.state ??
      event.matchStatus ??
      event.match_status ??
      event.gameStatus ??
      ""
  ).toLowerCase();

  if (status === "0" || status === "not_start" || status === "pending") {
    return "未開賽";
  }

  if (
    status === "1" ||
    status === "live" ||
    status === "running" ||
    status === "in_play"
  ) {
    return "進行中";
  }

  if (
    status === "2" ||
    status === "finished" ||
    status === "finish" ||
    status === "ended" ||
    status === "closed"
  ) {
    return "已完賽";
  }

  const eventDate = getEventTime(event);
  if (eventDate && eventDate.getTime() > Date.now()) return "未開賽";

  return "已完賽";
}

function isUpcoming(event) {
  const statusText = pickStatusText(event);
  const eventDate = getEventTime(event);

  if (statusText.includes("未開") || statusText.includes("未开")) return true;
  if (eventDate && eventDate.getTime() > Date.now()) return true;

  return false;
}

function isFinished(event) {
  const statusText = pickStatusText(event);
  const eventDate = getEventTime(event);
  const finalScoreReady = hasFinalScore(event);

  if (!finalScoreReady) return false;

  if (
    statusText.includes("完") ||
    statusText.includes("結束") ||
    statusText.includes("结束")
  ) {
    return true;
  }

  if (eventDate && eventDate.getTime() < Date.now()) {
    return true;
  }

  return false;
}

function formatTaipeiDate(date) {
  if (!date) return "--/--";

  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    month: "2-digit",
    day: "2-digit",
    weekday: "short",
  }).format(date);
}

function formatTaipeiTime(date) {
  if (!date) return "--:--";

  return new Intl.DateTimeFormat("zh-TW", {
    timeZone: "Asia/Taipei",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}

function pickScore(event, side) {
  if (side === "home") {
    return (
      event.homeScore ??
      event.home_score ??
      event.scoreHome ??
      event.masterScore ??
      event.master_score ??
      event.score1 ??
      null
    );
  }

  return (
    event.awayScore ??
    event.away_score ??
    event.scoreAway ??
    event.guestsScore ??
    event.guests_score ??
    event.guestScore ??
    event.guest_score ??
    event.score2 ??
    null
  );
}

function hasFinalScore(event) {
  const home =
    event.homeScore ??
    event.home_score ??
    event.scoreHome ??
    event.masterScore ??
    event.master_score ??
    event.score1;
  const away =
    event.awayScore ??
    event.away_score ??
    event.scoreAway ??
    event.guestsScore ??
    event.guests_score ??
    event.guestScore ??
    event.guest_score ??
    event.score2;

  return (
    home !== undefined &&
    home !== null &&
    home !== "" &&
    away !== undefined &&
    away !== null &&
    away !== ""
  );
}

function pickOdds(event, keys, fallback = "-") {
  for (const key of keys) {
    if (event[key] !== undefined && event[key] !== null && event[key] !== "") {
      return event[key];
    }
  }

  const odds = event.odds ?? event.oddsInfo ?? event.market ?? {};

  for (const key of keys) {
    if (odds[key] !== undefined && odds[key] !== null && odds[key] !== "") {
      return odds[key];
    }
  }

  return fallback;
}

function normalizeTeamForWiki(name) {
  return String(name)
    .replace(/^[A-Z0-9]{2,5}-/i, "")
    .replace(/\(.*?\)/g, "")
    .replace(/U\d+/gi, "")
    .replace(/女足/g, "")
    .replace(/足球隊/g, "")
    .trim();
}

function normalizeWikiCompare(text) {
  return String(text)
    .toLowerCase()
    .replace(/^[a-z0-9]{2,5}-/i, "")
    .replace(/\(.*?\)/g, "")
    .replace(/[·・\s\-_()（）「」『』]/g, "")
    .replace(/球隊|足球隊|棒球隊|籃球隊|冰球隊/g, "")
    .trim();
}

function isStrictWikiMatch(title, teamName) {
  const titleKey = normalizeWikiCompare(title);
  const teamKey = normalizeWikiCompare(teamName);

  if (!titleKey || !teamKey) return false;
  return titleKey === teamKey || titleKey.includes(teamKey) || teamKey.includes(titleKey);
}

async function fetchWikiThumbnail(apiUrl, searchText, cleanName) {
  const searchUrl = `${apiUrl}?action=query&origin=*&format=json&list=search&srsearch=${encodeURIComponent(
    `"${searchText}"`
  )}&srlimit=5`;
  const searchRes = await fetch(searchUrl);
  const searchData = await searchRes.json();
  const matchedPage = searchData?.query?.search?.find((page) =>
    isStrictWikiMatch(page.title, cleanName)
  );

  if (!matchedPage) return null;

  const url = `${apiUrl}?action=query&origin=*&format=json&pageids=${matchedPage.pageid}&prop=pageimages&pithumbsize=120`;
  const res = await fetch(url);
  const data = await res.json();
  const pages = data?.query?.pages;

  if (!pages) return null;

  const firstPage = Object.values(pages)[0];
  return firstPage?.thumbnail?.source ?? null;
}

async function fetchWikiLogo(teamName, sportTerm = "sports team logo") {
  const cleanName = normalizeTeamForWiki(teamName);
  if (!cleanName || cleanName === "主隊" || cleanName === "客隊") {
    return null;
  }

  const cacheKey = `${cleanName}-${sportTerm}`;
  if (LOGO_CACHE.has(cacheKey)) {
    return LOGO_CACHE.get(cacheKey);
  }

  const candidates = [
    ["https://zh.wikipedia.org/w/api.php", cleanName],
    ["https://en.wikipedia.org/w/api.php", cleanName],
    ["https://commons.wikimedia.org/w/api.php", cleanName],
  ];

  for (const [apiUrl, searchText] of candidates) {
    const thumbnail = await fetchWikiThumbnail(apiUrl, searchText, cleanName);
    if (thumbnail) {
      LOGO_CACHE.set(cacheKey, thumbnail);
      return thumbnail;
    }
  }

  LOGO_CACHE.set(cacheKey, null);
  return null;
}

function TeamLogo({ name, sportTerm, categoryId }) {
  const [logo, setLogo] = useState(null);
  const emoji = SPORT_FALLBACK_EMOJIS[categoryId] ?? "🏆";

  useEffect(() => {
    let ignore = false;

    async function loadLogo() {
      try {
        const result = await fetchWikiLogo(name, sportTerm);
        if (!ignore) setLogo(result);
      } catch {
        if (!ignore) setLogo(null);
      }
    }

    loadLogo();

    return () => {
      ignore = true;
    };
  }, [name, sportTerm]);

  return logo ? (
    <img
      src={logo}
      alt={name}
      className="team-logo"
      onError={() => setLogo(null)}
    />
  ) : (
    <span className="team-logo team-logo-emoji" aria-label={name}>
      {emoji}
    </span>
  );
}

function buildEventView(event, categoryMap) {
  const date = getEventTime(event);
  const home = pickTeamName(event, "home");
  const away = pickTeamName(event, "away");
  const categoryId = event.event_category_id ?? event.cid ?? event.categoryId;

  return {
    id:
      event.id ??
      event.eventId ??
      event.event_id ??
      `${home}-${away}-${date?.getTime() ?? Math.random()}`,
    categoryId,
    league: pickLeagueName(event, categoryMap),
    sportTerm: SPORT_SEARCH_TERMS[categoryId] ?? "sports team logo",
    date,
    dateText: formatTaipeiDate(date),
    timeText: formatTaipeiTime(date),
    home,
    away,
    homeScore: pickScore(event, "home"),
    awayScore: pickScore(event, "away"),
    statusText: pickStatusText(event),
    total: pickOdds(event, ["total", "ou", "overUnder", "totalScore", "bigscore"], "-"),
    homeOdds: pickOdds(event, ["homeOdds", "home_odds", "masterOdds", "oddsHome", "master_refund"], "-"),
    awayOdds: pickOdds(event, ["awayOdds", "away_odds", "guestOdds", "oddsAway", "guests_refund"], "-"),
  };
}

async function fetchEventsByCategory(cid, range) {
  const firstRes = await fetch(buildEventApi({ cid, page: 1, ...range }));
  const firstData = await firstRes.json();
  const firstList = getArrayFromResponse(firstData);
  const lastPage = Math.min(
    Number(firstData?.data?.last_page ?? firstData?.last_page ?? 1) || 1,
    MAX_EVENT_PAGES
  );

  if (lastPage <= 1) return firstList;

  const pageRequests = [];

  for (let page = 2; page <= lastPage; page += 1) {
    pageRequests.push(
      fetch(buildEventApi({ cid, page, ...range }))
        .then((res) => res.json())
        .then((data) => getArrayFromResponse(data))
    );
  }

  const restLists = await Promise.all(pageRequests);
  return [...firstList, ...restLists.flat()];
}

function SportsOddsSection() {
  const [events, setEvents] = useState([]);
  const [categoryMap, setCategoryMap] = useState({});
  const [categoryOptions, setCategoryOptions] = useState(DEFAULT_CATEGORIES);
  const [selectedDate, setSelectedDate] = useState(() => getTaipeiDateString());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      try {
        setLoading(true);

        const range = getEventRange(selectedDate);
        const [eventLists, categoryRes] = await Promise.all([
          Promise.all(
            EVENT_CATEGORY_IDS.map((cid) => fetchEventsByCategory(cid, range))
          ),
          fetch(CATEGORY_API),
        ]);

        const categoryData = await categoryRes.json();

        const categories = getArrayFromResponse(categoryData);
        const usableCategories = categories.length > 0 ? categories : DEFAULT_CATEGORIES;
        const map = {};

        usableCategories.forEach((item) => {
          const id = item.id ?? item.cid ?? item.categoryId;
          const name = item.title ?? item.name ?? item.categoryName;
          if (id !== undefined && name) map[id] = name;
        });

        const list = eventLists.flat();
        const uniqueEvents = Array.from(
          new Map(
            list.map((event) => [
              event.id ?? `${event.master}-${event.guests}-${event.starttime}`,
              event,
            ])
          ).values()
        );

        if (!ignore) {
          setCategoryMap(map);
          setCategoryOptions(
            usableCategories
              .map((item) => ({
                id: item.id ?? item.cid ?? item.categoryId,
                title: item.title ?? item.name ?? item.categoryName,
              }))
              .filter((item) => item.id !== undefined && item.title)
          );
          setEvents(uniqueEvents);
        }
      } catch (error) {
        console.error("取得賽事失敗：", error);
        if (!ignore) {
          setEvents([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [selectedDate]);

  const { closestUpcoming, finishedEvents } = useMemo(() => {
    const viewEvents = events.map((event) => buildEventView(event, categoryMap));

    const upcoming = viewEvents
      .filter((event) => isUpcoming(event))
      .filter((event) => {
        const time = event.date?.getTime();
        return time === undefined || time >= Date.now();
      })
      .sort((a, b) => {
        const aTime = a.date ? a.date.getTime() : Infinity;
        const bTime = b.date ? b.date.getTime() : Infinity;
        return aTime - bTime;
      });

    const finished = viewEvents
      .filter((event) => isFinished(event))
      .filter((event) => isSameTaipeiDate(event.date, selectedDate))
      .filter((event) => {
        if (selectedCategory === "all") return true;
        return String(event.categoryId) === selectedCategory;
      })
      .sort((a, b) => {
        const aTime = a.date ? a.date.getTime() : 0;
        const bTime = b.date ? b.date.getTime() : 0;
        return bTime - aTime;
      });

    return {
      closestUpcoming: upcoming[0] ?? null,
      finishedEvents: finished.slice(0, 80),
    };
  }, [events, categoryMap, selectedDate, selectedCategory]);

  return (
    <section className="sports-odds-section">
      <div className="sports-galaxy-bg">
        <Galaxy
          density={1.15}
          glowIntensity={0.45}
          saturation={0.25}
          hueShift={160}
          speed={0.8}
          starSpeed={0.45}
          twinkleIntensity={0.45}
          mouseInteraction={true}
          transparent={true}
        />
      </div>

      <div className="sports-odds-layout">
        <div className="sports-live-area">
          <div className="sports-section-title">
            <span>即時賽事</span>
            <h2>最近開打</h2>
          </div>

          {loading && <div className="sports-empty">正在取得賽事...</div>}

          {!loading && !closestUpcoming && (
            <div className="sports-empty">目前沒有未開賽賽事</div>
          )}

          {!loading && closestUpcoming && (
            <div className="sports-live-match">
              <div className="sports-live-top">
                <span className="sports-league">{closestUpcoming.league}</span>
                <span className="sports-time">
                  {closestUpcoming.dateText}　{closestUpcoming.timeText}
                </span>
              </div>

              <div className="sports-live-teams">
                <div className="sports-live-team">
                  <TeamLogo
                    name={closestUpcoming.home}
                    sportTerm={closestUpcoming.sportTerm}
                    categoryId={closestUpcoming.categoryId}
                  />
                  <strong>{closestUpcoming.home}</strong>
                </div>

                <div className="sports-live-center">
                  <span>{closestUpcoming.statusText}</span>
                  <b>VS</b>
                </div>

                <div className="sports-live-team">
                  <TeamLogo
                    name={closestUpcoming.away}
                    sportTerm={closestUpcoming.sportTerm}
                    categoryId={closestUpcoming.categoryId}
                  />
                  <strong>{closestUpcoming.away}</strong>
                </div>
              </div>

              <div className="sports-live-odds">
                <div>
                  <span>主隊盤口</span>
                  <strong>{closestUpcoming.homeOdds}</strong>
                </div>
                <div>
                  <span>客隊盤口</span>
                  <strong>{closestUpcoming.awayOdds}</strong>
                </div>
                <div>
                  <span>大小盤</span>
                  <strong>{closestUpcoming.total}</strong>
                </div>
              </div>

              <a
                className="sports-analysis-btn"
                href="https://bc78999.com/category/%e9%81%8b%e5%bd%a9%e5%88%86%e6%9e%90/"
              >
                查看賽事分析
              </a>
            </div>
          )}
        </div>

        <div className="sports-finished-area">
          <div className="finished-header">
            <div>
              <span>已完賽</span>
              <h3>賽事比分</h3>
            </div>
            <small>{finishedEvents.length} 場</small>
          </div>

          <div className="sports-filter-bar finished-filter-bar">
            <label>
              <span>日期</span>
              <input
                type="date"
                value={selectedDate}
                onChange={(event) => {
                  if (event.target.value) setSelectedDate(event.target.value);
                }}
              />
            </label>

            <label>
              <span>分類</span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
              >
                <option value="all">全部分類</option>
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.title}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="finished-scroll-list">
            {loading && <div className="sports-empty small">讀取中...</div>}

            {!loading && finishedEvents.length === 0 && (
              <div className="sports-empty small">目前沒有已完賽賽事</div>
            )}

            {!loading &&
              finishedEvents.map((event) => (
                <div className="finished-match-card" key={event.id}>
                  <div className="finished-match-top">
                    <span>{event.league}</span>
                    <small>
                      {event.dateText}　{event.timeText}
                    </small>
                  </div>

                  <div className="finished-score-row">
                    <div className="finished-team">
                      <TeamLogo
                        name={event.home}
                        sportTerm={event.sportTerm}
                        categoryId={event.categoryId}
                      />
                      <p>{event.home}</p>
                    </div>

                    <div className="finished-score">
                      <strong>{event.homeScore}</strong>
                      <span>:</span>
                      <strong>{event.awayScore}</strong>
                    </div>

                    <div className="finished-team right">
                      <TeamLogo
                        name={event.away}
                        sportTerm={event.sportTerm}
                        categoryId={event.categoryId}
                      />
                      <p>{event.away}</p>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export default SportsOddsSection;
