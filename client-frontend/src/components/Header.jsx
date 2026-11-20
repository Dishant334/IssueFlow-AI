import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Logo from './Logo'

// ── The home page header, all in this one file ──────────────────────────────────────────────────────────────────────
// A floating frosted-glass bar that stays at the top while the page scrolls. Left: the logo and the page links (the
// section you are reading has a dot). Right: the links that leave the site (with a small arrow), "Log in" and a
// "Get started" pill. Below `xl` the links collapse into a menu button. No animation: hover and focus only change colours.

const GITHUB_URL = 'https://github.com/Dishant334/IssueFlow-AI'

// Left group: the sections of this page. "Home" is the top of the page (`#`); the others are the ids of the sections
// further down (in the same order as on the page).
const SECTION_LINKS = [
  { label: 'Home', href: '#' },
  { label: 'Features', href: '#features' },
  { label: 'AI assistant', href: '#ai' },
  { label: 'Demo', href: '#demo' },
  { label: 'How it works', href: '#how-it-works' },
]

// Right group: links that leave the site (they open in a new tab and carry a small arrow).
const EXTERNAL_LINKS = [
  { label: 'GitHub', href: GITHUB_URL },
  { label: 'Docs', href: `${GITHUB_URL}#readme` },
]

// ── Look ──
// FROSTED glass on a dark page: a faint pale tint, a strong blur of whatever is behind the bar, a hairline edge and a soft shadow.
const GLASS =
  'bg-white/[0.06] backdrop-blur-[10px] ring-1 ring-white/10 shadow-[0_10px_28px_-14px_rgb(0_0_0/0.6)] ' +
  'group-data-[light=true]/h:bg-[#1F1C19]/[0.06] group-data-[light=true]/h:ring-[#1F1C19]/10 group-data-[light=true]/h:shadow-[0_10px_28px_-14px_rgb(31_28_25/0.25)]'

// The menu for narrower screens sits over page text, so it is a more solid frosted panel to keep the links readable.
const GLASS_PANEL =
  'bg-[#1F1C19]/90 backdrop-blur-[10px] ring-1 ring-white/10 shadow-[0_10px_28px_-14px_rgb(0_0_0/0.7)] ' +
  'group-data-[light=true]/h:bg-[#FAF7F2]/90 group-data-[light=true]/h:ring-[#1F1C19]/10 group-data-[light=true]/h:shadow-[0_10px_28px_-14px_rgb(31_28_25/0.3)]'

// A text link in the bar or the menu: quiet by default, a faint veil on hover (an instant change, no transition).
const LINK_CLASS =
  'inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-[15px] font-medium text-[#FAF7F2]/75 hover:bg-white/[0.07] hover:text-[#FAF7F2] ' +
  'group-data-[light=true]/h:text-[#1F1C19]/70 group-data-[light=true]/h:hover:bg-[#1F1C19]/[0.06] group-data-[light=true]/h:hover:text-[#1F1C19] ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0825B]'

// The main call to action: a terracotta pill.
const PRIMARY =
  'inline-flex items-center justify-center rounded-xl bg-linear-to-r from-[#E0825B] to-[#C4552F] px-5 py-2.5 text-[15px] font-medium text-white hover:opacity-90 ' +
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0825B]'

