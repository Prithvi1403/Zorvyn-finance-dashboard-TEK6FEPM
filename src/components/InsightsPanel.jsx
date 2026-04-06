import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { CategoryIcon, IconTrendUp, IconArrowUp, IconArrowDown } from './Icons';

const DONUT_COLORS = ['#fafafa','#a1a1aa','#71717a','#52525b','#3f3f46','#d4d4d8','#e4e4e7','#27272a'];

function DonutSlice({ cx, cy, r, startAngle, endAngle, color, label, value, total, isHovered, onHover, onLeave }) {
  const toRad = (deg) => (deg - 90) * Math.PI / 180;
  const x1 = cx + r * Math.cos(toRad(startAngle));
  const y1 = cy + r * Math.sin(toRad(startAngle));
  const x2 = cx + r * Math.cos(toRad(endAngle));
  const y2 = cy + r * Math.sin(toRad(endAngle));
  const large = endAngle - startAngle > 180 ? 1 : 0;

  const ir  = r * 0.6;
  const ix1 = cx + ir * Math.cos(toRad(startAngle));
  const iy1 = cy + ir * Math.sin(toRad(startAngle));
  const ix2 = cx + ir * Math.cos(toRad(endAngle));
  const iy2 = cy + ir * Math.sin(toRad(endAngle));

  const d = `M ${ix1} ${iy1} A ${ir} ${ir} 0 ${large} 1 ${ix2} ${iy2} L ${x2} ${y2} A ${r} ${r} 0 ${large} 0 ${x1} ${y1} Z`;

  return (
    <motion.path
      d={d} fill={color}
      opacity={isHovered ? 1 : 0.7}
      style={{ cursor: 'pointer', transformOrigin: `${cx}px ${cy}px` }}
      animate={{ scale: isHovered ? 1.04 : 1 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => onHover({ label, value, pct: ((value/total)*100).toFixed(0), color })}
      onMouseLeave={onLeave}
    />
  );
}

function CustomDonut({ data, total }) {
  const [hovered, setHovered] = useState(null);
  const cx = 100, cy = 100, r = 80;
  let cumAngle = 0;

  return (
    <div className="relative" style={{ width: 200, height: 200 }}>
      <svg width={200} height={200}>
        {data.map((d, i) => {
          if (!d.value) return null;
          const sweep = (d.value / total) * 360;
          const start = cumAngle;
          cumAngle += sweep;
          return (
            <DonutSlice key={d.name}
              cx={cx} cy={cy} r={r}
              startAngle={start} endAngle={cumAngle}
              color={DONUT_COLORS[i % DONUT_COLORS.length]}
              label={d.name} value={d.value} total={total}
              isHovered={hovered?.label === d.name}
              onHover={setHovered}
              onLeave={() => setHovered(null)}
            />
          );
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        {hovered ? (
          <AnimatePresence mode="wait">
            <motion.div key={hovered.label}
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.85 }}
              className="text-center px-2">
              <p className="mono text-sm font-bold" style={{ color: hovered.color }}>{hovered.pct}%</p>
              <p className="mono text-sm leading-tight mt-0.5" style={{ color: 'var(--text-muted)' }}>
                {hovered.label}
              </p>
            </motion.div>
          </AnimatePresence>
        ) : (
          <div className="text-center">
            <p className="mono text-sm font-bold" style={{ color: 'var(--text-secondary)' }}>SPEND</p>
            <p className="mono text-sm" style={{ color: 'var(--text-ghost)' }}>breakdown</p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Budget Progress Ring ── */
function BudgetRing({ category, budget, spent, pct }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (Math.min(pct, 100) / 100) * circ;
  const over = pct > 100;
  const color = over ? 'var(--expense)' : pct > 75 ? 'var(--warning)' : 'var(--text-secondary)';

  return (
    <div className="flex items-center gap-3">
      <div className="relative" style={{ width: 60, height: 60 }}>
        <svg width={60} height={60}>
          <circle className="budget-ring-track" cx={30} cy={30} r={r} strokeWidth={4} />
          <motion.circle
            className="budget-ring-fill"
            cx={30} cy={30} r={r} strokeWidth={4}
            stroke={color}
            strokeDasharray={circ}
            initial={{ strokeDashoffset: circ }}
            animate={{ strokeDashoffset: offset }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
            transform={`rotate(-90 30 30)`}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="mono text-sm font-bold" style={{ color }}>{Math.round(pct)}%</span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <CategoryIcon category={category} size={12} style={{ color: 'var(--text-muted)' }} />
          <span className="mono text-base truncate" style={{ color: 'var(--text-secondary)' }}>{category}</span>
        </div>
        <p className="mono text-sm" style={{ color: 'var(--text-ghost)' }}>
          {spent.toLocaleString()} / {budget.toLocaleString()}
        </p>
      </div>
    </div>
  );
}

export default function InsightsPanel({ summary, fullView = false }) {
  const {
    income, expenses, highestCat, donutData, monthlyDelta,
    budgetData, tip, dailyAvgThis, dailyAvgLast, projectedTotal,
  } = summary;
  const total = donutData.reduce((s, d) => s + d.value, 0);
  const deltaIsPositive = monthlyDelta > 0;

  return (
    <div className="flex flex-col gap-5">

      {/* Donut Chart */}
      <motion.div className="glass-card p-5"
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2, duration: 0.45 }}>
        <h3 className="mono text-sm font-semibold tracking-widest uppercase mb-4"
          style={{ color: 'var(--text-muted)' }}>
          Spending Breakdown
        </h3>

        {donutData.length === 0 ? (
          <div className="flex items-center justify-center h-28 mono text-sm" style={{ color: 'var(--text-ghost)' }}>
            No expenses yet.
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <CustomDonut data={donutData} total={total} />
            </div>
            <div className="flex flex-col gap-1.5">
              {donutData.slice(0, 6).map((d, i) => (
                <div key={d.name} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: DONUT_COLORS[i % DONUT_COLORS.length] }} />
                    <CategoryIcon category={d.name} size={11} style={{ color: 'var(--text-ghost)' }} />
                    <span className="mono text-sm truncate" style={{ color: 'var(--text-muted)' }}>
                      {d.name}
                    </span>
                  </div>
                  <span className="mono text-sm font-semibold flex-shrink-0"
                    style={{ color: 'var(--text-secondary)' }}>
                    {((d.value/total)*100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Budget Progress Rings */}
      {budgetData && budgetData.length > 0 && (
        <motion.div className="glass-card p-5"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.45 }}>
          <h3 className="mono text-sm font-semibold tracking-widest uppercase mb-4"
            style={{ color: 'var(--text-muted)' }}>
            Budget Utilization
          </h3>
          <div className="grid gap-3" style={{ gridTemplateColumns: fullView ? 'repeat(2, 1fr)' : '1fr' }}>
            {budgetData.slice(0, fullView ? 8 : 4).map(b => (
              <BudgetRing key={b.category} {...b} />
            ))}
          </div>
        </motion.div>
      )}

      {/* Quick Stats */}
      <motion.div className="glass-card p-5"
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.35, duration: 0.45 }}>
        <h3 className="mono text-sm font-semibold tracking-widest uppercase mb-4"
          style={{ color: 'var(--text-muted)' }}>
          Intelligence
        </h3>

        <div className="flex flex-col gap-3.5">
          {/* Savings Rate */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <span className="mono text-sm uppercase tracking-wider" style={{ color: 'var(--text-ghost)' }}>Savings Rate</span>
              <span className="mono text-sm font-bold" style={{ color: 'var(--text-primary)' }}>
                {income > 0 ? (((income - expenses) / income) * 100).toFixed(0) : 0}%
              </span>
            </div>
            <div className="h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <motion.div className="h-full rounded-full"
                style={{ background: 'var(--text-secondary)' }}
                initial={{ width: 0 }}
                animate={{ width: income > 0 ? `${Math.max(0, ((income - expenses) / income) * 100)}%` : '0%' }}
                transition={{ delay: 0.6, duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>

          {/* Top Expense */}
          <div className="flex justify-between items-start gap-2">
            <span className="mono text-sm uppercase tracking-wider" style={{ color: 'var(--text-ghost)' }}>Top Expense</span>
            <div className="text-right">
              <p className="mono text-sm font-bold">{highestCat[0]}</p>
              <p className="mono text-sm" style={{ color: 'var(--text-ghost)' }}>
                {highestCat[1]?.toLocaleString()}
              </p>
            </div>
          </div>

          {/* MoM Delta */}
          <div className="flex justify-between items-center gap-2">
            <span className="mono text-sm uppercase tracking-wider" style={{ color: 'var(--text-ghost)' }}>MoM Expenses</span>
            <span className="mono text-sm font-bold flex items-center gap-1"
              style={{ color: deltaIsPositive ? 'var(--expense)' : 'var(--income)' }}>
              {deltaIsPositive ? <IconArrowUp size={12} /> : <IconArrowDown size={12} />}
              {Math.abs(monthlyDelta)}%
            </span>
          </div>

          {/* Spending Velocity */}
          <div className="flex justify-between items-start gap-2">
            <span className="mono text-sm uppercase tracking-wider" style={{ color: 'var(--text-ghost)' }}>Daily Avg</span>
            <div className="text-right">
              <p className="mono text-sm font-bold">{Math.round(dailyAvgThis || 0).toLocaleString()}/day</p>
              <p className="mono text-sm" style={{ color: 'var(--text-ghost)' }}>
                Projected: {Math.round(projectedTotal || 0).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Vault Insight Tip */}
      <motion.div className="glass-card-accent pulse-glow p-5"
        initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.45, duration: 0.45 }}>
        <div className="flex items-center gap-2 mb-3">
          <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--text-primary)' }} />
          <h3 className="mono text-sm font-semibold tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
            Vault Insight
          </h3>
        </div>
        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
          {tip || 'Analyzing your financial data...'}
        </p>
      </motion.div>
    </div>
  );
}
