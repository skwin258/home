import { useEffect, useRef, useState } from "react";
import "./BackgroundMusic.css";

const REGISTER_URL = "https://lin.ee/tmJOJNM";

function BackgroundMusic() {
  const audioRef = useRef(null);
  const clickSoundsRef = useRef([]);
  const clickSoundIndexRef = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return undefined;

    audio.volume = 0.42;

    const tryPlay = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    };

    tryPlay();

    const playAfterInteraction = () => {
      tryPlay();
      window.removeEventListener("pointerdown", playAfterInteraction);
      window.removeEventListener("keydown", playAfterInteraction);
      window.removeEventListener("scroll", playAfterInteraction);
    };

    window.addEventListener("pointerdown", playAfterInteraction, { once: true });
    window.addEventListener("keydown", playAfterInteraction, { once: true });
    window.addEventListener("scroll", playAfterInteraction, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", playAfterInteraction);
      window.removeEventListener("keydown", playAfterInteraction);
      window.removeEventListener("scroll", playAfterInteraction);
    };
  }, []);

  useEffect(() => {
    clickSoundsRef.current = Array.from({ length: 6 }, () => {
      const sound = new Audio("/audio/click-sound.mp3");
      sound.volume = 0.68;
      sound.preload = "auto";
      return sound;
    });

    const playClickSound = () => {
      const sounds = clickSoundsRef.current;
      if (sounds.length === 0) return;

      const sound = sounds[clickSoundIndexRef.current % sounds.length];
      clickSoundIndexRef.current += 1;
      sound.currentTime = 0;
      sound.play().catch(() => {});
    };

    window.addEventListener("pointerdown", playClickSound);

    return () => {
      window.removeEventListener("pointerdown", playClickSound);
      clickSoundsRef.current.forEach((sound) => sound.pause());
      clickSoundsRef.current = [];
    };
  }, []);

  const toggleMusic = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      await audio.play();
      setIsPlaying(true);
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "auto" });
  };

  return (
    <>
      <audio ref={audioRef} src="/audio/background-music.mp3" autoPlay loop preload="auto" />

      <div className="floating-actions">
        <a
          className="floating-register"
          href={REGISTER_URL}
          target="_blank"
          rel="noreferrer"
          aria-label="立即註冊"
        >
          <span>
            立即
            <br />
            註冊
          </span>
        </a>

        <button type="button" className="floating-top" onClick={scrollToTop} aria-label="回到頂部">
          TOP
        </button>

        <button
          type="button"
          className={`background-music-toggle ${isPlaying ? "is-playing" : ""}`}
          onClick={toggleMusic}
          aria-label={isPlaying ? "暫停背景音樂" : "播放背景音樂"}
        >
          <span>{isPlaying ? "♪" : "♫"}</span>
        </button>
      </div>
    </>
  );
}

export default BackgroundMusic;
