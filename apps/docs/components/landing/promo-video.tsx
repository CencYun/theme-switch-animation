'use client'

import { motion, useReducedMotion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'

const SRC = '/video/theme-switch-promo-16x9-57s.mp4'
const POSTER = '/video/cover.jpg'

/**
 * Hero 底部的 57 秒产品宣传片（片子里全是真实组件渲染，不是截图拼贴）。
 *
 * 两处刻意的设计：
 * 1. 画面露出过半才挂 <video> —— 8.8MB 成片不参与首屏加载，首屏只有本地 poster 图，LCP 也是它；
 * 2. 尊重 prefers-reduced-motion —— 降级为静态封面，播放由用户点。
 * 播控交给浏览器原生 controls（含音量/进度/全屏），不另做一套按钮。
 */
export function PromoVideo() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const [armed, setArmed] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setArmed(true)
          io.disconnect()
        }
      },
      // 半张画面真露出来才拉流：hero 不算高，只按"进视野"判据会在首屏加载瞬间就挂上 8.8MB，
      // 与首屏的字体和入场动画抢带宽；阈值 0.5 让首屏停在本地 poster 图上，滚一点再开播。
      { threshold: 0.5 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <motion.div
      ref={wrapRef}
      initial={{ opacity: 0, y: 24, filter: 'blur(10px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ type: 'spring', stiffness: 260, damping: 28 }}
      // hero 容器是 gap-7 的 flex 列，这里的 mt 与 gap 叠加，让宣传片和 CTA 之间留出主视觉的分量
      className="mt-8 w-full max-w-4xl md:mt-12"
    >
      <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-black">
        {armed ? (
          <video
            className="absolute inset-0 size-full"
            src={SRC}
            poster={POSTER}
            muted
            loop
            playsInline
            controls
            autoPlay={!reduce}
            preload="none"
            controlsList="nodownload noplaybackrate"
          />
        ) : (
          // biome-ignore lint/performance/noImgElement: 静态导出 + images.unoptimized，next/image 在此没有收益；这张就是 video 的 poster
          <img
            src={POSTER}
            alt="theme-switch-animation 产品宣传片封面"
            className="absolute inset-0 size-full object-cover"
          />
        )}
      </div>
    </motion.div>
  )
}
