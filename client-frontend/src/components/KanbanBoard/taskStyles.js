// how the tasks look, shared by the project board and the My Tasks board
// priority pill
export const priorityStyle = {
  high: { label: "High", pill: "bg-red-500/15 text-red-300" },
  medium: { label: "Medium", pill: "bg-amber-500/15 text-amber-300" },
  low: { label: "Low", pill: "bg-slate-500/20 text-slate-300" },
};

// column dot + the status chip shown on every card
export const columnStyle = {
  todo: {
    dot: "bg-slate-400",
    chipDot: "bg-slate-400",
    chip: "bg-slate-500/15 text-slate-300",
    chipLabel: "Not Started",
    over: "bg-slate-400/5 ring-slate-400/30",
  },
  in_progress: {
    dot: "bg-amber-400",
    chipDot: "bg-amber-400",
    chip: "bg-amber-500/15 text-amber-300",
    chipLabel: "In Progress",
    over: "bg-amber-400/5 ring-amber-400/30",
  },
  done: {
    dot: "bg-emerald-400",
    chipDot: "bg-emerald-400",
    chip: "bg-emerald-500/15 text-emerald-300",
    chipLabel: "Complete",
    over: "bg-emerald-400/5 ring-emerald-400/30",
  },
};

// every user gets the same gradient avatar
const avatarColors = [
  "bg-[#C4552F]",
  "bg-[#738A52]",
  "bg-[#A37624]",
  "bg-[#A0674D]",
  "bg-[#4B7673]",
  "bg-[#8C7B5A]",
];
export const avatarColor = (name = "") =>
  avatarColors[(name.charCodeAt(0) || 0) % avatarColors.length];
