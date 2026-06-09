import { motion } from "framer-motion";
import {
  FolderPlus,
  Bug,
  Sparkles,
  Rocket,
} from "lucide-react";

const steps = [
  {
    icon: FolderPlus,
    title: "Create Project",
    desc: "Set up your workspace, team members and project structure in seconds.",
  },
  {
    icon: Bug,
    title: "Add Issues",
    desc: "Track bugs, tasks and feature requests with detailed status updates.",
  },
  {
    icon: Sparkles,
    title: "AI Prioritizes",
    desc: "IssueFlow analyzes issues and highlights what needs attention first.",
  },
  {
    icon: Rocket,
    title: "Ship Faster",
    desc: "Collaborate efficiently and deliver projects without bottlenecks.",
  },
];

const WorkFlow = () => {
  return (
    <section className="relative py-28 overflow-hidden bg-white">

      {/* glow */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 h-72 w-72 rounded-full bg-purple-400/20 blur-[120px]" />

      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-20">
          <p className="text-purple-600 font-medium mb-3">
            HOW IT WORKS
          </p>

          <h2 className="text-4xl md:text-6xl font-semibold text-[#1f1840]">
            Simple Workflow.
            <br />
            Powerful Results.
          </h2>

          <p className="text-gray-500 mt-6 max-w-2xl mx-auto">
            Streamline your project lifecycle from planning to delivery with
            AI-powered issue management.
          </p>
        </div>

        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-8">

          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 70 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.6,
                  delay: index * 0.15,
                }}
                className="relative group"
              >
                {/* number */}
                <div className="absolute -top-4 left-6 h-10 w-10 rounded-full bg-linear-to-r from-purple-500 to-violet-600 text-white flex items-center justify-center font-semibold shadow-lg">
                  {index + 1}
                </div>

                <div className="h-full rounded-3xl border border-purple-100 bg-white p-8 shadow-sm hover:shadow-xl transition-all duration-500 ">

                  <div className="h-14 w-14 rounded-2xl bg-purple-100 flex items-center justify-center mb-6">
                    <Icon className="text-purple-600" size={28} />
                  </div>

                  <h3 className="text-xl font-semibold text-[#1f1840] mb-4">
                    {step.title}
                  </h3>

                  <p className="text-gray-500 leading-relaxed">
                    {step.desc}
                  </p>

                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WorkFlow;