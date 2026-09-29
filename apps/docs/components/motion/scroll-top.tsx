'use client'

/**
 * 回到顶部浮钮：外圈是滚动进度环，圆心显示百分比，悬停换成向上箭头，点击平滑回顶。
 *
 * 丝滑的关键是分工：进度环走 useScroll 的 MotionValue，`strokeDashoffset` 由 useTransform
 * 直驱，滚动时每帧只改一个 style 值、不进 React；setState 只在整数百分比和显隐边界变化时发生。
 * 全站 html 已有 `scroll-behavior: smooth`，这里显式传 behavior 是为了让 prefers-reduced-motion
 * 下退回直切（CSS 里那条 media query 也在兜底）。
 */

import { ArrowUp } from 'lucide-react'
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useState } from 'react'

import { SPRING_LAYOUT, SPRING_PRESS } from '@/lib/ease'
import { useHoverCapable } from '@/lib/hooks/use-hover-capable'
import { cn } from '@/lib/utils'

const RADIUS = 20
const CIRCUMFERENCE = 2 * Math.PI * RADIUS
/** 滚过这个像素才出现，避免刚进页面就被一个浮钮占住右下角 */
const SHOW_AFTER = 480

export function ScrollTop({ className }: { className?: string }) {
  const reduce = useReducedMotion()
  const canHover = useHoverCapable()
  const { scrollY, scrollYProgress } = useScroll()
  const [pct, setPct] = useState(0)
  const [visible, setVisible] = useState(false)
  const dashOffset = useTransform(
    scrollYProgress,
    (p) => CIRCUMFERENCE * (1 - p),
  )

  // 只在整数百分比变化时重渲染，滚动过程不被 setState 拖住
  useMotionValueEvent(scrollYProgress, 'change', (p) => {
    const next = Math.round(p * 100)
    setPct((prev) => (prev === next ? prev : next))
  })
  useMotionValueEvent(scrollY, 'change', (y) => {
    const next = y > SHOW_AFTER
    setVisible((prev) => (prev === next ? prev : next))
  })

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={toTop}
          aria-label={`回到顶部（已滚动 ${pct}%）`}
          initial={{ opacity: 0, scale: 0.82, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{
            opacity: 0,
            scale: 0.86,
            y: 12,
            transition: { duration: reduce ? 0 : 0.16 },
          }}
          transition={reduce ? { duration: 0 } : SPRING_LAYOUT}
          whileHover={canHover ? { scale: 1.07 } : undefined}
          whileTap={{ scale: 0.92, transition: SPRING_PRESS }}
          className={cn(
            'group fixed end-5 bottom-5 z-50 grid size-12 place-items-center rounded-full border bg-background/80 text-muted-foreground shadow-lg backdrop-blur transition-colors hover:text-foreground sm:end-6 sm:bottom-6',
            'dark:border-t-white/5',
            className,
          )}
        >
          <svg
            viewBox="0 0 48 48"
            aria-hidden
            className="absolute inset-0 size-full -rotate-90"
          >
            <circle
              cx={24}
              cy={24}
              r={RADIUS}
              fill="none"
              strokeWidth={2}
              className="stroke-border"
            />
            <motion.circle
              cx={24}
              cy={24}
              r={RADIUS}
              fill="none"
              strokeWidth={2}
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              className="stroke-primary"
              style={{ strokeDashoffset: dashOffset }}
            />
          </svg>
          <span className="relative grid place-items-center">
            {/* 有悬停的设备平时看进度、悬停换箭头；触屏没有 hover，直接给箭头这个动作提示 */}
            <span
              className={cn(
                'text-[11px] leading-none font-medium tabular-nums transition-opacity duration-200',
                canHover ? 'group-hover:opacity-0' : 'opacity-0',
              )}
            >
              {pct}%
            </span>
            <ArrowUp
              className={cn(
                'absolute size-4 transition-opacity duration-200',
                canHover ? 'opacity-0 group-hover:opacity-100' : 'opacity-100',
              )}
            />
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
