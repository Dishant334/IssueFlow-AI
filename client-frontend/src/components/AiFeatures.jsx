import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const features = [
  {
    id: 1,
    number: "01",
    tag: "Comment Intelligence",
    title: "AI Comment Summarization",
    description: "Turn long discussions into clear, actionable summaries in seconds.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
    preview: {
      type: "comments",
      issue: "#3487",
      comments: [
        { name: "Sarah Wilson", time: "2h ago", avatar: "SW", text: "I think the API response is not consistent when the token expires." },
        { name: "John Doe", time: "1h ago", avatar: "JD", text: "Yes, I noticed the same issue in staging environment." },
        { name: "Mike Johnson", time: "45m ago", avatar: "MJ", text: "Let's update the middleware logic to handle this edge case." },
      ],
    },
  },
  {
    id: 2,
    number: "02",
    tag: "Description Engine",
    title: "AI Description Generator",
    description: "Generate detailed, structured issue descriptions from a simple title.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14,2 14,8 20,8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10,9 9,9 8,9"/>
      </svg>
    ),
    preview: {
      type: "description",
      title: "Fix login error on expired token",
      description: "Users are unable to login when their authentication token has expired. The system returns a 500 error instead of redirecting to login. This affects the user experience and should be handled gracefully.",
      criteria: [
        "Handle expired token gracefully",
        "Redirect to login page",
        "Show appropriate error message",
      ],
    },
  },
  {
    id: 3,
    number: "03",
    tag: "Priority Engine",
    title: "AI Priority Suggestion",
    description: "Get smart priority recommendations based on task context and impact.",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
      </svg>
    ),
    preview: {
      type: "priority",
      title: "Fix login error on expired token",
      description: "Users are unable to login when their authentication token has expired…",
      priority: "High",
      reasoning: "High user impact • Affects core functionality • Urgent fix",
      confidence: 92,
    },
  },
];

// ── Preview Panels ──────────────────────────────────────────────────────────

