import React from 'react'

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
    title: "AI-Powered Insights",
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

];

  return (
    <div>
      
            <div class="text-center">
                <p mt-2 class=" text-slate-300 max-w-xl mx-auto">
                    Designed to support real development workflows.
                </p>
            </div>
            <div class="flex flex-wrap items-center justify-center gap-6 md:gap-4 mt-4 px-6">
                {featuresData.map((feature, index) => (
                    <div key={index} className={`hover:-translate-y-0.5 transition duration-300 ${index === 1 ? 'p-px rounded-[13px] bg-linear-to-br from-[#9544FF] to-[#223B60]' : ''}`}>
                        <div className="p-6 rounded-xl space-y-4 border border-slate-800 bg-slate-700 max-w-80 w-full">
                            {feature.icon}
                            <h3 className="text-base font-medium text-white">
                                {feature.title}
                            </h3>
                            <p className="text-slate-400 line-clamp-2 pb-6">
                                {feature.description}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
    </div>
  )
}

export default Features
