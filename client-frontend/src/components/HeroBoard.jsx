import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const columns = [
  { name: 'Not started', dot: 'bg-slate-400' },
  { name: 'In progress', dot: 'bg-[#D9A441]' },
  { name: 'Done', dot: 'bg-[#8DA36B]' },
]

const startCards = [
  { id: 1, title: 'Design login screen', tag: 'High', tagStyle: 'bg-[#C8493A]/20 text-[#DE8C7F]', col: 0 },
  { id: 2, title: 'Set up socket events', tag: 'Medium', tagStyle: 'bg-[#D9A441]/20 text-[#E6C26B]', col: 0 },
  { id: 3, title: 'Write API docs', tag: 'Low', tagStyle: 'bg-slate-500/20 text-slate-300', col: 1 },
  { id: 4, title: 'Fix invite email bug', tag: 'High', tagStyle: 'bg-[#C8493A]/20 text-[#DE8C7F]', col: 1 },
  { id: 5, title: 'Deploy to Render', tag: 'Medium', tagStyle: 'bg-[#D9A441]/20 text-[#E6C26B]', col: 2 },
]

// a 2D kanban board where one card moves to the next column every 2 seconds, forever
const HeroBoard = () => {
  const [cards, setCards] = useState(startCards)
  const [next, setNext] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCards((old) => old.map((c, i) => (i === next ? { ...c, col: (c.col + 1) % 3 } : c)))
      setNext((n) => (n + 1) % startCards.length)
    }, 2000)
    return () => clearInterval(timer)
  }, [next])

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.9, duration: 0.9, ease: 'easeOut' }}
      className="relative w-full max-w-xl z-2"
    >
      {/* floating chip: team activity */}
      <motion.div
        animate={{ y: [0, 12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        className="hidden md:flex absolute right-2 -bottom-6 z-10 items-center gap-2 rounded-xl border border-white/10 bg-[#1F1C19] px-3 py-2 shadow-xl shadow-black/40"
      >
        <span className="size-2 rounded-full bg-[#8DA36B] animate-pulse"></span>
        <span className="text-xs text-slate-200">3 teammates online</span>
      </motion.div>

      {/* board window */}
      <div className="rounded-2xl border border-white/10 bg-[#1F1C19]/90 backdrop-blur-md shadow-2xl shadow-black/50 overflow-hidden">
        <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#C8493A]"></span>
          <span className="size-2.5 rounded-full bg-[#D9A441]"></span>
          <span className="size-2.5 rounded-full bg-[#8DA36B]"></span>
          <p className="ml-3 text-xs text-slate-500">Sprint board</p>
        </div>

        <div className="grid grid-cols-3 gap-3 p-4">
          {columns.map((column, colIndex) => (
            <div key={column.name} className="min-h-56 rounded-xl bg-[#161412]/70 p-3">
              <div className="mb-3 flex items-center gap-2">
                <span className={`size-2 rounded-full ${column.dot}`}></span>
                <p className="text-xs font-medium text-slate-300">{column.name}</p>
              </div>

              <div className="flex flex-col gap-2">
                {cards.filter((c) => c.col === colIndex).map((card) => (
                  <motion.div
                    key={card.id}
                    layout
                    layoutId={`card-${card.id}`}
                    transition={{ type: 'spring', stiffness: 220, damping: 26 }}
                    className="rounded-lg border border-white/10 bg-[#332E29] p-3 text-left"
                  >
                    <p className="text-xs text-slate-100">{card.title}</p>
                    <span className={`mt-2 inline-block rounded-full px-2 py-0.5 text-[10px] ${card.tagStyle}`}>{card.tag}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default HeroBoard
