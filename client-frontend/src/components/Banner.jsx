import React from 'react'
import { Link } from 'react-router-dom'

const Banner = () => {
  return (
    <>
        <div className="relative overflow-hidden flex flex-wrap items-center justify-between w-full px-4 md:px-14 py-3 md:py-2 font-medium text-sm text-center text-white/90 bg-linear-to-r from-[#4F46E5] via-[#6366F1] to-[#7C3AED]">
            <p>Manage projects. Track issues. Deliver smarter with AI.</p>
            <Link to="/Register" className="flex items-center gap-1 px-3 py-1 rounded-lg text-violet-600 bg-violet-50 hover:bg-slate-100 hover:scale-105 hover:shadow-md transition-all duration-200 active:scale-95">
                Explore now
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.91797 7H11.0846" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M7 2.9165L11.0833 6.99984L7 11.0832" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
            </Link>
              <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-full w-[50%] h-full bg-linear-to-r from-transparent via-white/10 to-transparent animate-shine" />
         </div>
        </div>
</>
  )
}

export default Banner
