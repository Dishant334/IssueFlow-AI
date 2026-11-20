// The page behind the sign in card, on top of the dotted "graph paper": a few faint outlined task cards that drift
// very slowly and shift a little AGAINST the mouse (--mx / --my from hooks/useParallax.js), so the page has depth.
// They sit at the edges, away from the card, and are only decoration (hidden from screen readers).
// Two wrappers per card because two things move it: the outer one follows the mouse, the inner one drifts.

const CARDS = [
  { left: '3%', top: '9%', rot: -9, dx: 18, dy: -22, dur: 24, depth: 16, tag: '#C8493A' },
  { left: '83%', top: '6%', rot: 7, dx: -16, dy: 20, dur: 28, depth: 11, tag: '#D9A441' },
  { left: '1%', top: '58%', rot: 6, dx: 22, dy: 16, dur: 26, depth: 20, tag: '#8DA36B' },
  { left: '88%', top: '55%', rot: -7, dx: -20, dy: -18, dur: 22, depth: 13, tag: '#C8493A' },
  { left: '15%', top: '82%', rot: -4, dx: 14, dy: -16, dur: 30, depth: 9, tag: '#D9A441', big: true },
  { left: '72%', top: '84%', rot: 10, dx: -14, dy: -20, dur: 25, depth: 17, tag: '#8DA36B', big: true },
]

function CardSilhouette({ tag }) {
  return (
    <svg viewBox="0 0 120 84" className="h-[84px] w-[120px] text-white" fill="none">
      <rect x="1" y="1" width="118" height="82" rx="10" fill="#fff" fillOpacity="0.03" stroke="currentColor" strokeOpacity="0.12" strokeWidth="1.5" />
      <rect x="14" y="16" width="64" height="6" rx="3" fill="currentColor" fillOpacity="0.16" />
      <rect x="14" y="32" width="90" height="4" rx="2" fill="currentColor" fillOpacity="0.09" />
      <rect x="14" y="42" width="72" height="4" rx="2" fill="currentColor" fillOpacity="0.09" />
      <rect x="14" y="58" width="34" height="12" rx="6" fill={tag} fillOpacity="0.35" />
    </svg>
  )
}

export default function AuthBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {CARDS.map((card) => (
        <div
          key={`${card.left}-${card.top}`}
          className={`absolute ${card.big ? 'hidden lg:block' : 'hidden sm:block'}`}
          style={{
            left: card.left,
            top: card.top,
            transform: `translate(calc(var(--mx, 0) * ${-card.depth}px), calc(var(--my, 0) * ${-card.depth * 0.75}px))`,
            transition: 'transform 400ms ease-out',
          }}
        >
          <div
            className="auth-drift"
            style={{ '--r': `${card.rot}deg`, '--dx': `${card.dx}px`, '--dy': `${card.dy}px`, animationDuration: `${card.dur}s`, transform: `rotate(${card.rot}deg)` }}
          >
            <CardSilhouette tag={card.tag} />
          </div>
        </div>
      ))}
    </div>
  )
}
