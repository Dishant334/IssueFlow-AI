import React, { useId } from 'react'

// IssueFlow logo: a terracotta tile with an "I" and a small AI spark.
// size = height of the tile in px, showText = show the wordmark next to it
export const LogoMark = ({ size = 40 }) => {
  // every logo on the page needs its own gradient id, or a hidden copy breaks the visible one
  const gradientId = useId()
  return (
  <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="IssueFlow logo">
    <defs>
      <linearGradient id={gradientId} x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#E0825B" />
        <stop offset="1" stopColor="#A34527" />
      </linearGradient>
    </defs>
    <rect width="40" height="40" rx="11" fill={`url(#${gradientId})`} />
    <rect x="11" y="10" width="14" height="4" rx="2" fill="#fff" />
    <rect x="16" y="10" width="4" height="20" rx="2" fill="#fff" />
    <rect x="11" y="26" width="14" height="4" rx="2" fill="#fff" />
    <path d="M30 8 L31.4 12.6 L36 14 L31.4 15.4 L30 20 L28.6 15.4 L24 14 L28.6 12.6 Z" fill="#F6EBC8" />
  </svg>
  )
}

const Logo = ({ size = 40, showText = true, dark = true }) => (
  <span className="inline-flex items-center gap-2.5">
    <LogoMark size={size} />
    {showText && (
      <span
        className={`font-semibold tracking-tight ${dark ? 'text-white' : 'text-slate-900'}`}
        style={{ fontFamily: 'Outfit, sans-serif', fontSize: size * 0.55 }}
      >
        Issue<span className="text-[#E0825B]">Flow</span>
      </span>
    )}
  </span>
)

export default Logo
