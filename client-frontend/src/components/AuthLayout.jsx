import { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import useParallax from '../hooks/useParallax'
import { ripple } from '../lib/ripple'
import AuthArtwork from './AuthArtwork'
import AuthBackdrop from './AuthBackdrop'
import PanelWires from './PanelWires'

// shared look of the form fields on the sign in and sign up pages
export const labelClass = 'mb-1.5 block text-sm text-slate-400'
export const inputClass =
  'w-full rounded-lg border border-white/10 bg-[#161412] px-4 py-3 text-sm text-[#FAF7F2] placeholder:text-slate-600 outline-none transition focus:border-[#E0825B] focus:ring-2 focus:ring-[#E0825B]/25'
export const buttonClass =
  'relative w-full overflow-hidden rounded-lg bg-linear-to-r from-[#E0825B] to-[#C4552F] py-3 text-sm font-medium text-white shadow-lg shadow-[#C4552F]/25 transition hover:brightness-110 active:scale-[0.99] cursor-pointer'

// How long the terracotta panel slides before the form is swapped: just before it lands, when it has fully covered the
// old form. (Swapping earlier would leave both halves empty for a moment.) Keep this a little under the duration-[650ms]
// of the panel below.
const SLIDE_HEAD_START_MS = 600

// What the panel says. It always talks about the OTHER page: on /login it invites you to sign up.
const PANEL = {
  login: {
    title: 'New to IssueFlow?',
    text: 'Create a workspace, invite your team and get your first project moving in minutes.',
    button: 'Create an account',
    to: '/register',
    // a glass-outline button
    buttonClass: 'border border-white/30 bg-white/10 text-white hover:bg-white/20',
  },
  register: {
    title: 'Already a member?',
    text: 'Pick up your boards, tasks and comments right where you left them.',
    button: 'Log in',
    to: '/login',
    // a solid cream button
    buttonClass: 'bg-[#FAF7F2] text-[#7F3721] hover:bg-white',
  },
}

function BrandMark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9" aria-hidden="true">
      <rect width="40" height="40" rx="11" fill="#FAF7F2" />
      <rect x="11" y="10" width="14" height="4" rx="2" fill="#A34527" />
      <rect x="16" y="10" width="4" height="20" rx="2" fill="#A34527" />
      <rect x="11" y="26" width="14" height="4" rx="2" fill="#A34527" />
      <path d="M30 8 L31.4 12.6 L36 14 L31.4 15.4 L30 20 L28.6 15.4 L24 14 L28.6 12.6 Z" fill="#f5b82e" />
    </svg>
  )
}

