import { useEffect } from "react";
import "./WorldCupHero.css";

function WorldCupHero() {
  useEffect(() => {
// ===================== 3D GOLDEN TROPHY PRELOADER & SCROLL CANVAS =====================
  const canvas = document.getElementById('video-canvas');
  const ctx = canvas.getContext('2d');
  const loaderPercent = document.getElementById('loader-percent');
  const loaderFill = document.getElementById('loader-fill');
  const loader = document.getElementById('loader');
  const heroElement = document.getElementById('hero'); // 缓存 hero 元素，避免在 render loop 中频繁查询 
  const worldcupElement = document.querySelector(".worldcup-component");
const videoContainer = document.getElementById("scroll-video-container");
const particlesCanvas = document.getElementById("particles-canvas");

const totalFrames = 600;
const endFrame = 520; // 金盃停在這附近，不要播到最後
const startupFrameCount = 500;
const framePath = "/worldcup-assets/frames60";
const frameExtension = "jpg";
  const images = [];
  let loadedCount = 0;
  let appStarted = false;
  let lastFrameIndex = -1;

  let cachedScrollBounds = { start: 0, end: 0 };
  let triggerTop = 0;
  let triggerHeight = 0;

  // 缓存布局尺寸，避免在 requestAnimationFrame 渲染循环中触发 Layout Thrashing (重排)
function updateLayoutDimensions() {
  const vh = window.innerHeight;
  const worldcup = document.querySelector(".worldcup-component");
  const worldcupHeight = worldcup ? worldcup.offsetHeight : document.documentElement.scrollHeight;

  cachedScrollBounds = {
    start: vh * 0.2,
    end: Math.max(vh, worldcupHeight - vh * 0.8)
  };

    // 缓存卡片触发器布局边界
    const trigger = document.getElementById('cards-trigger');
    if (trigger) {
      const rect = trigger.getBoundingClientRect();
      // 在计算绝对 top 值时，将相对于视口的 top 加上当前的滚动偏移
      triggerTop = rect.top + window.scrollY;
      triggerHeight = rect.height;
    }
  }

  function resizeCanvas() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    const w = Math.round(rect.width * dpr);
    const h = Math.round(rect.height * dpr);
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    lastFrameIndex = -1; // 重置缓存以强制重新绘制
    
    // 更新缓存的布局尺寸，保证响应式布局的正确性
    updateLayoutDimensions();
  }

  function getPreloadConcurrency() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
    if (connection && connection.saveData) return 4;

    const effectiveType = connection && connection.effectiveType;
    if (effectiveType && effectiveType.includes('2g')) return 4;
    if (effectiveType && effectiveType.includes('3g')) return 8;

    return 10;
  }

  function frameUrl(frameNumber) {
    const frameStr = String(frameNumber).padStart(6, '0');
    return `${framePath}/frame_${frameStr}.${frameExtension}`;
  }

  // Preload all 600 frames with bounded concurrency.
  function preloadImages() {
    images.length = totalFrames;

    let nextFrame = 1;
    const workerCount = Math.min(totalFrames, getPreloadConcurrency());

    function loadNextFrame() {
      if (nextFrame > totalFrames) return;

      const frameNumber = nextFrame++;
      const imageIndex = frameNumber - 1;
      const img = new Image();
      img.decoding = 'async';
      img.loading = frameNumber <= startupFrameCount ? 'eager' : 'lazy';
      if ('fetchPriority' in img) {
        img.fetchPriority = frameNumber <= startupFrameCount ? 'high' : 'low';
      }
      
      img.onload = () => {
        loadedCount++;
        updateLoaderProgress();
        if (!appStarted && loadedCount >= startupFrameCount) {
          onAllImagesLoaded();
        }
        loadNextFrame();
      };

      img.onerror = () => {
        console.error(`加载图片失败: ${frameUrl(frameNumber)}`);
        loadedCount++;
        updateLoaderProgress();
        if (!appStarted && loadedCount >= startupFrameCount) {
          onAllImagesLoaded();
        }
        loadNextFrame();
      };

      images[imageIndex] = img;
      img.src = frameUrl(frameNumber);
    }

    for (let i = 0; i < workerCount; i++) {
      loadNextFrame();
    }
  }

  function updateLoaderProgress() {
    const percent = Math.min(100, Math.floor((loadedCount / startupFrameCount) * 100));
    loaderPercent.textContent = `${String(percent).padStart(2, '0')}%`;
    loaderFill.style.width = `${percent}%`;
  }

  // ===================== GOOEY TEXT MORPHING LOGIC =====================
  const texts = ["余文樂代理", "世界盃狂熱", "各種電子機台"];
  const text1El = document.getElementById('gooey-text-1');
  const text2El = document.getElementById('gooey-text-2');

  const colors = {
    "余文樂代理": "linear-gradient(to right, #ffe14d 0%, #ffffff 42%, #c084fc 100%)",
    "世界盃狂熱": "linear-gradient(to right, #0a3161 8%, #ffffff 50%, #b31942 92%)",
    "各種電子機台": "linear-gradient(to right, #00d2ff 0%, #ffffff 46%, #22c55e 100%)"
  };

  const morphTime = 1.0;     // 融合渐变动画时长 (秒)
  const cooldownTime = 1.0;  // 词组停留时长 (秒)

  let textIndex = 0;
  let lastGooeyTime = new Date();
  let morphProgress = 0;
  let cooldownProgress = cooldownTime;

  function setWordWithStyle(element, word) {
    element.textContent = word;
    element.style.background = colors[word] || "#ffffff";
    element.style.webkitBackgroundClip = "text";
    element.style.backgroundClip = "text";
    element.style.color = "transparent";
  }

  function initGooeyText() {
    if (text1El && text2El) {
      // 停留状态下显示的是 text2El，所以初始词放在 text2El 中，text1El 预装下一个词
      setWordWithStyle(text1El, texts[(textIndex + 1) % texts.length]);
      setWordWithStyle(text2El, texts[textIndex]);
      text1El.style.opacity = "0%";
      text2El.style.opacity = "100%";
    }
  }

  function updateGooeyText(dt) {
    if (!text1El || !text2El) return;

    if (cooldownProgress > 0) {
      // 1. 处于停留状态
      cooldownProgress -= dt;
      if (cooldownProgress <= 0) {
        // 停留结束瞬间：开始融合。将刚才在 text2El 里的当前词挪到 text1El 作为淡出旧词，
        // 并给 text2El 载入即将淡入的新词，做到双缓冲无缝切换，彻底消除跳跃感
        setWordWithStyle(text1El, texts[textIndex]);
        textIndex = (textIndex + 1) % texts.length;
        setWordWithStyle(text2El, texts[textIndex]);
        
        // 继承溢出的负时间，避免动画抖动或丢帧
        morphProgress = -cooldownProgress; 
        
        // 立即在当前帧执行融合样式的计算与应用，彻底消灭切换文本时新词裸露闪烁的 bug
        let fraction = morphProgress / morphTime;
        fraction = Math.min(1, fraction);
        const safeFraction = Math.max(0.0001, fraction);
        
        text2El.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
        text2El.style.opacity = `${Math.pow(safeFraction, 0.4) * 100}%`;

        const invFraction = 1 - fraction;
        const safeInvFraction = Math.max(0.0001, invFraction);
        text1El.style.filter = `blur(${Math.min(8 / safeInvFraction - 8, 100)}px)`;
        text1El.style.opacity = `${Math.pow(safeInvFraction, 0.4) * 100}%`;
      } else {
        // 停留中的常态渲染
        text2El.style.filter = "";
        text2El.style.opacity = "100%";
        text1El.style.filter = "";
        text1El.style.opacity = "0%";
      }
    } else {
      // 2. 处于熔融变形状态
      morphProgress += dt;
      let fraction = morphProgress / morphTime;

      if (fraction >= 1) {
        // 融合完成瞬间：回归并重启停留状态
        fraction = 1;
        cooldownProgress = cooldownTime;
        
        text2El.style.filter = "";
        text2El.style.opacity = "100%";
        text1El.style.filter = "";
        text1El.style.opacity = "0%";
      } else {
        // 融合中的插值渲染，结合最小 safeFraction 边界限制防除以 0 引发闪烁 NaN
        const safeFraction = Math.max(0.0001, fraction);
        text2El.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
        text2El.style.opacity = `${Math.pow(safeFraction, 0.4) * 100}%`;

        const invFraction = 1 - fraction;
        const safeInvFraction = Math.max(0.0001, invFraction);
        text1El.style.filter = `blur(${Math.min(8 / safeInvFraction - 8, 100)}px)`;
        text1El.style.opacity = `${Math.pow(safeInvFraction, 0.4) * 100}%`;
      }
    }
  }

  function onAllImagesLoaded() {
    if (appStarted) return;
    appStarted = true;

    // 隐藏加载预载器
    loader.classList.add('fade-out');

    // 初始化画布布局尺寸，并绑定窗口大小调整监听器
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // 初始化 Gooey Text 胶性文字动效及时间起点
    initGooeyText();
    lastGooeyTime = new Date();
    
    // 启动视频 Tick 帧更新循环
    requestAnimationFrame(videoTick);
  }

  let smoothScrollY = 0;

  function getProgress(yValue) {
    const { start, end } = cachedScrollBounds;
    const range = end - start;
    if (range <= 0) return 0;
    return Math.max(0, Math.min(1, (yValue - start) / range));
  }

  function drawFrame(img) {
    const cw = canvas.width, ch = canvas.height;
    
    ctx.clearRect(0, 0, cw, ch);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'medium';

    const imgRatio = img.width / img.height;
    const canvasRatio = cw / ch;

    let renderWidth, renderHeight;

    if (canvasRatio > imgRatio) {
      renderWidth = cw;
      renderHeight = cw / imgRatio;
    } else {
      renderWidth = ch * imgRatio;
      renderHeight = ch;
    }

    const offsetX = (cw - renderWidth) / 2;
    const offsetY = (ch - renderHeight) / 2;

    ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
  }

  function getAvailableFrame(preferredIndex) {
    const preferred = images[preferredIndex];
    if (preferred && preferred.complete) return preferred;

    for (let offset = 1; offset < 24; offset += 1) {
      const before = images[preferredIndex - offset];
      if (before && before.complete) return before;

      const after = images[preferredIndex + offset];
      if (after && after.complete) return after;
    }

    return images.find((img) => img && img.complete) || null;
  }

  function videoTick() {
    const scrollY = window.scrollY;
    
    // 物理阻尼跟随：0.04 的插值速度能让 3D 金杯与卡片遮罩在快速与慢速滑动时都具有高端物理粘性与惯性缓冲
    // 并且将硬同步阈值缩小到 0.01px，避免了微小增量滚动（如高精度触控板/平滑滚动）时被误判强行硬同步导致阻尼失效
    const diffY = scrollY - smoothScrollY;
    if (Math.abs(diffY) < 0.01) {
      smoothScrollY = scrollY;
    } else {
      smoothScrollY += diffY * 0.04;
    }

    // 更新 Gooey Text 的流体融合时间增量步长
    const currentTime = new Date();
    const dt = (currentTime.getTime() - lastGooeyTime.getTime()) / 1000;
    lastGooeyTime = currentTime;
    updateGooeyText(dt);

    // 1. 同步自转金杯绘制
    const progress = getProgress(smoothScrollY);
    if (images.length > 0) {
      const idx = Math.round(progress * (endFrame - 1));
      if (idx !== lastFrameIndex) {
        lastFrameIndex = idx;
        const img = getAvailableFrame(idx);
        if (img) {
          drawFrame(img);
        }
      }
    }

    // 快結束才讓底部漸層出現
const fadeOverlayStart = 0.62;
const fadeOverlayProgress = Math.max(
  0,
  Math.min(1, (progress - fadeOverlayStart) / (1 - fadeOverlayStart))
);

const worldcupElement = document.querySelector(".worldcup-component");

if (worldcupElement) {
  const worldcupBottom = worldcupElement.getBoundingClientRect().bottom;
  const worldcupExitFade = Math.max(
    0,
    Math.min(1, worldcupBottom / (window.innerHeight * 0.75))
  );

  worldcupElement.style.setProperty(
    "--worldcup-fade-opacity",
    fadeOverlayProgress * worldcupExitFade
  );
}

    // 世界盃動畫尾端淡出
const fadeStart = 0.82; // 82% 開始淡出
const fadeProgress = Math.max(0, Math.min(1, (progress - fadeStart) / (1 - fadeStart)));
const worldcupOpacity = 1 - fadeProgress;

if (videoContainer) {
  videoContainer.style.opacity = worldcupOpacity;
}

if (particlesCanvas) {
  particlesCanvas.style.opacity = worldcupOpacity;
}

if (fixedCards) {
  fixedCards.style.opacity = Math.min(Number(fixedCards.style.opacity || 0), worldcupOpacity);
}

    // 2. 同步 Hero 极简文字退场：行程拉长至 0.8vh，淡出更为柔和，并带有电影级位移与模糊消散效果
    const fade = Math.max(0, 1 - smoothScrollY / (window.innerHeight * 0.8));
    if (heroElement) {
      heroElement.style.opacity = fade;
      
      const translateY = (1 - fade) * -80; // 平滑向上滑移
      const blur = (1 - fade) * 12; // 渐进式高斯模糊
      heroElement.style.transform = `translateY(${translateY}px)`;
      heroElement.style.filter = `blur(${blur}px)`;
      
      // 完全淡出后隐藏，防止拦截下层交互指针
      if (fade <= 0.001) {
        heroElement.style.visibility = 'hidden';
      } else {
        heroElement.style.visibility = 'visible';
      }
    }

    // 3. 同步滚动固定卡片渐显与 mask 擦除
    updateCardsDamping();

    requestAnimationFrame(videoTick);
  }

  // ===================== DAMPED CARDS MASKING =====================
  const fixedCards = document.getElementById('fixed-cards');
  const cardsGrid = fixedCards.querySelector('.grid');

  function updateCardsDamping() {
    const vh = window.innerHeight;
    const start = triggerTop - vh * 0.3;
    const end = triggerTop + triggerHeight * 0.45; // 渐显动画的扫尾区间
    const range = end - start;

    // 1. 同步卡片各自的线性擦除渐显
    let progress = range > 0 ? (smoothScrollY - start) / range : 0;
    progress = Math.max(0, Math.min(1, progress));

    const revealPct = progress * 130;
    const mask = `linear-gradient(to bottom, black ${revealPct}%, transparent ${revealPct + 18}%)`;
    cardsGrid.style.maskImage = mask;
    cardsGrid.style.webkitMaskImage = mask;

    // 2. 全局边界控制容器状态，超出整个触发区域后隐藏
    const containerActive = smoothScrollY >= start - vh * 0.2 && smoothScrollY <= triggerTop + triggerHeight + vh * 0.2;
    fixedCards.style.opacity = containerActive ? 1 : 0;
    fixedCards.style.pointerEvents = containerActive ? 'auto' : 'none';

    if (!containerActive) return;

    // 3. 独立计算每张卡片的错落淡出 opacity，实现逐个融化退场
    const cards = cardsGrid.querySelectorAll('.card');
    cards.forEach((card, index) => {
      // 随着金杯自下而上地变大，卡片一（最上方）最先在 38% 行程开始淡出，
      // 中部的卡片二在 50% 行程接着淡出，底部的卡片三在 62% 行程（碰触到金杯底座时）最后淡出
      const fadeOutStart = triggerTop + triggerHeight * (0.38 + index * 0.12);
      const fadeOutEnd = triggerTop + triggerHeight * (0.48 + index * 0.12);
      
      let cardOpacity = 1;
      if (smoothScrollY > fadeOutStart) {
        cardOpacity = Math.max(0, 1 - (smoothScrollY - fadeOutStart) / (fadeOutEnd - fadeOutStart));
      }
      
      // 配合滚入时的全局淡入效果，平滑过渡
      const fadeIn = Math.min(1, Math.max(0, (smoothScrollY - (start - vh * 0.2)) / (vh * 0.2)));
      card.style.opacity = cardOpacity * fadeIn;
    });
  }

  async function prepareFrameCache() {
    // React/Vite 版本先不註冊原本的 sw.js，避免路徑衝突。
    return;
  }

  // 开始预加载。Service Worker 只负责缓存，不改变帧数和画质。
  prepareFrameCache().finally(preloadImages);

  // ===================== PARTICLES FLIGHT =====================
  const pCanvas = document.getElementById('particles-canvas');
  const pCtx = pCanvas.getContext('2d');
  let particles = [];

  function resizeParticles() {
    pCanvas.width = window.innerWidth;
    pCanvas.height = window.innerHeight;
    createParticles();
  }

  function createParticles() {
    particles = [];
    const count = Math.floor((pCanvas.width * pCanvas.height) / 12000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * pCanvas.width,
        y: Math.random() * pCanvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        size: Math.random() * 1.5 + 0.5,
        opacity: Math.random() * 0.6 + 0.2
      });
    }
  }

  function animateParticles() {
    pCtx.clearRect(0, 0, pCanvas.width, pCanvas.height);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = pCanvas.width;
      if (p.x > pCanvas.width) p.x = 0;
      if (p.y < 0) p.y = pCanvas.height;
      if (p.y > pCanvas.height) p.y = 0;
      pCtx.beginPath();
      pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      pCtx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      pCtx.fill();
    }
    requestAnimationFrame(animateParticles);
  }

  resizeParticles();
  window.addEventListener('resize', resizeParticles);
  animateParticles();

  // ===================== ELECTRIC CTA BORDER =====================
  function initElectricButtonBorder() {
    const border = document.querySelector('.hero-electric-border');
    const canvas = document.getElementById('hero-electric-canvas');
    if (!border || !canvas) return;

    const ctx = canvas.getContext('2d');
    const offset = 8;
    const radius = 999;
    let width = 0;
    let height = 0;
    let time = 0;
    let last = performance.now();

    function resizeElectricCanvas() {
      const rect = border.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width + offset * 2;
      height = rect.height + offset * 2;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function noise(value, seed) {
      return Math.sin(value * 12.9898 + seed * 78.233 + time * 2.4) * 0.5 + 0.5;
    }

    function pointOnRoundedRect(t, left, top, w, h, r) {
      const rr = Math.min(r, w / 2, h / 2);
      const straightW = w - rr * 2;
      const straightH = h - rr * 2;
      const arc = Math.PI * rr / 2;
      const perimeter = straightW * 2 + straightH * 2 + arc * 4;
      let d = t * perimeter;

      if (d <= straightW) return { x: left + rr + d, y: top };
      d -= straightW;
      if (d <= arc) {
        const a = -Math.PI / 2 + d / arc * Math.PI / 2;
        return { x: left + w - rr + Math.cos(a) * rr, y: top + rr + Math.sin(a) * rr };
      }
      d -= arc;
      if (d <= straightH) return { x: left + w, y: top + rr + d };
      d -= straightH;
      if (d <= arc) {
        const a = d / arc * Math.PI / 2;
        return { x: left + w - rr + Math.cos(a) * rr, y: top + h - rr + Math.sin(a) * rr };
      }
      d -= arc;
      if (d <= straightW) return { x: left + w - rr - d, y: top + h };
      d -= straightW;
      if (d <= arc) {
        const a = Math.PI / 2 + d / arc * Math.PI / 2;
        return { x: left + rr + Math.cos(a) * rr, y: top + h - rr + Math.sin(a) * rr };
      }
      d -= arc;
      if (d <= straightH) return { x: left, y: top + h - rr - d };
      d -= straightH;
      const a = Math.PI + d / arc * Math.PI / 2;
      return { x: left + rr + Math.cos(a) * rr, y: top + rr + Math.sin(a) * rr };
    }

    function drawElectric(now) {
      const delta = Math.min(0.04, (now - last) / 1000);
      last = now;
      time += delta;

      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = '#35c8ff';
      ctx.shadowColor = '#35c8ff';
      ctx.shadowBlur = 12;
      ctx.lineWidth = 1.25;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const rectW = width - offset * 2;
      const rectH = height - offset * 2;
      const samples = Math.max(120, Math.floor((rectW + rectH) * 1.2));

      ctx.beginPath();
      for (let i = 0; i <= samples; i += 1) {
        const t = i / samples;
        const p = pointOnRoundedRect(t, offset, offset, rectW, rectH, radius);
        const jitter = (noise(t * 22, 1) - 0.5) * 3.2 + (noise(t * 41, 2) - 0.5) * 1.6;
        const angle = t * Math.PI * 2;
        const x = p.x + Math.cos(angle) * jitter;
        const y = p.y + Math.sin(angle) * jitter;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      requestAnimationFrame(drawElectric);
    }

    resizeElectricCanvas();
    window.addEventListener('resize', resizeElectricCanvas);
    requestAnimationFrame(drawElectric);
  }

  initElectricButtonBorder();

  // ===================== SECTION 3 FOCAL INTERSECTION =====================
  const sectionThreeInner = document.getElementById('section-three-inner');
  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      sectionThreeInner.classList.add('visible');
      observer.unobserve(sectionThreeInner);
    }
  }, { threshold: 0.15 });
  observer.observe(sectionThreeInner);
  }, []);

  return (
    <div
      className="worldcup-component"
      dangerouslySetInnerHTML={{ __html: worldcupHtml }}
    />
  );
}

