import { motion } from 'framer-motion';
import {
  IconDashboard, IconList, IconPieChart, IconSettings, IconBrain, IconMenu, IconX,
} from './Icons';

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview',      Icon: IconDashboard },
  { id: 'transactions', label: 'Transactions',  Icon: IconList },
  { id: 'analytics',    label: 'Analytics',     Icon: IconPieChart },
  { id: 'intelligence', label: 'Intelligence',  Icon: IconBrain },
  { id: 'settings',     label: 'Settings',      Icon: IconSettings },
];

export default function Sidebar({ activeView, setActiveView, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 lg:hidden"
          style={{ background: 'rgba(0,0,0,0.6)' }}
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
        {/* Brand */}
        <div className="sidebar-brand">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 flex items-center justify-center rounded mono font-black text-sm select-none"
                style={{
                  background: 'linear-gradient(135deg, #e4e4e7, #a1a1aa)',
                  color: '#09090b',
                  boxShadow: '0 0 16px rgba(255,255,255,0.1)',
                }}>
                V
              </div>
              <div>
                <h1 className="mono font-extrabold text-sm tracking-[0.18em]" style={{ color: '#fafafa', lineHeight: 1 }}>
                  VAULT
                </h1>
                <p className="mono text-base tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                  Finance System
                </p>
              </div>
            </div>

            {/* Mobile close */}
            <button
              className="lg:hidden p-1 rounded"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setMobileOpen(false)}
            >
              <IconX size={18} />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="sidebar-nav">
          <div className="px-3 mb-2">
            <p className="mono text-sm tracking-widest uppercase px-2 mb-1" style={{ color: 'var(--text-ghost)' }}>
              Menu
            </p>
          </div>

          {NAV_ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`sidebar-item ${activeView === id ? 'active' : ''}`}
              onClick={() => {
                setActiveView(id);
                setMobileOpen(false);
              }}
            >
              <Icon size={16} />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        {/* Footer — keyboard shortcuts hint */}
        <div className="sidebar-footer">
          <div className="flex flex-col gap-1.5">
            <p className="mono text-sm tracking-widest uppercase" style={{ color: 'var(--text-ghost)' }}>
              Shortcuts
            </p>
            <div className="flex items-center gap-2">
              <kbd className="mono text-sm px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                N
              </kbd>
              <span className="mono text-sm" style={{ color: 'var(--text-muted)' }}>New entry</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="mono text-sm px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                /
              </kbd>
              <span className="mono text-sm" style={{ color: 'var(--text-muted)' }}>Search</span>
            </div>
            <div className="flex items-center gap-2">
              <kbd className="mono text-sm px-1.5 py-0.5 rounded"
                style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--border)', color: 'var(--text-muted)' }}>
                Esc
              </kbd>
              <span className="mono text-sm" style={{ color: 'var(--text-muted)' }}>Close</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile toggle (shown in top bar) */}
      <button
        className="mobile-toggle fixed top-4 left-4 z-50 p-2 rounded-lg"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}
        onClick={() => setMobileOpen(true)}
      >
        <IconMenu size={20} style={{ color: 'var(--text-secondary)' }} />
      </button>
    </>
  );
}