function Arrow() {
  return (
    <svg viewBox="0 0 16 16" className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

// The card around the form. It stays mounted when you go from /login to /register (they are two child routes of one
// layout route, see App.jsx), which is what lets the panel SLIDE across instead of the page reloading:
//   /login    : form on the left,  panel on the right
//   /register : panel on the left, form on the right
// Phones (< 768 px) skip the sliding: the panel becomes a banner on top of the form.
export default function AuthLayout() {
  const { pathname, search } = useLocation()
  const navigate = useNavigate()
  const routeMode = pathname.startsWith('/register') ? 'register' : 'login' // which form is mounted (follows the URL)
  const registerRoute = routeMode === 'register'

  // `pending` is the page the panel is sliding TOWARD. The panel (position and text) follows it at once, while the
  // form stays as it is until SLIDE_HEAD_START_MS later, so the old form is covered by the panel instead of vanishing.
  const [pending, setPending] = useState(null)
  const timer = useRef(null)
  const mode = pending ?? routeMode
  const panel = PANEL[mode]
  const onRegister = mode === 'register'

  // The page element gets --mx / --my (the mouse position) for the artwork and the backdrop.
  const pageRef = useRef(null)
  useParallax(pageRef)

  useEffect(() => () => clearTimeout(timer.current), []) // leaving the page cancels a swap that has not happened yet

  function switchPage() {
    if (pending) return // ignore clicks while a slide is under way
    const target = panel.to + search // keeps ?redirect=... from an invite link
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      navigate(target)
      return
    }
    setPending(panel.to === '/register' ? 'register' : 'login')
    timer.current = setTimeout(() => {
      navigate(target)
      setPending(null)
    }, SLIDE_HEAD_START_MS)
  }

  // one listener on the page gives every submit button a click ripple
  function rippleSubmitButtons(event) {
    const button = event.target.closest?.('button[type="submit"]')
    if (button) ripple(button, event.clientX, event.clientY)
  }

  return (
    <div
      ref={pageRef}
      onPointerDown={rippleSubmitButtons}
      className="bg-graph-paper relative isolate flex min-h-screen items-center justify-center overflow-hidden p-4"
    >
      <AuthBackdrop />

      {/* the wrapper holds the card and the soft glow behind it (the card clips its contents, so the glow is a sibling) */}
      <div className="auth-card-in relative w-full max-w-[1040px]">
        <div aria-hidden="true" className="card-halo pointer-events-none absolute inset-0 rounded-3xl" />
        <div className="relative grid w-full grid-cols-[minmax(0,1fr)] overflow-hidden rounded-3xl bg-[#1F1C19] shadow-2xl shadow-black/50 ring-1 ring-white/10 md:min-h-[660px] md:grid-cols-2">

          {/* phone banner (hidden on desktop) */}
          <div className="relative h-36 overflow-hidden bg-linear-to-br from-[#7F3721] to-[#C4552F] md:hidden">
            <AuthArtwork slice className="absolute inset-0 h-full w-full opacity-40" />
            <div className="absolute inset-0 flex items-center gap-3 bg-[#7F3721]/60 px-6">
              <BrandMark />
              <div>
                <p className="font-display text-lg font-semibold text-white">IssueFlow</p>
                <p className="text-xs text-[#F7E3D8]">Plan together. Ship faster.</p>
              </div>
            </div>
          </div>

          {/* the form half: column 1 for log in, column 2 for sign up. key={routeMode} remounts it so it animates in. */}
          <div
            key={routeMode}
            className={`auth-form-in relative z-0 flex min-w-0 items-center justify-center px-6 pb-10 pt-16 sm:px-12 md:pb-6 md:pt-14 ${registerRoute ? 'md:col-start-2' : 'md:col-start-1'} md:row-start-1`}
            style={{ '--auth-from': registerRoute ? '-28px' : '28px' }}
          >
            {/* the way back to the landing page (top-left of the form half) */}
            <Link
              to="/"
              className="group absolute left-5 top-3 inline-flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-sm font-medium text-slate-300 ring-1 ring-white/10 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0825B] sm:left-8 sm:top-4"
            >
              <svg viewBox="0 0 16 16" className="size-4 motion-safe:transition-transform motion-safe:duration-200 motion-safe:group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M13 8H3M7 4L3 8l4 4" />
              </svg>
              Back to home
            </Link>
            <div className="w-full max-w-sm">
              <Outlet />
            </div>
          </div>

          {/* the sliding terracotta panel (desktop only) */}
          <aside
            className={`absolute inset-y-0 left-0 z-10 hidden w-1/2 flex-col justify-between overflow-hidden bg-linear-to-br from-[#7F3721] via-[#A34527] to-[#C4552F] p-10 text-white transition-transform duration-[650ms] ease-[cubic-bezier(0.65,0,0.35,1)] will-change-transform motion-reduce:transition-none md:flex ${onRegister ? 'translate-x-0' : 'translate-x-full'}`}
          >
            <PanelWires />

            <div className="relative flex items-center gap-3">
              <BrandMark />
              <span className="font-display text-xl font-semibold tracking-tight">IssueFlow</span>
            </div>

            <AuthArtwork className="relative mx-auto my-4 w-full max-w-[420px]" />

            <div key={mode} className="auth-fade relative space-y-3">
              <h2 className="font-display text-3xl font-semibold tracking-tight">{panel.title}</h2>
              <p className="max-w-xs text-[#F7E3D8]">{panel.text}</p>
              <button
                type="button"
                onClick={switchPage}
                onPointerDown={(event) => ripple(event.currentTarget, event.clientX, event.clientY)}
                className={`group relative mt-2 inline-flex items-center gap-2 overflow-hidden rounded-xl px-6 py-2.5 text-sm font-semibold backdrop-blur-sm transition duration-200 motion-safe:hover:-translate-y-0.5 motion-safe:active:scale-[0.97] ${panel.buttonClass}`}
              >
                {panel.button}
                <Arrow />
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