function CommentsPreview({ data }) {
  const [showSummary, setShowSummary] = useState(false);
  useEffect(() => {
    setShowSummary(false);
    const t = setTimeout(() => setShowSummary(true), 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="15,18 9,12 15,6"/></svg>
        </button>
        <span className="text-sm font-semibold text-slate-700">Issue {data.issue}</span>
        <div className="flex gap-4 ml-2">
          {["Overview", "Comments", "Activity"].map((tab) => (
            <span key={tab} className={`text-xs font-medium pb-1 cursor-pointer transition-colors ${tab === "Comments" ? "text-violet-600 border-b-2 border-violet-500" : "text-slate-400 hover:text-slate-600"}`}>{tab}</span>
          ))}
        </div>
      </div>

      {/* Comments */}
      <div className="flex-1 space-y-3 overflow-hidden">
        {data.comments.map((c, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.15 }}
            className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-violet-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0">{c.avatar}</div>
            <div className="flex-1 bg-slate-50 rounded-xl p-3">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs font-semibold text-slate-700">{c.name}</span>
                <span className="text-[10px] text-slate-400">{c.time}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">{c.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI Summary */}
      <AnimatePresence>
        {!showSummary ? (
          <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="mt-4 flex items-center gap-2 text-violet-500 text-xs font-medium">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-3 h-3 border-2 border-violet-300 border-t-violet-600 rounded-full" />
            AI is analyzing comments…
          </motion.div>
        ) : (
          <motion.div key="summary" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-xl bg-violet-50 border border-violet-100 p-3">
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="text-violet-500">✦</span>
              <span className="text-[11px] font-bold text-violet-600 uppercase tracking-wide">AI Summary</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">{data.summary}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DescriptionPreview({ data }) {
  const [typed, setTyped] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setTyped(""); setDone(false);
    let i = 0;
    const t = setInterval(() => {
      if (i < data.description.length) { setTyped(data.description.slice(0, ++i)); }
      else { clearInterval(t); setDone(true); }
    }, 18);
    return () => clearInterval(t);
  }, [data.description]);

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
        <div className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">{data.title}</div>
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
          <span className="text-[10px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-semibold">✦ AI Generated</span>
        </div>
        <div className="rounded-xl border border-violet-200 bg-violet-50/50 px-3 py-3 text-xs text-slate-600 leading-relaxed min-h-20">
          {typed}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.5 }} className="inline-block w-0.5 h-3 bg-violet-500 ml-0.5 align-middle" />
        </div>
      </div>

      <AnimatePresence>
        {done && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Suggested Acceptance Criteria</label>
            <div className="mt-2 space-y-1.5">
              {data.criteria.map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.12 }}
                  className="flex items-center gap-2 text-xs text-slate-600">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3"><polyline points="20,6 9,17 4,12"/></svg>
                  </div>
                  {c}
                </motion.div>
              ))}
            </div>
            <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
              className="mt-4 w-full py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold tracking-wide hover:opacity-90 transition-opacity">
              Use This Description
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PriorityPreview({ data }) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    setProgress(0);
    const t = setTimeout(() => {
      let p = 0;
      const i = setInterval(() => { p += 2; setProgress(Math.min(p, data.confidence)); if (p >= data.confidence) clearInterval(i); }, 20);
      return () => clearInterval(i);
    }, 600);
    return () => clearTimeout(t);
  }, [data.confidence]);

  const priorityColors = { High: { bg: "bg-rose-50", border: "border-rose-200", text: "text-rose-600", dot: "bg-rose-500" }, Medium: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-600", dot: "bg-amber-500" }, Low: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-600", dot: "bg-emerald-500" } };
  const pc = priorityColors[data.priority] || priorityColors.High;

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Title</label>
        <div className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700">{data.title}</div>
      </div>
      <div>
        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Description</label>
        <div className="mt-1 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs text-slate-500 leading-relaxed">{data.description}</div>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className={`rounded-xl border ${pc.border} ${pc.bg} p-4`}>
        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Suggested Priority</div>
        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2.5 h-2.5 rounded-full ${pc.dot}`} />
          <span className={`text-lg font-bold ${pc.text}`}>{data.priority}</span>
        </div>
        <p className="text-xs text-slate-500">{data.reasoning}</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidence Score</span>
          <span className="text-xs font-bold text-slate-700">{progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div className="h-full rounded-full bg-linear-to-r from-violet-500 to-indigo-500"
            style={{ width: `${progress}%` }} transition={{ duration: 0.1 }} />
        </div>
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
          className="mt-4 w-full py-2.5 rounded-xl bg-linear-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold tracking-wide hover:opacity-90 transition-opacity">
          Apply Priority
        </motion.button>
      </motion.div>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────────────────────

export default function AiFeatures() {
  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const sliderProgress = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  // Auto-advance on scroll
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      if (v < 0.33) setActive(0);
      else if (v < 0.66) setActive(1);
      else setActive(2);
    });
    return unsub;
  }, [scrollYProgress]);

  return (
    <section ref={sectionRef} className="relative my-16 h-[600vh]">
      <div className="sticky top-0 h-screen overflow-visible bg-[#f8f7ff]">
        {/* Subtle grid bg */}
        <div className="absolute inset-0 opacity-[0.035]"
          style={{ backgroundImage: "linear-linear(#6d28d9 1px, transparent 1px), linear-linear(90deg, #6d28d9 1px, transparent 1px)", backgroundSize: "40px 40px" }} />

        {/* Glow blobs */}
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-300/20 rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-indigo-300/15 rounded-full blur-[80px]" />

        <div className="relative z-10 h-full flex flex-col px-8 md:px-16 py-10">
          {/* Section header */}
          <div className="mb-8 flex flex-col justify-center items-center">
                     <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                       className="text-violet-600 text-3xl font-bold tracking-[0.3em] uppercase mb-2">
                       AI Workflow Intelligence
                     </motion.p>
                     <h2 className="text-xg md:text-3xl font-black text-slate-900 leading-tight">
                       Intelligent features that<br />
                       <span className="text-transparent bg-clip-text bg-linear-to-r from-violet-600 to-indigo-600">understand your workflow</span>
                     </h2>
                     <p className="text-slate-500 text-sm mt-2 max-w-md">
                       Our AI capabilities reduce manual effort, improve clarity, and help your team move faster.
                     </p>
                   </div>

          {/* Main layout */}
          <div className="flex-1 grid grid-cols-5 gap-8 min-h-0">

            {/* LEFT — Feature selector */}
            <div className="col-span-2 flex gap-4">

              {/* Progress rail */}
              <div className="relative flex flex-col items-center py-2">
                <div className="w-0.75 flex-1 bg-slate-200 rounded-full relative overflow-hidden">
                  <motion.div className="absolute top-0 left-0 w-full bg-linear-to-b from-violet-500 to-indigo-600 rounded-full"
                    style={{ height: sliderProgress }} />
                </div>
              </div>

              {/* Feature cards */}
              <div className="flex-1 flex flex-col justify-between py-2">
                {features.map((f, i) => {
                  const isActive = active === i;
                  return (
                    <motion.button key={f.id} onClick={() => setActive(i)} whileHover={{ x: 4 }}
                      className={`relative text-left rounded-2xl p-5 border transition-all duration-300 cursor-pointer w-full ${
                        isActive
                          ? "bg-white border-violet-200 shadow-[0_8px_40px_-12px_rgba(109,40,217,0.25)]"
                          : "bg-white/50 border-transparent hover:bg-white/80"
                      }`}>
                      {/* Active indicator dot */}
                      <div className="absolute -left-6.5 top-1/2 -translate-y-1/2 flex items-center justify-center">
                        <div className={`w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                          isActive ? "border-violet-600 bg-violet-600" : "border-slate-300 bg-white"
                        }`}>
                          {isActive && <motion.div layoutId="activeDot" className="w-1.5 h-1.5 rounded-full bg-white" />}
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-xl transition-all duration-300 shrink-0 ${
                          isActive ? "bg-violet-100 text-violet-600" : "bg-slate-100 text-slate-400"
                        }`}>
                          {f.icon}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-0.5">
                            <span className={`text-[10px] font-black tracking-widest ${isActive ? "text-violet-500" : "text-slate-300"}`}>{f.number}</span>
                            {isActive && (
                              <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                                className="text-[9px] bg-violet-100 text-violet-600 px-1.5 py-0.5 rounded-full font-bold">
                                {f.tag}
                              </motion.span>
                            )}
                          </div>
                          <h3 className={`text-sm font-bold leading-snug transition-colors duration-300 ${isActive ? "text-slate-900" : "text-slate-500"}`}>
                            {f.title}
                          </h3>
                          <AnimatePresence>
                            {isActive && (
                              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                                className="text-xs text-slate-400 mt-1 leading-relaxed overflow-hidden">
                                {f.description}
                              </motion.p>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* RIGHT — Preview panel */}
            <div className="col-span-3 flex flex-col">
              <AnimatePresence mode="wait">
                <motion.div key={active}
                  initial={{ opacity: 0, y: 20, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.97 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="flex-1  bg-white rounded-3xl  border  border-slate-200 shadow-[0_20px_80px_-20px_rgba(109,40,217,0.15)]  p-7  overflow-y-auto  custom-scrollbar">

                  {/* Panel header */}
                  <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-rose-400" />
                      <div className="w-3 h-3 rounded-full bg-amber-400" />
                      <div className="w-3 h-3 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 flex justify-center">
                    
                    </div>
                  </div>

                  {/* Dynamic preview */}
                  {features[active].preview.type === "comments" && <CommentsPreview data={features[active].preview} />}
                  {features[active].preview.type === "description" && <DescriptionPreview data={features[active].preview} />}
                  {features[active].preview.type === "priority" && <PriorityPreview data={features[active].preview} />}
                </motion.div>
              </AnimatePresence>

              {/* Scroll hint */}
              <div className="flex items-center justify-center gap-2 mt-4">
                {features.map((_, i) => (
                  <button key={i} onClick={() => setActive(i)}
                    className={`transition-all duration-300 rounded-full ${active === i ? "w-6 h-2 bg-violet-600" : "w-2 h-2 bg-slate-300 hover:bg-violet-300"}`} />
                ))}
              </div>
              <p className="text-center text-slate-400 text-xs mt-2 flex items-center justify-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                Click a feature or scroll to explore
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
