import { useState, useEffect } from "react";
import { motion } from "framer-motion";

// The three AI tools that exist in the app (task form + task window), powered by Google Gemini
const features = [
  {
    title: "Write the description for you",
    short: "Type a title, press Generate.",
    detail: "Give the task a title and IssueFlow drafts a clear description with what done looks like. Edit it or keep it.",
  },
  {
    title: "Suggest a priority",
    short: "A second opinion on what is urgent.",
    detail: "Press Suggest and the task is rated low, medium or high from its title and description. You still make the final call.",
  },
  {
    title: "Summarize long comments",
    short: "Catch up on a thread in seconds.",
    detail: "One click turns a long discussion into a short summary, so nobody has to scroll through every reply.",
  },
];

// ---- the three little previews, drawn in the same dark look as the app ----

const Field = ({ label, children, right }) => (
  <div>
    <div className="mb-1.5 flex items-center justify-between">
      <p className="text-xs text-[#A39989]">{label}</p>
      {right}
    </div>
    {children}
  </div>
);

const pill = "rounded-md bg-[#C4552F] px-2.5 py-1 text-[11px] font-medium text-white";
const input = "rounded-lg border border-white/10 bg-[#1F1C19] px-3 py-2.5 text-sm text-[#F3EDE3]";

function DescriptionPreview() {
  const full = "Implement a dark theme toggle within the settings menu. The feature is complete when the interface successfully switches color schemes upon user interaction.";
  const [typed, setTyped] = useState("");

  useEffect(() => {
    let i = 0;
    let typing;
    // wait a moment like a person pressing Generate, then type the answer
    const start = setTimeout(() => {
      typing = setInterval(() => {
        i++;
        setTyped(full.slice(0, i));
        if (i >= full.length) clearInterval(typing);
      }, 22);
    }, 900);
    return () => { clearTimeout(start); clearInterval(typing); };
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-lg font-semibold text-white">Create New Task</p>
        <p className="text-xs text-[#7A7167]">AI uses left today: 2</p>
      </div>
      <Field label="Title">
        <div className={input}>Add dark mode to settings page</div>
      </Field>
      <Field label="Description" right={<span className={pill}>Generate</span>}>
        <div className={`${input} min-h-24 leading-relaxed`}>
          {typed}
          {typed.length < full.length && <span className="ml-0.5 inline-block h-4 w-px animate-pulse bg-[#E0825B] align-middle"></span>}
        </div>
      </Field>
    </div>
  );
}

function PriorityPreview() {
  const [picked, setPicked] = useState(null);

  useEffect(() => {
    const t = setTimeout(() => setPicked("high"), 1100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <p className="text-lg font-semibold text-white">Create New Task</p>
        <p className="text-xs text-[#7A7167]">AI uses left today: 2</p>
      </div>
      <Field label="Title">
        <div className={input}>Fix invite link bug</div>
      </Field>
      <Field label="Description">
        <div className={`${input} leading-relaxed text-[#CDC3B4]`}>Expired invite links show a blank page instead of an error message.</div>
      </Field>
      <Field label="Priority" right={<span className={pill}>Suggest</span>}>
        <div className="flex gap-2">
          {["low", "medium", "high"].map((level) => (
            <span
              key={level}
              className={`rounded-lg border px-3.5 py-1.5 text-sm transition-all duration-500 ${
                picked === level
                  ? "border-[#C8493A]/60 bg-[#C8493A]/20 text-[#DE8C7F]"
                  : "border-white/10 bg-[#1F1C19] text-[#A39989]"
              }`}
            >
              {level}
            </span>
          ))}
        </div>
      </Field>
    </div>
  );
}

function SummaryPreview() {
  const [summary, setSummary] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setSummary(true), 1300);
    return () => clearTimeout(t);
  }, []);

  const comments = [
    ["Alex", "Wireframes are ready, sharing the Figma link in a minute."],
    ["Sam", "Great, can we add a testimonials row under the hero?"],
    ["Alex", "Yes, adding it now. I will also tighten the mobile spacing."],
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-lg font-semibold text-white">Comments</p>
        <span className={pill}>Summarize comments</span>
      </div>

      {summary && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-lg border border-[#E0825B]/30 bg-[#E0825B]/10 p-3"
        >
          <p className="mb-1 text-[11px] font-medium text-[#E0825B]">Summary</p>
          <p className="text-sm leading-relaxed text-[#F3EDE3]">
            Wireframes are ready. A testimonials row is being added under the hero, along with tighter mobile spacing.
          </p>
        </motion.div>
      )}

      <div className="space-y-2">
        {comments.map(([name, text], i) => (
          <div key={i} className="flex gap-3 rounded-lg bg-[#FAF7F2] p-3">
            <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#D9633C] text-xs font-medium text-white">{name[0]}</span>
            <div>
              <p className="text-sm font-medium text-[#1F1C19]">{name}</p>
              <p className="text-sm text-[#4F4841]">{text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const previews = [DescriptionPreview, PriorityPreview, SummaryPreview];

export default function AiFeatures() {
  const [active, setActive] = useState(0);
  const Preview = previews[active];

  return (
    <section id="ai" className="relative overflow-hidden bg-[#161412] px-4 py-24 md:px-8">
      {/* soft glow in the middle, fades out before the edges so there is no seam */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_75%_50%,rgba(217,99,60,0.14),transparent_60%)]"></div>
      <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[5fr_6fr] lg:gap-20">

        {/* Left: words */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <p className="text-sm text-[#E0825B]">Built in, powered by Google Gemini</p>
          <h2 className="cta-display mt-3 text-5xl font-medium leading-[1.05] text-[#FAF7F2] md:text-6xl">
            Let the busywork write itself.
          </h2>
          <p className="mt-5 max-w-md text-slate-400">
            Three small helpers sit right where you already work. No separate tool, and every answer is a suggestion you can change.
          </p>

          <div className="mt-10 border-t border-white/10">
            {features.map((feature, index) => {
              const isActive = active === index;
              return (
                <button
                  key={feature.title}
                  onClick={() => setActive(index)}
                  onMouseEnter={() => setActive(index)}
                  className="group relative block w-full border-b border-white/10 py-5 text-left"
                >
                  {/* line that grows under the open row */}
                  <span className={`absolute -bottom-px left-0 h-px bg-[#E0825B] transition-all duration-500 ${isActive ? "w-full" : "w-0"}`}></span>

                  <div className="flex gap-5">
                    <span className={`pt-1 text-sm transition-colors ${isActive ? "text-[#E0825B]" : "text-slate-500"}`}>0{index + 1}</span>
                    <div>
                      <h3 className={`text-xl transition-colors ${isActive ? "text-[#FAF7F2]" : "text-slate-400 group-hover:text-slate-200"}`}>
                        {feature.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">{feature.short}</p>
                      <div className={`grid transition-all duration-500 ${isActive ? "mt-3 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                        <p className="overflow-hidden text-sm leading-relaxed text-slate-400">{feature.detail}</p>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Right: what it looks like in the app */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="absolute -inset-3 rounded-3xl bg-[#C4552F]/15 blur-2xl"></div>
          <div className="relative min-h-110 rounded-2xl border border-white/10 bg-[#100E0C] p-6 shadow-2xl shadow-black/50 md:p-8">
            {/* key makes the preview start from the beginning each time you switch */}
            <Preview key={active} />
          </div>
        </motion.div>

      </div>
    </section>
  );
}