const worldcupHtml = `<!-- Preloader loading screen -->
<div id="loader">
  <div class="loader-content">
    <div class="loader-percentage" id="loader-percent">00%</div>
    <div class="loader-bar-bg">
      <div class="loader-bar-fill" id="loader-fill"></div>
    </div>
  </div>
</div>

<!-- Scroll Video Canvas Background -->
<div id="scroll-video-container">
  <div class="ambient-glow"></div>
  <canvas id="video-canvas"></canvas>
  <div class="overlay"></div>
</div>

<!-- Particles Foreground Overlay -->
<canvas id="particles-canvas"></canvas>

<!-- Fixed Cards triggered by scroll -->
<div id="fixed-cards">
  <div class="grid">
    <div class="card">
      <h3>即時賽事掌握</h3>
      <p>提供最接近開打的世界盃賽事資訊，依照台灣時間即時更新，讓你快速掌握下一場重點比賽，不錯過任何精彩對決。</p>
    </div>
    <div class="card">
      <h3>賽事比分回顧</h3>
      <p>整理近期已完賽比分與賽果，快速查看過去 7 天內的比賽結果，包含勝負、比分與賽事狀態，方便你追蹤戰況。</p>
    </div>
    <div class="card">
      <h3>專業分析文章</h3>
      <p>結合賽前數據、球隊狀態、盤口趨勢與近期文章影片，提供更完整的賽事觀點，幫助你看懂比賽背後的關鍵。</p>
    </div>
  </div>
</div>

<!-- Floating Navigation Bar -->
<nav>
  <div style="display:flex;align-items:center;gap:2rem;">
    <span class="logo">worldcup 2026</span>
    <div class="nav-links">
      <a href="#hero">glory</a>
      <a href="#fixed-cards">cities</a>
      <a href="#cards-trigger">schedule</a>
      <a href="#section-three">history</a>
    </div>
  </div>
  <div class="social">
    <a href="#"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg></a>
    <a href="#"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286z"/></svg></a>
    <a href="#"><svg fill="currentColor" viewBox="0 0 24 24"><path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/></svg></a>
  </div>
</nav>

<!-- Scrollable Webpage Content -->
<div id="content">
  <!-- Section 1: Hero SaaS Layout -->
  <section id="hero">
    <div class="gradient-overlay"></div>
    <div class="content">
      <p class="subtitle">2026 WORLD CUP</p>
      <h1 class="hero-title-main">
        <div class="title-row row-1">2026世足火熱登場</div>
        <div class="title-row row-2">
          <div class="gooey-container">
            <svg class="gooey-svg" aria-hidden="true" focusable="false">
              <defs>
                <filter id="gooey-threshold" x="-100%" y="-100%" width="300%" height="300%">
                  <feColorMatrix
                    in="SourceGraphic"
                    type="matrix"
                    values="1 0 0 0 0
                            0 1 0 0 0
                            0 0 1 0 0
                            0 0 0 255 -140"
                  />
                </filter>
              </defs>
            </svg>
            <div class="gooey-wrapper">
              <span id="gooey-text-1" class="highlight-title"></span>
              <span id="gooey-text-2" class="highlight-title"></span>
            </div>
          </div>
        </div>
        <div class="title-row row-3">全在BC博球</div>
      </h1>
      <div class="ctas">
        <div class="electric-border hero-electric-border" style="--electric-border-color:#35c8ff;border-radius:999px;">
          <div class="eb-canvas-container">
            <canvas id="hero-electric-canvas" class="eb-canvas"></canvas>
          </div>
          <div class="eb-layers">
            <div class="eb-glow-1"></div>
            <div class="eb-glow-2"></div>
            <div class="eb-background-glow"></div>
          </div>
          <div class="eb-content">
            <a href="https://lin.ee/tmJOJNM" target="_blank" rel="noreferrer" class="cta-btn">立即註冊領5000</a>
          </div>
        </div>
      </div>
    </div>
    <div class="bounce-arrow">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5"/></svg>
    </div>
  </section>

<!-- Spacer to give scrolling range for video rotation -->
<div style="height:80vh;"></div>

<!-- Cards Trigger Zone -->
<div id="cards-trigger" style="height:100vh;"></div>

<!-- Spacer -->
<div style="height:40vh;"></div>

  <!-- Section 3: Final Call -->
  <section id="section-three">
    <div class="inner" id="section-three-inner">
      <p>BC博球</p>
      <h2>娛樂城介紹</h2>
    </div>
  </section>
</div>`;

export default WorldCupHero;
