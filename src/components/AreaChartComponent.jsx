import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="vault-chart-tooltip">
      <p className="mono text-sm font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="mono text-base" style={{ color: p.color }}>
          {p.name === 'income' ? '+' : '-'} {p.name.charAt(0).toUpperCase() + p.name.slice(1)}: {p.value.toLocaleString('en-IN')}
        </p>
      ))}
    </div>
  );
};

export default function AreaChartComponent({ data }) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#a1a1aa" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#a1a1aa" stopOpacity={0.01} />
          </linearGradient>
          <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%"  stopColor="#ef4444" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#ef4444" stopOpacity={0.01} />
          </linearGradient>
        </defs>

        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.035)" vertical={false} />

        <XAxis dataKey="month"
          tick={{ fill: '#52525b', fontFamily: 'IBM Plex Mono', fontSize: 10 }}
          axisLine={false} tickLine={false} />
        <YAxis
          tick={{ fill: '#3f3f46', fontFamily: 'IBM Plex Mono', fontSize: 9 }}
          axisLine={false} tickLine={false}
          tickFormatter={v => `${(v/1000).toFixed(0)}k`}
          width={38} />

        <Tooltip content={<CustomTooltip />}
          cursor={{ stroke: 'rgba(255,255,255,0.06)', strokeWidth: 1 }} />

        <Area type="stepAfter" dataKey="income" stroke="#d4d4d8" strokeWidth={1.5}
          fill="url(#incomeGrad)" dot={false}
          activeDot={{ r: 4, fill: '#fafafa', strokeWidth: 0 }}
          isAnimationActive={true} animationDuration={1200} animationEasing="ease-out" />

        <Area type="stepAfter" dataKey="expenses" stroke="#ef4444" strokeWidth={1.5}
          fill="url(#expenseGrad)" dot={false}
          activeDot={{ r: 4, fill: '#ef4444', strokeWidth: 0 }}
          isAnimationActive={true} animationDuration={1400} animationEasing="ease-out" />
      </AreaChart>
    </ResponsiveContainer>
  );
}