// the logo goes back to the top of the page (we are already on "/", so a normal link would do nothing)
const goToTop = (e) => {
  e.preventDefault()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [current, setCurrent] = useState('#') // the link of the section being read
  const [onLight, setOnLight] = useState(false) // true while the cream footer is behind the bar

  // Esc closes the menu
  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => e.key === 'Escape' && setMenuOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [menuOpen])

  // which section are we in? The last section whose top has passed 40% of the window height.
  useEffect(() => {
    const ids = ['features', 'ai', 'demo', 'how-it-works']
    const onScroll = () => {
      let found = '#'
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= window.innerHeight * 0.4) found = `#${id}`
      }
      setCurrent(found)

      // the footer is uncovered once the CTA (the last section above it) has scrolled up past the bar
      const cta = document.getElementById('get-started')
      setOnLight(!!cta && cta.getBoundingClientRect().bottom < 70)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header data-light={onLight} className="group/h fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 md:px-10">
      {/* for keyboard users: the first Tab stop jumps past the header */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-10 focus:rounded-lg focus:bg-[#FAF7F2] focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-[#1F1C19]"
      >
        Skip to content
      </a>

      <div className="relative mx-auto max-w-[1400px]">
        <nav aria-label="Main" className={`flex items-center gap-2 rounded-[18px] py-2 pl-4 pr-2 ${GLASS}`}>
          <Link to="/" onClick={goToTop} aria-label="IssueFlow, back to top" className="flex shrink-0 items-center rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0825B]">
            <Logo size={34} dark={!onLight} />
          </Link>

          <div className="ml-4 hidden xl:block">
            <SectionLinks current={current} />
          </div>

          <div className="ml-auto hidden items-center gap-1 xl:flex">
            <ExternalLinks />
            <span aria-hidden="true" className="mx-1 h-5 w-px bg-white/15 group-data-[light=true]/h:bg-[#1F1C19]/15" />
            <AuthLinks />
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="home-mobile-menu"
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            className="ml-auto grid size-10 place-items-center rounded-xl text-[#FAF7F2]/80 hover:bg-white/[0.07] hover:text-[#FAF7F2] group-data-[light=true]/h:text-[#1F1C19]/80 group-data-[light=true]/h:hover:bg-[#1F1C19]/[0.06] group-data-[light=true]/h:hover:text-[#1F1C19] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#E0825B] xl:hidden"
          >
            <svg viewBox="0 0 20 20" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
              {menuOpen ? <path d="M5 5l10 10M15 5L5 15" /> : <path d="M3 6h14M3 10h14M3 14h14" />}
            </svg>
          </button>
        </nav>

        {menuOpen && <MobileMenu id="home-mobile-menu" current={current} onClose={() => setMenuOpen(false)} />}
      </div>
    </header>
  )
}

// The page links. The one of the section being read is the current one: brighter, with a small dot in front
// (aria-current says the same to screen readers). `stacked` = one per row (the menu); `onNavigate` closes that menu.
function SectionLinks({ current, stacked = false, onNavigate }) {
  return (
    <ul className={stacked ? 'flex flex-col' : 'flex items-center gap-0.5'}>
      {SECTION_LINKS.map((link) => {
        const isCurrent = link.href === current
        return (
          <li key={link.href}>
            <a
              href={link.href}
              onClick={(e) => {
                if (link.href === '#') goToTop(e) // "Home": scroll to the top
                onNavigate?.()
              }}
              aria-current={isCurrent ? 'location' : undefined}
              className={`${LINK_CLASS} ${stacked ? 'w-full py-2.5' : ''} ${isCurrent ? 'text-[#FAF7F2] group-data-[light=true]/h:text-[#1F1C19]' : ''}`}
            >
              {isCurrent && <span aria-hidden="true" className="size-1.5 shrink-0 rounded-full bg-[#E0825B]" />}
              {link.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}

// The links that leave the site: each opens in a new tab and ends with a small up-right arrow.
function ExternalLinks({ stacked = false }) {
  return (
    <ul className={stacked ? 'flex flex-col' : 'flex items-center gap-0.5'}>
      {EXTERNAL_LINKS.map((link) => (
        <li key={link.href}>
          <a href={link.href} target="_blank" rel="noopener noreferrer" className={`${LINK_CLASS} ${stacked ? 'w-full py-2.5' : ''}`}>
            {link.label}
            <svg viewBox="0 0 10 10" className="size-2.5 opacity-70" fill="none" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M2.5 7.5l5-5M3 2.5h4.5V7" />
            </svg>
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

// "Log in" and "Get started". (People who are already signed in never see this page: Home sends them to the app.)
// `stacked` = full-width buttons for the menu; `onNavigate` closes that menu.
function AuthLinks({ stacked = false, onNavigate }) {
  const wrap = stacked ? 'flex flex-col gap-2' : 'flex items-center gap-1.5'
  const secondary = stacked ? `${LINK_CLASS} justify-center ring-1 ring-white/15 group-data-[light=true]/h:ring-[#1F1C19]/15` : LINK_CLASS
  return (
    <div className={wrap}>
      <Link to="/login" onClick={onNavigate} className={secondary}>
        Log in
      </Link>
      <Link to="/register" onClick={onNavigate} className={PRIMARY}>
        Get started
      </Link>
    </div>
  )
}

// The menu for narrower screens: a frosted panel under the bar with the same links and buttons, one per row. It opens
// and closes at once (no animation). Choosing a page link closes it.
function MobileMenu({ id, current, onClose }) {
  return (
    <div id={id} className={`absolute inset-x-0 top-full mt-2 rounded-[18px] p-3 xl:hidden ${GLASS_PANEL}`}>
      <SectionLinks current={current} stacked onNavigate={onClose} />
      <div className="my-2 border-t border-white/10 group-data-[light=true]/h:border-[#1F1C19]/10" />
      <ExternalLinks stacked />
      <div className="mt-3 border-t border-white/10 pt-3 group-data-[light=true]/h:border-[#1F1C19]/10">
        <AuthLinks stacked onNavigate={onClose} />
      </div>
    </div>
  )
}
