import React, { useState, memo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { footerData } from '../data/footer'

// Icons Component for the footer
const SocialIcon = ({ type }: { type: string }) => {
  if (type === 'tiktok') return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .57.04.83.11V9.42a6.33 6.33 0 0 0-3.14-.82 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.47a9.38 9.38 0 0 0 5.68 1.96V6.99a4.85 4.85 0 0 1-1.6-.3z" /></svg>
  if (type === 'twitter') return <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.489h2.039L6.486 3.24H4.298l13.311 17.402z" /></svg>
  if (type === 'instagram') return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  return null
}

const FAQItem = memo(({ item, isOpen, onToggle }: { item: { q: string, a: string }, isOpen: boolean, onToggle: () => void }) => {
  return (
    <div className="border-b border-white/5 last:border-0 pointer-events-auto">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-4 text-left group transition-all"
      >
        <span className={`text-sm font-bold transition-colors ${isOpen ? 'text-blue-500' : 'text-white/70 group-hover:text-white'}`}>{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          className="text-white/20 text-xs"
        >
          ↓
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
            className="overflow-hidden"
          >
            <p className="text-xs text-white/40 leading-relaxed pb-4 pr-10">
              {item.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
})

export const FooterDrawer = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [openFAQ, setOpenFAQ] = useState<string | null>(null)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-black/80 backdrop-blur-md pointer-events-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300, mass: 0.8 }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.2}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose()
              }
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full bg-zinc-950 border-t border-white/10 p-10 md:p-20 rounded-t-[40px] shadow-2xl overflow-y-auto max-h-[92vh]"
          >
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-1 bg-white/20 rounded-full" />

            <div className="max-w-[1200px] mx-auto pt-4">
              <div className="mb-0">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                  FAQ
                </h2>
                <div className="divide-y divide-white/5 border-y border-white/5">
                  {footerData.faq.map((item) => (
                    <FAQItem
                      key={item.q}
                      item={item}
                      isOpen={openFAQ === item.q}
                      onToggle={() => setOpenFAQ(openFAQ === item.q ? null : item.q)}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-4 mb-6">
                {footerData.sections.map((section) => (
                  <div key={section.title} className="flex flex-col items-center gap-6">
                    <h3 className="uppercase text-white/30 text-[8px] font-black tracking-[4px]">{section.title}</h3>

                    <div className="grid grid-cols-3 gap-x-8 gap-y-4 w-full max-w-[400px]">
                      {section.links.map((link, idx) => (
                        <a
                          key={link}
                          href="#"
                          className={`text-white/40 hover:text-white transition-colors text-[9px] font-bold uppercase tracking-wider ${idx % 3 === 0 ? 'text-right' : idx % 3 === 1 ? 'text-center' : 'text-left'
                            }`}
                        >
                          {link}
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col items-center text-center gap-6 border-t border-white/5 pt-6">
                <div className="flex gap-6">
                  {footerData.social.map((s) => (
                    <a key={s.label} href={s.href} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white/40 hover:bg-blue-500 hover:text-white transition-all">
                      <SocialIcon type={s.icon} />
                    </a>
                  ))}
                </div>

                <div className="flex flex-col items-center">
                  <h1 className="text-[12vw] md:text-[6vw] font-black bg-gradient-to-r from-white to-white/20 bg-clip-text text-transparent leading-none">
                    {footerData.title}
                  </h1>
                  <p className="text-white/20 text-[9px] font-black uppercase tracking-[2px] mt-2">
                    {footerData.copyright}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
