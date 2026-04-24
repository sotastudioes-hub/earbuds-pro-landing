import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FooterDrawer } from './components/FooterDrawer'
import { CheckoutModal } from './components/CheckoutModal'

const FRAME_COUNT = 265
const START_FRAME = 20

export default function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [progress, setProgress] = useState(0)
  const [isFooterOpen, setIsFooterOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const imagesRef = useRef<HTMLImageElement[]>([])
  const lastRenderedFrameRef = useRef(-1)
  const progressRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const loadImages = async () => {
      const firstImg = new Image()
      firstImg.src = `/frames_webp/frame_${START_FRAME.toString().padStart(4, '0')}.webp`
      await new Promise((resolve) => {
        firstImg.onload = resolve
      })
      imagesRef.current[START_FRAME] = firstImg
      render(START_FRAME)

      for (let i = 1; i <= FRAME_COUNT; i++) {
        if (i === START_FRAME) continue
        const img = new Image()
        img.src = `/frames_webp/frame_${i.toString().padStart(4, '0')}.webp`
        img.onload = () => { imagesRef.current[i] = img }
      }
    }

    const render = (frameIdx: number) => {
      const img = imagesRef.current[frameIdx]
      if (!img || !canvas || !ctx) return

      const cA = canvas.width / canvas.height
      const iA = img.width / img.height
      let dw, dh, dx, dy

      if (cA < 0.8) {
        dw = canvas.width * 1.5
        dh = dw / iA
        dx = (canvas.width - dw) / 2
        dy = (canvas.height - dh) / 2
      } else if (iA > cA) {
        dh = canvas.height
        dw = dh * iA
        dx = (canvas.width - dw) / 2
        dy = 0
      } else {
        dw = canvas.width
        dh = dw / iA
        dx = 0
        dy = (canvas.height - dh) / 2
      }
      ctx.drawImage(img, dx, dy, dw, dh)
      lastRenderedFrameRef.current = frameIdx
    }

    let rafId: number
    const PARALLAX_SCROLL = 10000

    const tick = () => {
      const scrollY = window.scrollY
      const cinematicProgress = Math.max(0, Math.min(1, scrollY / PARALLAX_SCROLL))

      // Only update state if progress changed significantly to avoid unnecessary re-renders
      if (Math.abs(cinematicProgress - progressRef.current) > 0.0001) {
        setProgress(cinematicProgress)
        progressRef.current = cinematicProgress
      }

      const frameIdx = Math.round(START_FRAME + cinematicProgress * (FRAME_COUNT - START_FRAME))
      if (frameIdx !== lastRenderedFrameRef.current && imagesRef.current[frameIdx]) {
        render(frameIdx)
      }
      rafId = requestAnimationFrame(tick)
    }

    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth * window.devicePixelRatio
        canvas.height = window.innerHeight * window.devicePixelRatio
        const frameIdx = Math.round(START_FRAME + progressRef.current * (FRAME_COUNT - START_FRAME))
        if (imagesRef.current[frameIdx]) render(frameIdx)
      }
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    loadImages()
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('resize', handleResize)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div className="relative bg-[#f2f2f2] font-main text-zinc-900" style={{ overscrollBehavior: 'none' }}>
      {/* Background Canvas */}
      <div id="bg-container" className="fixed top-0 left-0 right-0 bottom-[-100px] z-0 bg-[#f2f2f2]">
        <canvas ref={canvasRef} className="w-full h-full object-cover" />
      </div>

      <style>
        {`
          @keyframes marquee {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
          .animate-marquee {
            display: flex;
            animation: marquee 80s linear infinite;
            width: max-content;
          }
        `}
      </style>

      {/* Navigation */}
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 w-[calc(100%-32px)] max-w-[1200px] h-14 rounded-full bg-white/70 backdrop-blur-xl border border-white/30 flex items-center justify-between px-5 z-50">
        <a href="#" className="font-display font-extrabold text-lg text-zinc-900">Earbuds Pro</a>
        <button
          onClick={() => cartCount > 0 && setIsCheckoutOpen(true)}
          className={`btn-cool relative flex items-center gap-2 px-6 overflow-hidden transition-all duration-500 ${cartCount > 0 ? 'pr-4' : ''}`}
        >
          <span>Buy</span>
          {cartCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              key={cartCount}
              className="flex items-center justify-center w-5 h-5 rounded-full bg-white text-zinc-900 text-[10px] font-black"
            >
              {cartCount}
            </motion.span>
          )}
        </button>
      </nav>

      {/* Blue Ticker (Marquee) - Disappears early on scroll */}
      <div className={`fixed top-[82px] left-0 w-full h-7 bg-blue-600 z-40 overflow-hidden flex items-center border-y border-blue-500 shadow-lg transition-all duration-700 ${progress < 0.015 ? 'opacity-100' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-blue-600 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-blue-600 to-transparent z-10 pointer-events-none" />

        <div className="animate-marquee">
          {[...Array(12)].map((_, i) => (
            <span key={i} className="text-[9px] font-black uppercase tracking-[4px] text-white px-12 whitespace-nowrap">
              Limited Launch Offer • Free Worldwide Shipping • Order Now • Limited Launch Offer • Free Worldwide Shipping • Order Now
            </span>
          ))}
        </div>
      </div>

      {/* Floating Spec Labels */}
      <div className={`spec-label top-[15%] right-[10%] text-right ${progress > 0.22 && progress < 0.38 ? 'visible' : ''}`}>
        <div className="text-[11px] font-extrabold text-accent uppercase tracking-wider">Mic</div>
        <div className="text-lg font-bold text-zinc-900">Beamforming</div>
        <div className={`text-[10px] text-zinc-500 font-medium leading-snug mt-1 max-w-[150px] transition-all duration-700 ${progress > 0.24 && progress < 0.38 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          Crystal clear voice capture.
        </div>
      </div>
      <div className={`spec-label top-[22%] left-[10%] ${progress > 0.25 && progress < 0.38 ? 'visible' : ''}`}>
        <div className="text-[11px] font-extrabold text-accent uppercase tracking-wider">Driver</div>
        <div className="text-lg font-bold text-zinc-900">High-excursion</div>
        <div className={`text-[10px] text-zinc-500 font-medium leading-snug mt-1 max-w-[150px] transition-all duration-700 ${progress > 0.27 && progress < 0.38 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          Deep bass, zero distortion.
        </div>
      </div>
      <div className={`spec-label top-[75%] right-[10%] text-right ${progress > 0.28 && progress < 0.38 ? 'visible' : ''}`}>
        <div className="text-[11px] font-extrabold text-accent uppercase tracking-wider">H2 Chip</div>
        <div className="text-lg font-bold text-zinc-900">Ultra-low latency</div>
        <div className={`text-[10px] text-zinc-500 font-medium leading-snug mt-1 max-w-[150px] ml-auto transition-all duration-700 ${progress > 0.30 && progress < 0.38 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          Advanced computational power.
        </div>
      </div>
      <div className={`spec-label top-[82%] left-[10%] ${progress > 0.31 && progress < 0.38 ? 'visible' : ''}`}>
        <div className="text-[11px] font-extrabold text-accent uppercase tracking-wider">Tip</div>
        <div className="text-lg font-bold text-zinc-900">Perfect Seal</div>
        <div className={`text-[10px] text-zinc-500 font-medium leading-snug mt-1 max-w-[150px] transition-all duration-700 ${progress > 0.33 && progress < 0.38 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
          All-day comfort and fit.
        </div>
      </div>

      {/* Content Sections */}
      <div className={`content-inner justify-end pb-[10vh] items-start pl-[25vw] ${progress < 0.08 ? 'visible' : ''}`}>
        <div className="overline-text">Engineered for Detail</div>
        <h1 className="headline-xl">Earbuds Pro</h1>
        <p className="sub-headline">Pure acoustics. Seamless design.</p>
      </div>

      <div className={`content-inner justify-between pt-[15vh] pb-[8vh] items-center text-center ${progress > 0.1 && progress < 0.22 ? 'visible' : ''}`}>
        <div className="flex flex-col items-center">
          <h2 className="headline-lg">Beyond Sound.</h2>
          <p className="text-[12px] text-zinc-500 font-bold uppercase tracking-[3px] mt-1 opacity-70">Computational Audio Era</p>
        </div>
        <p className="text-[22px] md:text-[32px] font-bold text-zinc-900 leading-tight max-w-[600px]">
          Every micron refined for an <br className="hidden md:block" /> acoustic experience.
        </p>
      </div>

      <div className={`content-inner justify-center items-center text-center ${progress > 0.38 && progress < 0.58 ? 'visible' : ''}`}>
        <h2 className="headline-xl text-zinc-900 uppercase leading-[0.85] scale-125">
          Meet the <br /> Future
        </h2>
      </div>

      <div
        className={`content-inner justify-start pt-[10vh] items-start text-left ${progress > 0.6 && progress < 0.78 ? 'visible' : ''}`}
        style={{ transform: `translateY(${progress > 0.6 && progress < 0.78 ? (15 - ((progress - 0.6) / 0.18) * 15) : 0}vh)` }}
      >
        <h3 className="headline-lg">Sound tunnel.</h3>
        <p className="sub-headline">Spatial algorithms measure your unique ear shape.</p>
      </div>

      <div className={`content-inner justify-between pt-[15vh] pb-[10vh] items-center ${progress > 0.82 && progress < 0.92 ? 'visible' : ''}`}>
        <div className="text-center">
          <h2 className="headline-lg">Infinite Energy.</h2>
          <p className="overline-text opacity-60">Power that keeps up with you</p>
        </div>
        <div className="grid grid-cols-2 gap-2.5 w-full max-w-[400px]">
          {[{ v: '30h', d: 'Battery' }, { v: '6h', d: 'Charge' }, { v: '2x', d: 'ANC' }, { v: '24-bit', d: 'Lossless' }].map((s, i) => (
            <div key={i} className="bg-white/80 p-4 rounded-2xl text-center border border-black/5 shadow-sm">
              <div className="text-2xl font-extrabold">{s.v}</div>
              <div className="text-[9px] font-bold text-zinc-500 uppercase tracking-widest">{s.d}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Final Section */}
      <div className={`content-inner items-center justify-center pointer-events-auto bg-transparent ${progress >= 0.99 ? 'visible' : ''}`}>
        <div className="flex flex-col justify-between h-[100dvh] w-full max-w-[500px] text-center px-10 py-[12vh]">
          <div>
            <div className="text-[14px] font-black uppercase tracking-[8px] text-black mb-3 drop-shadow-sm">Limited Launch Offer</div>
            <h2 className="text-[64px] font-black leading-none text-white drop-shadow-2xl">$249</h2>
            <div className="text-[13px] font-semibold text-white/70 underline cursor-pointer mt-2 drop-shadow-md">Free shipping and 30-day free returns*</div>
          </div>
          <div className="flex-1" />
          <div>
            <div className="text-[32px] font-black text-white tracking-tighter mb-1 drop-shadow-xl">Earbuds Pro</div>
            <div className="text-[10px] font-black uppercase tracking-[3px] text-accent drop-shadow-md">H2 Chip • Active Noise Cancellation • MagSafe Case</div>
            <button
              onClick={() => setCartCount(prev => prev + 1)}
              className="btn-cool w-full h-14 text-lg mt-5 shadow-2xl transition-transform active:scale-[0.98]"
            >
              Add to Bag
            </button>
          </div>
        </div>

        {/* Pullable Footer Tab */}
        <motion.div
          onClick={() => setIsFooterOpen(true)}
          drag="y"
          dragConstraints={{ top: -20, bottom: 0 }}
          dragElastic={0.05}
          dragSnapToOrigin={true}
          onDragEnd={(_, info) => {
            if (info.offset.y < -10) {
              setIsFooterOpen(true)
            }
          }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[220px] h-10 bg-white/70 backdrop-blur-xl border-t border-x border-white/30 rounded-t-[18px] flex flex-col items-center justify-center cursor-pointer group hover:bg-white/90 transition-all z-20 touch-none"
        >
          <div className="w-10 h-1 bg-zinc-900/10 rounded-full group-hover:bg-zinc-900/30 transition-colors mb-0.5" />
          <div className="text-[9px] font-black uppercase tracking-[2px] text-zinc-900/40 group-hover:text-zinc-900 transition-colors flex items-center gap-1.5">
            Desliza para más info
          </div>
          <div className="absolute top-[99%] left-0 w-full h-20 bg-white/70 backdrop-blur-xl" />
        </motion.div>
      </div>

      {/* Cinematic Spacer */}
      <div style={{ height: 'calc(10000px + 100vh)' }} className="w-px pointer-events-none" />

      {/* Portals/Components */}
      <FooterDrawer isOpen={isFooterOpen} onClose={() => setIsFooterOpen(false)} />
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartCount={cartCount}
        setCartCount={setCartCount}
      />
    </div>
  )
}
