import React from 'react'
import { motion } from 'framer-motion'

const Features = () => {

  const featuresData = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
          className="text-purple-500 size-8 mt-4">
          <path d="M3 3h18v4H3z" />
          <path d="M7 7v13" />
          <path d="M17 7v13" />
        </svg>
      ),
      title: "Project Management",
      description: "Create and manage projects with clear structure, ownership, and team collaboration.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
          className="text-purple-500 size-8 mt-4">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      title: "Issue Tracking",
      description: "Track bugs, tasks, and features with detailed status, priority, and assignments.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
          className="text-purple-500 size-8 mt-4">
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
        </svg>
      ),
      title: "Kanban Workflow",
      description: "Visualize progress with To Do, In Progress, and Done boards for smooth execution.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
          className="text-purple-500 size-8 mt-4">
          <path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4Z" />
          <path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" />
        </svg>
      ),
      title: "Role-Based Access",
      description: "Admins manage projects while developers focus on assigned issues and execution.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
          className="text-purple-500 size-8 mt-4">
          <path d="M12 2v4" />
          <path d="M12 18v4" />
          <path d="M4.93 4.93l2.83 2.83" />
          <path d="M16.24 16.24l2.83 2.83" />
          <path d="M2 12h4" />
          <path d="M18 12h4" />
        </svg>
      ),
      title: "AI-Powered Insights(Future)",
      description: "Generate issue descriptions, suggest priorities, and summarize project progress using AI.",
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"
          className="text-purple-500 size-8 mt-4">
          <path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" />
        </svg>
      ),
      title: "Team Collaboration",
      description: "Collaborate seamlessly with comments, updates, and activity tracking on every issue.",
    }
  ]

  return (
    <div>

      {/* ✅ Heading Animation */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="text-center"
      >
        <p className="text-slate-300 max-w-xl mx-auto mt-2">
          Designed to support real development workflows.
        </p>
      </motion.div>

      {/* ✅ Cards with Stagger Animation */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={{
          hidden: {},
          visible: {
            transition: {
              staggerChildren: 0.15
            }
          }
        }}
        className="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-4 px-6"
      >
        {featuresData.map((feature, index) => (
<motion.div
  key={index}
  variants={{
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 }
  }}
  className="group relative"
>
  {/* Glow Layer */}
  <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-purple-500/0 via-purple-500/40 to-blue-500/0 opacity-0 blur-xl transition-all duration-500 group-hover:opacity-100"></div>

  {/* Card */}
  <div className="relative p-6 rounded-xl space-y-4 border border-slate-200 bg-white max-w-80 w-full
    transition-all duration-500
    group-hover:-translate-y-2
    group-hover:border-purple-300
    group-hover:shadow-[0_20px_60px_-15px_rgba(139,92,246,0.35)]">

    {/* Light Bloom */}
    <div className="absolute inset-0 rounded-xl bg-radial-[circle_at_top] from-purple-100/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition duration-500"></div>

    <div className="relative z-10">
      {feature.icon}

      <h3 className="text-base font-medium text-slate-900">
        {feature.title}
      </h3>

      <p className="text-slate-500 line-clamp-2 pb-6">
        {feature.description}
      </p>
    </div>
  </div>
</motion.div>

        ))}
      </motion.div>

    </div>
  )
}

export default Features