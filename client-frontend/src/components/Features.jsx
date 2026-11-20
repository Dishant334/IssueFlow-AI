import React, { useState } from 'react'
import { motion } from 'framer-motion'

// one shared svg wrapper, each feature only gives the paths
const Icon = ({ children }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {children}
  </svg>
)

const featuresData = [
  {
    title: "Project Management",
    image: "/screens/overview.jpg",
    description: "Create and manage projects with clear structure, ownership, and team collaboration.",
    color: "#E0825B",
    icon: (<Icon><path d="M3 3h18v4H3z" /><path d="M7 7v13" /><path d="M17 7v13" /></Icon>),
  },
  {
    title: "Issue Tracking",
    image: "/screens/issues.jpg",
    description: "Track bugs, tasks, and features with detailed status, priority, and assignments.",
    color: "#D9A441",
    icon: (<Icon><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></Icon>),
  },
  {
    title: "Kanban Workflow",
    image: "/screens/kanban.jpg",
    description: "Visualize progress with To Do, In Progress, and Done boards for smooth execution.",
    color: "#8DA36B",
    icon: (<Icon><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /></Icon>),
  },
  {
    title: "Role-Based Access",
    image: "/screens/roles.jpg",
    description: "Admins manage projects while developers focus on assigned issues and execution.",
    color: "#6F9F9A",
    icon: (<Icon><path d="M12 12c2.21 0 4-1.79 4-4S14.21 4 12 4 8 5.79 8 8s1.79 4 4 4Z" /><path d="M6 20c0-3.31 2.69-6 6-6s6 2.69 6 6" /></Icon>),
  },
  {
    title: "AI Assistant",
    image: "/screens/ai.jpg",
    tag: "Gemini",
    description: "Generate task descriptions from a title, suggest priorities, and summarize long comment threads.",
    color: "#E6C26B",
    icon: (<Icon><path d="M12 2v4" /><path d="M12 18v4" /><path d="M4.93 4.93l2.83 2.83" /><path d="M16.24 16.24l2.83 2.83" /><path d="M2 12h4" /><path d="M18 12h4" /></Icon>),
  },
  {
    title: "Team Collaboration",
    image: "/screens/comments.jpg",
    description: "Collaborate seamlessly with comments, updates, and activity tracking on every issue.",
    color: "#D4695A",
    icon: (<Icon><path d="M21 15a4 4 0 0 1-4 4H7l-4 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z" /></Icon>),
  },
]

const Features = () => {
  // on desktop one panel is open (wide) and the rest are squeezed, hover changes which one
  const [active, setActive] = useState(0)

  // moves the spotlight inside the panel to follow the mouse
  const handleMove = (e) => {
    const box = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--x', `${e.clientX - box.left}px`)
    e.currentTarget.style.setProperty('--y', `${e.clientY - box.top}px`)
  }

  return (
    <section id="features" className="relative overflow-hidden bg-[#161412] px-4 py-20 md:px-8">

      {/* soft glow behind the heading */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,rgba(217,99,60,0.12),transparent_65%)]"></div>

      {/* Heading */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="relative text-center"
      >
        <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#E0825B]">Features</p>
        <h2 className="mt-3 text-3xl font-semibold text-[#FAF7F2] md:text-5xl">Everything your team needs</h2>
        <p className="mx-auto mt-4 max-w-xl text-slate-400">
          Designed to support real development workflows.
        </p>
      </motion.div>

      {/* Panels */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        viewport={{ once: true }}
        className="relative mx-auto mt-14 flex max-w-7xl flex-col gap-3 lg:h-140 lg:flex-row"
      >
        {featuresData.map((feature, index) => {
          const isActive = active === index

          return (
            <div
              key={feature.title}
              tabIndex={0}
              onMouseEnter={() => setActive(index)}
              onFocus={() => setActive(index)}
              onMouseMove={handleMove}
              style={{ '--c': feature.color }}
              className={`group relative min-h-44 cursor-pointer overflow-hidden rounded-2xl border bg-[#1F1C19] outline-none
              transition-[flex-grow,border-color,box-shadow] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]
              lg:min-h-0 lg:min-w-0 lg:basis-0
              ${isActive
                ? 'border-(--c)/50 lg:grow-14 shadow-[0_20px_60px_-20px_var(--c)]'
                : 'border-white/10 lg:grow-1 hover:border-white/25'}`}
            >
              {/* colour wash from the feature colour */}
              <div className={`absolute inset-0 bg-[radial-gradient(circle_at_20%_100%,var(--c),transparent_65%)] transition-opacity duration-700
                ${isActive ? 'opacity-25' : 'opacity-0 lg:opacity-0'}`}></div>

              {/* spotlight that follows the cursor */}
              <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100
                bg-[radial-gradient(260px_circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.09),transparent_70%)]"></div>

              {/* big faint number */}
              <span className={`absolute right-5 top-3 z-10 select-none text-6xl font-semibold text-white/4 transition-opacity duration-300 ${isActive ? 'opacity-100' : 'lg:opacity-0'}`} style={{ fontFamily: 'Outfit, sans-serif' }}>
                0{index + 1}
              </span>

              {/* icon */}
              <div
                className={`absolute top-5 grid size-12 place-items-center rounded-xl border transition-all duration-500
                ${isActive ? 'left-5 border-(--c)/40 bg-(--c)/15' : 'left-5 border-white/10 bg-white/5 group-hover:border-(--c)/40 lg:left-1/2 lg:-translate-x-1/2'}`}
                style={{ color: feature.color }}
              >
                {feature.icon}
              </div>

              {/* collapsed state (desktop only): title written sideways */}
              <p
                className={`absolute bottom-6 left-1/2 hidden -translate-x-1/2 rotate-180 whitespace-nowrap text-sm font-medium text-slate-300
                transition-opacity duration-300 [writing-mode:vertical-rl] lg:block
                ${isActive ? 'opacity-0' : 'opacity-100 delay-300'}`}
              >
                {feature.title}
              </p>

              {/* open state: left = small text, right = screenshot. On phones it is always shown */}
              <div
                className={`relative mt-24 flex flex-col gap-5 px-5 pb-6 transition-all duration-500
                lg:absolute lg:inset-y-0 lg:left-0 lg:mt-0 lg:w-full lg:min-w-160 lg:flex-row lg:items-center lg:gap-6 lg:p-6 lg:pb-6
                ${isActive ? 'lg:translate-x-0 lg:opacity-100 lg:delay-200' : 'lg:translate-x-6 lg:opacity-0'}`}
              >
                <div className="lg:w-56 lg:shrink-0 lg:pt-16">
                  <h3 className="text-xl font-semibold text-[#FAF7F2]">{feature.title}</h3>
                  {feature.tag && (
                    <span className="mt-2 inline-block rounded-full border border-(--c)/40 bg-(--c)/10 px-2.5 py-0.5 text-[11px] text-(--c)">
                      {feature.tag}
                    </span>
                  )}
                  <p className="mt-3 text-sm leading-relaxed text-slate-400">{feature.description}</p>
                </div>

                {/* full screenshot in a window frame */}
                <div className="overflow-hidden rounded-xl border border-white/10 shadow-2xl shadow-black/60 lg:min-w-0 lg:flex-1">
                  <img
                    src={feature.image}
                    alt={feature.title + ' screenshot'}
                    loading="lazy"
                    className="aspect-16/10 w-full object-cover"
                  />
                </div>
              </div>
            </div>
          )
        })}
      </motion.div>

    </section>
  )
}

export default Features
