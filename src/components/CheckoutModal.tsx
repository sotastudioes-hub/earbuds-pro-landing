import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  cartCount: number
  setCartCount: React.Dispatch<React.SetStateAction<number>>
}

export const CheckoutModal = ({ isOpen, onClose, cartCount, setCartCount }: CheckoutModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="relative w-full max-w-[480px] bg-white rounded-[32px] overflow-hidden shadow-2xl flex flex-col"
          >
            <div className="p-8 pb-4 flex justify-between items-center bg-white z-10">
              <h3 className="text-2xl font-black text-zinc-900 tracking-tight">Finalizar Pedido</h3>
              <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 transition-colors p-2">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 custom-scrollbar max-h-[70vh]">
              <div className="bg-zinc-50 rounded-2xl p-4 mb-8 flex items-center gap-4 border border-zinc-100">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center border border-zinc-200 overflow-hidden">
                  <img src="/frames_webp/frame_0241.webp" className="w-full h-full object-cover scale-[1.4]" alt="Earbuds Pro" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-bold text-zinc-900 leading-tight notranslate">Earbuds Pro - Edición Especial</div>
                  <div className="text-[11px] text-zinc-500 font-medium">Cantidad: {cartCount}</div>
                </div>
                <div className="text-[15px] font-black text-zinc-900">{(24.99 * cartCount).toFixed(2)}€</div>
              </div>

              <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); alert('¡Pedido procesado con éxito!'); onClose(); setCartCount(0); }}>
                {/* Section: Contact */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[2px] text-zinc-400">Información de Contacto</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Correo Electrónico</label>
                    <input type="email" placeholder="diseno@sota.studio" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                  </div>
                </div>

                {/* Section: Shipping */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[2px] text-zinc-400">Detalles de Envío</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Nombre Completo</label>
                    <input type="text" placeholder="Juan Pérez" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Dirección</label>
                    <input type="text" placeholder="Calle Falsa 123" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Ciudad</label>
                      <input type="text" placeholder="Madrid" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Código Postal</label>
                      <input type="text" placeholder="28001" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                    </div>
                  </div>
                </div>

                {/* Section: Payment */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-[2px] text-zinc-400">Método de Pago</h4>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Número de Tarjeta</label>
                    <div className="relative">
                      <input type="text" placeholder="•••• •••• •••• ••••" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-1 opacity-40">
                        <div className="w-6 h-4 bg-zinc-300 rounded-sm" />
                        <div className="w-6 h-4 bg-zinc-300 rounded-sm" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">Caducidad</label>
                      <input type="text" placeholder="MM/AA" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-zinc-400 ml-1">CVC</label>
                      <input type="text" placeholder="•••" className="w-full bg-zinc-50 border border-zinc-200 h-12 rounded-xl px-4 text-sm font-bold focus:outline-none focus:border-accent transition-colors" required />
                    </div>
                  </div>
                </div>

                {/* Section: Summary */}
                <div className="pt-6 border-t border-zinc-100 space-y-2">
                  <div className="flex justify-between text-[13px] font-medium text-zinc-500">
                    <span>Subtotal</span>
                    <span>{(24.99 * cartCount).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-medium text-zinc-500">
                    <span>Envío</span>
                    <span className="text-green-600 font-bold uppercase text-[10px] tracking-wider">Gratis</span>
                  </div>
                  <div className="flex justify-between text-[13px] font-medium text-zinc-500">
                    <span>Impuestos est.</span>
                    <span>{(24.99 * cartCount * 0.21).toFixed(2)}€</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-zinc-900 pt-2 border-t border-zinc-50 mt-2">
                    <span>Total</span>
                    <span>{(24.99 * cartCount * 1.21).toFixed(2)}€</span>
                  </div>
                </div>

                <button type="submit" className="w-full h-16 bg-accent text-white rounded-2xl font-black text-lg shadow-xl shadow-accent/20 hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-3">
                  Realizar Pedido
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                </button>
              </form>
            </div>

            <div className="bg-zinc-50 p-4 text-center border-t border-zinc-100 z-10">
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-[1px]">Transacción cifrada y segura</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
