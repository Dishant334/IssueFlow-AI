import { useRef } from "react";
import { motion, useScroll, useSpring, useInView } from "framer-motion";
import { FolderPlus, MailPlus, KanbanSquare, MessagesSquare, Rocket } from "lucide-react";

// the real path a team takes in IssueFlow
const steps = [
  {
    icon: FolderPlus,
    title: "Create a workspace",
    desc: "Name it and you are the admin. Add projects inside it, one for each thing your team is building.",
    note: "Workspaces and projects",
  },
  {
    icon: MailPlus,
    title: "Invite your team",
    desc: "Send a secure invite link by email and choose who is an admin and who is a member.",
    note: "Link works once, for 7 days",
  },
  {
    icon: KanbanSquare,
    title: "Plan on the board",
    desc: "Add tasks to To do, In progress and Done. Let AI write the description and suggest a priority, then drag cards along.",
    note: "Drag and drop + Gemini",
  },
  {
    icon: MessagesSquare,
    title: "Talk it through",
    desc: "Comments show up live for everyone on the task, so questions get answered where the work is.",
    note: "Real time with Socket.IO",
  },
  {
    icon: Rocket,
    title: "Ship it",
    desc: "Watch progress climb on the overview, then archive the project when it is done and keep it as a read-only record.",
    note: "Progress and archive",
  },
];

const Step = ({ step, index }) => {
  const ref = useRef(null);
  // lights up when the step reaches the middle of the screen, and stays lit
  const reached = useInView(ref, { once: true, margin: "0px 0px -45% 0px" });
  const Icon = step.icon;
  const onRight = index % 2 === 1;

  return (
    <div ref={ref} className="relative md:grid md:grid-cols-2">

      {/* node sitting on the line */}
      <div
        className={`absolute left-5 top-6 z-10 grid size-11 -translate-x-1/2 place-items-center rounded-full border-2 transition-all duration-500 md:left-1/2
        ${reached
          ? "scale-100 border-[#E0825B] bg-[#C4552F] text-white shadow-[0_0_30px_rgba(224,130,91,0.55)]"
          : "scale-90 border-white/15 bg-[#161412] text-slate-500"}`}
      >
        <Icon size={20} />
      </div>

      {/* card */}
      <motion.div
        initial={{ opacity: 0, x: onRight ? 40 : -40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "0px 0px -15% 0px" }}
        transition={{ duration: 0.6 }}
        className={`ml-14 md:ml-0 ${onRight ? "md:col-start-2 md:pl-16" : "md:col-start-1 md:pr-16"}`}
      >
        <div className={`group relative rounded-2xl border bg-[#1F1C19] p-6 transition-all duration-500 hover:-translate-y-1
          ${reached ? "border-[#E0825B]/30" : "border-white/10"} hover:border-[#E0825B]/60 hover:shadow-[0_20px_50px_-20px_rgba(224,130,91,0.45)]`}>

          {/* little arm joining the card to the line (desktop) */}
          <span className={`absolute top-10 hidden h-px w-16 bg-linear-to-r transition-colors duration-500 md:block
            ${onRight ? "-left-16 from-[#E0825B]/60 to-transparent" : "-right-16 from-transparent to-[#E0825B]/60"}
            ${reached ? "" : "opacity-30"}`}></span>

          <p className="text-sm font-medium text-[#E0825B]">Step {index + 1}</p>
          <h3 className="mt-2 text-xl font-semibold text-[#FAF7F2] md:text-2xl">{step.title}</h3>
          <p className="mt-3 leading-relaxed text-slate-400">{step.desc}</p>
          <span className="mt-4 inline-block rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-400">
            {step.note}
          </span>
        </div>
      </motion.div>
    </div>
  );
};

const WorkFlow = () => {
  const trackRef = useRef(null);

  // how far down the timeline we have scrolled, 0 to 1
  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 60%", "end 55%"] });
  const fill = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });

  return (
    <section id="how-it-works" className="relative overflow-hidden bg-[#161412] px-4 py-28 md:px-8">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,rgba(217,99,60,0.10),transparent_65%)]"></div>

      <div className="relative mx-auto max-w-4xl">

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-center"
        >
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#E0825B]">How it works</p>
          <h2 className="mt-3 text-3xl font-semibold text-[#FAF7F2] md:text-5xl">From first project to shipped</h2>
          <p className="mx-auto mt-4 max-w-xl text-slate-400">
            Five steps, and every one of them is something you can do in the app today.
          </p>
        </motion.div>

        <div ref={trackRef} className="relative space-y-10 md:space-y-14">
          {/* the line: a faint track and a terracotta fill that grows while you scroll */}
          <div className="absolute bottom-0 left-5 top-0 w-px -translate-x-1/2 bg-white/10 md:left-1/2"></div>
          <motion.div
            style={{ scaleY: fill }}
            className="absolute bottom-0 left-5 top-0 w-0.5 origin-top -translate-x-1/2 bg-linear-to-b from-[#E0825B] to-[#C4552F] shadow-[0_0_12px_rgba(224,130,91,0.7)] md:left-1/2"
          />

          {steps.map((step, index) => (
            <Step key={step.title} step={step} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
};

export default WorkFlow;
