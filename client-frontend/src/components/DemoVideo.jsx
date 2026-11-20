import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const SPEEDS = [1, 1.5, 2];

// 75 -> "1:15"
const formatTime = (seconds) => {
  if (!seconds || isNaN(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
};

const DemoVideo = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);
  const sectionRef = useRef(null);

  const [videoError, setVideoError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [flash, setFlash] = useState(null); // the "+5s" / "-5s" bubble

  const isInView = useInView(sectionRef, { amount: 0.5 });

  // play when the player is on screen, pause when the user scrolls away
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (isInView) video.play().catch(() => {});
    else video.pause();
  }, [isInView]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) video.play().catch(() => {});
    else video.pause();
  }

  // move forward or back by some seconds, and show the bubble on that side
  const skip = (seconds) => {
    const video = videoRef.current;
    if (!video) return;
    video.currentTime = Math.min(Math.max(video.currentTime + seconds, 0), video.duration || 0);
    setFlash({ id: Date.now(), seconds });
  }

  const changeSpeed = (value) => {
    videoRef.current.playbackRate = value;
    setSpeed(value);
  }

  const toggleMute = () => {
    videoRef.current.muted = !videoRef.current.muted;
    setMuted(videoRef.current.muted);
  }

  const goFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen();
    else playerRef.current?.requestFullscreen?.();
  }

  const seekTo = (e) => {
    videoRef.current.currentTime = Number(e.target.value);
    setCurrentTime(Number(e.target.value));
  }

  // keyboard: only works while the mouse is over the player (or it has focus),
  // so normal page scrolling with the arrow keys is not blocked
  useEffect(() => {
    if (!hovered) return;
    const handleKey = (e) => {
      if (["INPUT", "TEXTAREA"].includes(e.target.tagName) && e.target.type !== "range") return;
      if (e.key === "ArrowRight") { e.preventDefault(); skip(5); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); skip(-5); }
      else if (e.key === " " || e.key === "k") { e.preventDefault(); togglePlay(); }
      else if (e.key === "f") goFullscreen();
      else if (e.key === "m") toggleMute();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [hovered]);

  // hide the bubble after a moment
  useEffect(() => {
    if (!flash) return;
    const t = setTimeout(() => setFlash(null), 600);
    return () => clearTimeout(t);
  }, [flash]);

  if (videoError) return null;

  const iconButton = "grid size-9 place-items-center rounded-lg text-white/90 transition hover:bg-white/15 hover:text-white";

  return (
    <section id="demo" ref={sectionRef} className="relative overflow-hidden bg-[#161412] px-4 pb-28 pt-8 md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(217,99,60,0.14),transparent_60%)]"></div>

      <div className="relative mx-auto max-w-7xl">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#E0825B]">Product demo</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#FAF7F2] md:text-5xl">See IssueFlow in action</h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Watch how teams plan projects, move tasks across the board and talk in real time.
          </p>
        </motion.div>

        {/* Player */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="absolute -inset-4 rounded-3xl bg-[#C4552F]/20 blur-3xl"></div>

          <div
            ref={playerRef}
            tabIndex={0}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onFocus={() => setHovered(true)}
            onBlur={() => setHovered(false)}
            className="group relative aspect-video w-full overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/60 outline-none"
          >
            <video
              ref={videoRef}
              onClick={togglePlay}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onTimeUpdate={(e) => setCurrentTime(e.target.currentTime)}
              onLoadedMetadata={(e) => setDuration(e.target.duration)}
              onError={() => setVideoError(true)}
              className="h-full w-full cursor-pointer object-contain"
              muted
              playsInline
              preload="metadata"
            >
              <source src="/demo.mp4" type="video/mp4" />
            </video>

            {/* +5s / -5s bubble */}
            <AnimatePresence>
              {flash && (
                <motion.div
                  key={flash.id}
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-black/60 px-5 py-3 text-lg font-medium text-white backdrop-blur-md
                  ${flash.seconds > 0 ? "right-[15%]" : "left-[15%]"}`}
                >
                  {flash.seconds > 0 ? `+${flash.seconds}s` : `${flash.seconds}s`}
                </motion.div>
              )}
            </AnimatePresence>

            {/* big play button while paused */}
            {!isPlaying && (
              <button
                onClick={togglePlay}
                aria-label="Play video"
                className="absolute left-1/2 top-1/2 grid size-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-[#C4552F] text-white shadow-xl shadow-black/40 transition hover:scale-110"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="ml-1 size-8"><path d="M8 5v14l11-7z" /></svg>
              </button>
            )}

            {/* control bar */}
            <div className={`absolute inset-x-0 bottom-0 bg-linear-to-t from-black/80 via-black/40 to-transparent px-4 pb-3 pt-10 transition-opacity duration-300
              ${isPlaying ? "opacity-0 group-hover:opacity-100 group-focus-within:opacity-100" : "opacity-100"}`}>

              {/* seek bar */}
              <input
                type="range"
                min="0"
                max={duration || 0}
                step="0.1"
                value={currentTime}
                onChange={seekTo}
                onPointerUp={(e) => e.currentTarget.blur()}
                aria-label="Seek"
                className="h-1 w-full cursor-pointer appearance-none rounded-full accent-[#E0825B]"
                style={{ background: `linear-gradient(to right, #E0825B ${duration ? (currentTime / duration) * 100 : 0}%, rgba(255,255,255,0.25) 0)` }}
              />

              <div className="mt-2 flex items-center gap-1 text-white">
                <button onClick={togglePlay} aria-label={isPlaying ? "Pause" : "Play"} className={iconButton}>
                  {isPlaying
                    ? <svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M6 4h4v16H6zM14 4h4v16h-4z" /></svg>
                    : <svg viewBox="0 0 24 24" fill="currentColor" className="size-5"><path d="M8 5v14l11-7z" /></svg>}
                </button>

                <button onClick={() => skip(-5)} aria-label="Back 5 seconds" className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-white/90 transition hover:bg-white/15 hover:text-white">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M11 17l-5-5 5-5" /><path d="M18 17l-5-5 5-5" /></svg>
                  5s
                </button>
                <button onClick={() => skip(5)} aria-label="Forward 5 seconds" className="flex h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-white/90 transition hover:bg-white/15 hover:text-white">
                  5s
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4"><path d="M13 17l5-5-5-5" /><path d="M6 17l5-5-5-5" /></svg>
                </button>

                <span className="ml-2 text-xs tabular-nums text-white/80">{formatTime(currentTime)} / {formatTime(duration)}</span>

                <div className="ml-auto flex items-center gap-1">
                  {/* speed */}
                  <div className="mr-2 flex rounded-lg bg-white/10 p-0.5">
                    {SPEEDS.map((value) => (
                      <button
                        key={value}
                        onClick={() => changeSpeed(value)}
                        className={`rounded-md px-2.5 py-1 text-xs font-medium transition ${speed === value ? "bg-[#C4552F] text-white" : "text-white/70 hover:text-white"}`}
                      >
                        {value}x
                      </button>
                    ))}
                  </div>

                  <button onClick={toggleMute} aria-label={muted ? "Unmute" : "Mute"} className={iconButton}>
                    {muted
                      ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M23 9l-6 6M17 9l6 6" /></svg>
                      : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M11 5L6 9H2v6h4l5 4V5z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14" /></svg>}
                  </button>

                  <button onClick={goFullscreen} aria-label="Fullscreen" className={iconButton}>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-5"><path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M3 16v3a2 2 0 0 0 2 2h3M16 21h3a2 2 0 0 0 2-2v-3" /></svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DemoVideo;
