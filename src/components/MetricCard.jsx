import { useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

const cardVariants = {
  hidden:  { opacity: 0, scale: 0.85, y: 16 },
  visible: { opacity: 1, scale: 1,    y: 0   },
};

export default function MetricCard({ label, value, sub, icon, accent = false, delay = 0 }) {
  const ref = useRef(null);
  const x   = useMotionValue(0);
  const y   = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [ 7, -7]), { stiffness: 200, damping: 28 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-7,  7]), { stiffness: 200, damping: 28 });

  const onMove = (e) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width  - 0.5);
    y.set((e.clientY - rect.top)  / rect.height - 0.5);
  };
  const onLeave = () => { x.set(0); y.set(0); };

  return (
    <div style={{ perspective: '1200px' }}>
      <motion.div
        ref={ref}
        className={accent ? 'glass-card-accent p-5 h-full' : 'glass-card p-5 h-full'}
        style={{ rotateX, rotateY, transformOrigin: 'center center' }}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay, type: 'spring', stiffness: 100, damping: 20 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
      >
        <div className="flex items-start justify-between mb-3">
          <span style={{ color: 'var(--text-muted)' }}>{icon}</span>
          {accent && (
            <span className="mono text-sm font-semibold tracking-widest uppercase px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}>
              Primary
            </span>
          )}
        </div>

        <p className="mono text-base font-medium tracking-widest uppercase mb-1"
          style={{ color: 'var(--text-muted)' }}>
          {label}
        </p>

        <p className="mono text-2xl font-bold leading-none"
          style={{ color: accent ? 'var(--text-primary)' : 'var(--text-primary)' }}>
          {value}
        </p>

        {sub && (
          <p className="mono text-base mt-2" style={{ color: 'var(--text-ghost)' }}>
            {sub}
          </p>
        )}
      </motion.div>
    </div>
  );
}
