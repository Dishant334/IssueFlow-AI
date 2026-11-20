// The picture on the sign in / sign up panel. It shows what IssueFlow does in one image: a Kanban board, one task
// highlighted in amber, and a dashed line carrying it across to the Done column, with an AI suggestion and a comment
// floating beside it. Drawn in code (no photo): cream for the board at low opacity, amber for "this is the task".
//
// It is alive but calm (all of it off for people who asked for less motion):
//   * the whole picture floats a few pixels (one slow loop, so the pieces never drift apart),
//   * the layers shift slightly with the mouse (--mx / --my from hooks/useParallax.js), deeper layers more,
//   * the dashed line travels from the task to the Done column, and the two chips pulse now and then.

const AMBER = '#f5b82e'
const PAPER = '#fbf6ee'
const INK = '#4F4841'

// One bar standing in for a line of text.
function Line({ x, y, width, tone = 0.2, height = 5, color = '#fff' }) {
  return <rect x={x} y={y} width={width} height={height} rx={height / 2} fill={color} opacity={tone} />
}

// A layer that shifts with the mouse: `depth` is how many pixels it moves at the edge of the window.
function layer(depth) {
  return {
    transform: `translate(calc(var(--mx, 0) * ${depth}px), calc(var(--my, 0) * ${depth * 0.75}px))`,
    transition: 'transform 300ms ease-out',
  }
}

const COLUMNS = [
  { x: 48, cards: 2 },
  { x: 176, cards: 1 },
  { x: 304, cards: 1 },
]

export default function AuthArtwork({ className = '', slice = false }) {
  return (
    <svg
      viewBox="0 0 480 360"
      className={className}
      preserveAspectRatio={slice ? 'xMidYMid slice' : 'xMidYMid meet'}
      role="img"
      aria-label="A Kanban board where a highlighted task moves from To do to Done"
    >
      <defs>
        <pattern id="auth-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M24 0H0V24" fill="none" stroke="#fff" strokeOpacity="0.06" />
        </pattern>
      </defs>
      <rect width="480" height="360" fill="url(#auth-grid)" />

      <g className="art-float-1">
        {/* layer 1: the board (moves least) */}
        <g style={layer(4)}>
          <g className="auth-rise" style={{ animationDelay: '0ms' }}>
            <rect x="30" y="60" width="420" height="250" rx="16" fill="#fff" fillOpacity="0.08" stroke="#fff" strokeOpacity="0.2" />

            {COLUMNS.map((column, index) => (
              <g key={column.x}>
                <rect x={column.x} y="78" width="112" height="214" rx="10" fill="#fff" fillOpacity="0.07" />
                <circle cx={column.x + 14} cy="95" r="4" fill={index === 0 ? '#fff' : index === 1 ? AMBER : '#c9dba8'} opacity="0.85" />
                <Line x={column.x + 26} y={92} width={44} tone={0.5} />
              </g>
            ))}

            {/* a few ordinary cards */}
            <rect x="58" y="162" width="92" height="46" rx="8" fill="#fff" fillOpacity="0.14" />
            <Line x={68} y={176} width={62} tone={0.5} />
            <Line x={68} y={190} width={44} tone={0.25} />

            <rect x="186" y="112" width="92" height="46" rx="8" fill="#fff" fillOpacity="0.14" />
            <Line x={196} y={126} width={56} tone={0.5} />
            <Line x={196} y={140} width={66} tone={0.25} />

            <rect x="314" y="112" width="92" height="46" rx="8" fill="#fff" fillOpacity="0.14" />
            <Line x={324} y={126} width={60} tone={0.5} />
            <Line x={324} y={140} width={40} tone={0.25} />
          </g>

          {/* the task that moves: the highlighter */}
          <g className="auth-rise" style={{ animationDelay: '160ms' }}>
            <rect x="58" y="110" width="92" height="46" rx="8" fill={AMBER} fillOpacity="0.25" stroke={AMBER} strokeOpacity="0.9" />
            <rect x="68" y="122" width="58" height="5" rx="2.5" fill={AMBER} />
            <rect x="68" y="136" width="40" height="5" rx="2.5" fill={AMBER} opacity="0.55" />
          </g>
        </g>

        {/* layer 2: the line from the task to the Done column */}
        <g style={layer(6)}>
          <g className="auth-rise" style={{ animationDelay: '380ms' }}>
            <path className="art-flow" d="M150 133 C 220 133, 250 235, 314 235" fill="none" stroke="#fff" strokeOpacity="0.85" strokeWidth="1.6" strokeDasharray="4 4" />
            <circle cx="150" cy="133" r="3" fill="#fff" />
            {/* the task, landed in Done */}
            <rect x="314" y="218" width="92" height="46" rx="8" fill={AMBER} fillOpacity="0.14" stroke={AMBER} strokeOpacity="0.5" strokeDasharray="3 3" />
          </g>
        </g>

        {/* layer 3: the AI suggestion and a comment (move most) */}
        <g style={layer(8)}>
          <g className="auth-rise" style={{ animationDelay: '260ms' }}>
            <g className="art-pulse">
              <rect x="300" y="20" width="150" height="36" rx="18" fill={PAPER} />
              <path d="M326 28 L328 34 L334 36 L328 38 L326 44 L324 38 L318 36 L324 34 Z" fill="#C4552F" />
              <rect x="342" y="34" width="92" height="5" rx="2.5" fill={INK} opacity="0.55" />
              <rect x="342" y="43" width="60" height="4" rx="2" fill={INK} opacity="0.25" />
            </g>

            <g className="art-pulse" style={{ animationDelay: '0.8s' }}>
              <rect x="40" y="300" width="160" height="40" rx="20" fill={PAPER} />
              <circle cx="62" cy="320" r="11" fill="#C4552F" />
              <text x="62" y="324" textAnchor="middle" fontSize="11" fontWeight="700" fill="#fff" fontFamily="ui-sans-serif, system-ui, sans-serif">A</text>
              <rect x="82" y="312" width="100" height="5" rx="2.5" fill={INK} opacity="0.5" />
              <rect x="82" y="323" width="70" height="4" rx="2" fill={INK} opacity="0.25" />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
