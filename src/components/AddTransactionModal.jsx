import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CATEGORIES } from '../data/mockData';
import { CategoryIcon, IconX } from './Icons';

const OVERLAY = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
const PANEL   = {
  hidden:  { opacity: 0, scale: 0.92, y: 20 },
  visible: { opacity: 1, scale: 1,    y: 0   },
  exit:    { opacity: 0, scale: 0.94, y: 20  },
};

const genId = () => `t${Date.now()}_${Math.random().toString(36).slice(2,6)}`;

export default function AddTransactionModal({ isOpen, onClose, onAdd }) {
  const today = new Date().toISOString().slice(0,10);

  const [form, setForm] = useState({
    date: today, merchant: '', category: CATEGORIES[0], type: 'expense', amount: '',
  });
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const submit = (e) => {
    e.preventDefault();
    if (!form.merchant.trim()) return setError('Merchant name is required.');
    if (!form.amount || +form.amount <= 0) return setError('Enter a valid amount.');
    setError('');
    onAdd({ ...form, amount: +form.amount, id: genId() });
    setForm({ date: today, merchant: '', category: CATEGORIES[0], type: 'expense', amount: '' });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div key="backdrop" className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
            variants={OVERLAY} initial="hidden" animate="visible" exit="hidden"
            onClick={onClose}
          />

          <motion.div key="panel" className="fixed z-50 top-1/2 left-1/2"
            style={{ translateX: '-50%', translateY: '-50%', width: '100%', maxWidth: 440 }}
            variants={PANEL} initial="hidden" animate="visible" exit="exit"
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}>

            <div className="glass-card-accent m-4 p-6"
              style={{ border: '1px solid var(--border-accent)' }}>

              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="mono font-bold text-base tracking-widest uppercase">New Entry</h2>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--text-ghost)' }}>
                    Log a transaction to the vault
                  </p>
                </div>
                <button onClick={onClose}
                  className="p-1.5 rounded transition-colors"
                  style={{ color: 'var(--text-muted)', background: 'transparent' }}
                  onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.04)'}
                  onMouseLeave={e => e.target.style.background = 'transparent'}>
                  <IconX size={16} />
                </button>
              </div>

              <form onSubmit={submit} className="flex flex-col gap-4">
                <div>
                  <label className="mono text-sm uppercase tracking-widest block mb-1.5"
                    style={{ color: 'var(--text-ghost)' }}>Date</label>
                  <input type="date" className="vault-input" value={form.date}
                    onChange={e => set('date', e.target.value)} style={{ colorScheme: 'dark' }} />
                </div>

                <div>
                  <label className="mono text-sm uppercase tracking-widest block mb-1.5"
                    style={{ color: 'var(--text-ghost)' }}>Merchant / Description</label>
                  <input id="merchant-input" type="text" className="vault-input" value={form.merchant}
                    placeholder="e.g. Netflix, Zerodha..."
                    onChange={e => set('merchant', e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mono text-sm uppercase tracking-widest block mb-1.5"
                      style={{ color: 'var(--text-ghost)' }}>Category</label>
                    <select className="vault-select w-full" value={form.category}
                      onChange={e => set('category', e.target.value)}>
                      {CATEGORIES.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mono text-sm uppercase tracking-widest block mb-1.5"
                      style={{ color: 'var(--text-ghost)' }}>Type</label>
                    <div className="flex gap-2 h-[36px]">
                      {['expense','income'].map(t => (
                        <button key={t} type="button" onClick={() => set('type', t)}
                          className="flex-1 mono text-sm uppercase tracking-wider rounded font-semibold transition-all duration-150"
                          style={{
                            border: `1px solid ${form.type === t ? (t === 'income' ? 'var(--income)' : 'var(--expense)') : 'var(--border)'}`,
                            background: form.type === t ? (t === 'income' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)') : 'transparent',
                            color: form.type === t ? (t === 'income' ? 'var(--income)' : 'var(--expense)') : 'var(--text-muted)',
                          }}>
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mono text-sm uppercase tracking-widest block mb-1.5"
                    style={{ color: 'var(--text-ghost)' }}>Amount</label>
                  <input id="amount-input" type="number" min="1" className="vault-input" value={form.amount}
                    placeholder="0.00" onChange={e => set('amount', e.target.value)} />
                </div>

                {error && (
                  <p className="mono text-base" style={{ color: 'var(--expense)' }}>! {error}</p>
                )}

                <div className="flex gap-3 mt-1">
                  <button type="submit" id="submit-transaction-btn" className="vault-btn flex-1 !py-2.5">
                    Log to Vault
                  </button>
                  <button type="button" className="vault-btn-ghost !py-2.5 !px-4" onClick={onClose}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
