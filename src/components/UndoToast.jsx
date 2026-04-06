import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IconRefresh } from './Icons';

export default function UndoToast({ undoStack, onUndo, onClear }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (undoStack.length > 0) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        setTimeout(() => onClear(), 300);
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setVisible(false);
    }
  }, [undoStack.length]);

  const handleUndo = () => {
    onUndo();
    if (undoStack.length <= 1) setVisible(false);
  };

  const lastDeleted = undoStack[0]?.transaction;

  return (
    <AnimatePresence>
      {visible && lastDeleted && (
        <motion.div
          className="undo-toast"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <span className="mono text-sm" style={{ color: 'var(--text-secondary)' }}>
            Deleted "{lastDeleted.merchant}"
          </span>

          <button onClick={handleUndo}
            className="mono text-base font-bold uppercase tracking-wider px-3 py-1 rounded transition-all"
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid var(--border-hover)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
            }}
            onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.12)'}
            onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.08)'}
          >
            <span className="flex items-center gap-1.5">
              <IconRefresh size={12} />
              Undo
            </span>
          </button>

          {/* Progress bar */}
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] rounded-b-lg"
            style={{ background: 'var(--text-muted)' }}
            initial={{ width: '100%' }}
            animate={{ width: '0%' }}
            transition={{ duration: 5, ease: 'linear' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
