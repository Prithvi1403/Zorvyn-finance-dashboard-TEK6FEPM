import { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useFinance } from '../hooks/useFinance';
import { useCountUp } from '../hooks/useCountUp';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { exportJSON, exportCSV } from '../utils/exportUtils';
import { MONTHLY_CHART_DATA } from '../data/mockData';

import Sidebar from '../components/Sidebar';
import VaultCoin from '../components/VaultCoin';
import MetricCard from '../components/MetricCard';
import TransactionTable from '../components/TransactionTable';
import InsightsPanel from '../components/InsightsPanel';
import AddTransactionModal from '../components/AddTransactionModal';
import AreaChartComponent from '../components/AreaChartComponent';
import UndoToast from '../components/UndoToast';
import {
  IconCurrency, IconArrowUp, IconArrowDown, IconTrendUp,
  IconDownload, IconEye, IconShield, IconRefresh, IconX,
} from '../components/Icons';

const fmt = (n) => `${Math.abs(n).toLocaleString('en-IN')}`;

export default function Dashboard() {
  const {
    summary, role, transactions, filteredTransactions, undoStack,
    search, setSearch, sortBy, setSortBy, filterType, setFilterType,
    addTransaction, deleteTransaction, undoDelete, clearUndo,
    setRole, initializeMock, resetVault,
  } = useFinance();

  const [activeView,  setActiveView]  = useState('overview');
  const [modalOpen,   setModalOpen]   = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const [exporting,   setExporting]   = useState(null);

  const searchRef = useRef(null);

  /* Animated counters */
  const animBalance  = useCountUp(summary.balance,  1800);
  const animIncome   = useCountUp(summary.income,   1600);
  const animExpenses = useCountUp(summary.expenses, 1600);

  /* Keyboard shortcuts */
  useKeyboardShortcuts({
    onNew:    useCallback(() => { if (role !== 'viewer') setModalOpen(true); }, [role]),
    onSearch: useCallback(() => { searchRef.current?.focus(); }, []),
    onEscape: useCallback(() => setModalOpen(false), []),
  });

  /* Export handler */
  const handleExport = (type) => {
    setExporting(type);
    setTimeout(() => {
      if (type === 'json') exportJSON(transactions);
      else                 exportCSV(transactions);
      setExporting(null);
    }, 1000);
  };

  const isSyncing = exporting !== null;

  /* ── View renderers ── */
  const renderOverview = () => (
    <div className="grid grid-cols-12 gap-5 items-start">
      {/* Left 8 cols */}
      <div className="col-span-12 lg:col-span-8 flex flex-col gap-5">
        {/* Balance Hero */}
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, scale: 0.9, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.08, type: 'spring', stiffness: 100, damping: 18 }}
          style={{ border: '1px solid var(--border-hover)', position: 'relative', overflow: 'hidden' }}>
          {/* BG orb */}
          <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.03) 0%, transparent 70%)' }} />

          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-5">
              <VaultCoin />
              <div>
                <p className="mono text-sm uppercase tracking-[0.2em] mb-1"
                  style={{ color: 'var(--text-muted)' }}>
                  Total Balance
                </p>
                <p className="mono font-black leading-none"
                  style={{
                    fontSize: 'clamp(1.8rem, 4vw, 2.8rem)',
                    color: summary.balance >= 0 ? 'var(--text-primary)' : 'var(--expense)',
                  }}>
                  {summary.balance < 0 ? '-' : ''}{fmt(animBalance)}
                </p>
                <p className="mono text-base mt-2" style={{ color: 'var(--text-ghost)' }}>
                  {transactions.length} entries
                </p>
              </div>
            </div>

            {/* Net flow */}
            <div className="hidden sm:flex flex-col items-end gap-1.5">
              <span className="mono text-base uppercase tracking-widest" style={{ color: 'var(--text-ghost)' }}>
                Net Flow
              </span>
              <div className="flex items-center gap-2">
                <div className="w-0.5 h-7 rounded-full" style={{
                  background: `linear-gradient(to top, ${summary.balance >= 0 ? 'var(--income)' : 'var(--expense)'}, transparent)`,
                }} />
                {summary.balance >= 0 ? <IconArrowUp size={20} style={{ color: 'var(--income)' }} /> : <IconArrowDown size={20} style={{ color: 'var(--expense)' }} />}
              </div>
              <span className="mono text-sm font-semibold"
                style={{ color: summary.balance >= 0 ? 'var(--income)' : 'var(--expense)' }}>
                {summary.income > 0 ? ((Math.abs(summary.balance) / summary.income) * 100).toFixed(0) : 0}%
              </span>
            </div>
          </div>
        </motion.div>

        {/* Metric Cards */}
        <div className="grid grid-cols-2 gap-4">
          <MetricCard
            label="Total Income"
            value={animIncome.toLocaleString('en-IN')}
            sub={`${transactions.filter(t => t.type === 'income').length} income entries`}
            icon={<IconTrendUp size={20} />}
            delay={0.16}
          />
          <MetricCard
            label="Total Expenses"
            value={animExpenses.toLocaleString('en-IN')}
            sub={`${transactions.filter(t => t.type === 'expense').length} expense entries`}
            icon={<IconArrowDown size={20} />}
            accent
            delay={0.22}
          />
        </div>

        {/* Monthly Chart */}
        <motion.div className="glass-card p-5"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.28, duration: 0.45 }}>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="mono text-base uppercase tracking-widest font-semibold"
                style={{ color: 'var(--text-muted)' }}>
                Monthly Flow - 6mo
              </h2>
              <p className="mono text-base mt-0.5" style={{ color: 'var(--text-ghost)' }}>
                Step chart / income vs expenses
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 mono text-sm" style={{ color: 'var(--text-secondary)' }}>
                <span className="w-3 h-px block rounded" style={{ background: '#d4d4d8' }} />
                Income
              </span>
              <span className="flex items-center gap-1.5 mono text-sm" style={{ color: 'var(--expense)' }}>
                <span className="w-3 h-px block rounded" style={{ background: 'var(--expense)' }} />
                Expenses
              </span>
            </div>
          </div>
          <AreaChartComponent data={MONTHLY_CHART_DATA} />
        </motion.div>
      </div>

      {/* Right 4 cols — Insights */}
      <div className="col-span-12 lg:col-span-4">
        <InsightsPanel summary={summary} />
      </div>
    </div>
  );

  const renderTransactions = () => (
    <TransactionTable
      transactions={transactions}
      filteredTransactions={filteredTransactions}
      search={search}         setSearch={setSearch}
      sortBy={sortBy}         setSortBy={setSortBy}
      filterType={filterType} setFilterType={setFilterType}
      deleteTransaction={deleteTransaction}
      role={role}
      onAdd={() => setModalOpen(true)}
      initializeMock={initializeMock}
      anomalies={summary.anomalies}
      searchRef={searchRef}
    />
  );

  const renderAnalytics = () => (
    <div className="grid grid-cols-12 gap-5 items-start">
      <div className="col-span-12 lg:col-span-6">
        <motion.div className="glass-card p-5"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.45 }}>
          <h2 className="mono text-base uppercase tracking-widest font-semibold mb-5"
            style={{ color: 'var(--text-muted)' }}>
            Monthly Flow - 6mo
          </h2>
          <AreaChartComponent data={MONTHLY_CHART_DATA} />
        </motion.div>
      </div>
      <div className="col-span-12 lg:col-span-6">
        <InsightsPanel summary={summary} fullView={true} />
      </div>
    </div>
  );

  const renderIntelligence = () => (
    <div className="grid grid-cols-12 gap-5 items-start">
      <div className="col-span-12 lg:col-span-8">
        <motion.div className="glass-card p-6"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}>
          <h2 className="mono text-sm font-bold tracking-widest uppercase mb-5">
            Financial Intelligence
          </h2>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="glass-card p-4">
              <p className="mono text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--text-ghost)' }}>
                Daily Burn Rate
              </p>
              <p className="mono text-xl font-bold">
                {Math.round(summary.dailyAvgThis || 0).toLocaleString()}<span className="text-sm font-normal" style={{ color: 'var(--text-muted)' }}>/day</span>
              </p>
              <p className="mono text-sm mt-1" style={{ color: 'var(--text-ghost)' }}>
                Last month: {Math.round(summary.dailyAvgLast || 0).toLocaleString()}/day
              </p>
            </div>

            <div className="glass-card p-4">
              <p className="mono text-sm uppercase tracking-widest mb-2" style={{ color: 'var(--text-ghost)' }}>
                Projected Monthly
              </p>
              <p className="mono text-xl font-bold">
                {Math.round(summary.projectedTotal || 0).toLocaleString()}
              </p>
              <p className="mono text-sm mt-1" style={{ color: 'var(--text-ghost)' }}>
                Based on current velocity
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="glass-card p-4">
              <p className="mono text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--text-ghost)' }}>Savings Rate</p>
              <p className="mono text-lg font-bold">
                {summary.income > 0 ? (((summary.income - summary.expenses) / summary.income) * 100).toFixed(0) : 0}%
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="mono text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--text-ghost)' }}>Anomalies</p>
              <p className="mono text-lg font-bold" style={{ color: summary.anomalies?.size > 0 ? 'var(--warning)' : 'var(--income)' }}>
                {summary.anomalies?.size || 0}
              </p>
            </div>
            <div className="glass-card p-4">
              <p className="mono text-sm uppercase tracking-widest mb-1" style={{ color: 'var(--text-ghost)' }}>MoM Change</p>
              <p className="mono text-lg font-bold"
                style={{ color: summary.monthlyDelta > 0 ? 'var(--expense)' : 'var(--income)' }}>
                {summary.monthlyDelta > 0 ? '+' : ''}{summary.monthlyDelta}%
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <div className="col-span-12 lg:col-span-4">
        <motion.div className="glass-card-accent pulse-glow p-5"
          initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.45 }}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--text-primary)' }} />
            <h3 className="mono text-sm font-semibold tracking-widest uppercase">Vault Insight</h3>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            {summary.tip || 'Analyzing your financial data...'}
          </p>
        </motion.div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <motion.div className="glass-card p-6 max-w-lg"
      initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, duration: 0.4 }}>
      <h2 className="mono text-sm font-bold tracking-widest uppercase mb-6">Settings</h2>

      {/* Role Toggle */}
      <div className="mb-6">
        <p className="mono text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--text-ghost)' }}>
          Access Role
        </p>
        <div className="flex rounded overflow-hidden"
          style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
          {[
            { key: 'admin',  label: 'Admin',  Icon: IconShield, activeColor: 'rgba(255,255,255,0.1)', textColor: 'var(--text-primary)' },
            { key: 'viewer', label: 'Viewer', Icon: IconEye,    activeColor: 'rgba(239,68,68,0.1)', textColor: 'var(--expense)' },
          ].map(({ key, label, Icon, activeColor, textColor }) => (
            <button key={key} id={`role-${key}-btn`}
              onClick={() => setRole(key)}
              className="flex-1 mono text-sm uppercase tracking-widest px-4 py-3 font-bold transition-all duration-200 flex items-center justify-center gap-2"
              style={{
                background: role === key ? activeColor : 'transparent',
                color: role === key ? textColor : 'var(--text-ghost)',
              }}>
              <Icon size={14} />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Export */}
      <div className="mb-6">
        <p className="mono text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--text-ghost)' }}>
          Export Data
        </p>
        <div className="flex gap-3">
          <button id="export-json-btn" className="vault-btn-ghost flex-1"
            onClick={() => handleExport('json')} disabled={isSyncing}>
            <IconDownload size={13} />
            {exporting === 'json' ? 'Syncing...' : 'JSON'}
          </button>
          <button id="export-csv-btn" className="vault-btn-ghost flex-1"
            onClick={() => handleExport('csv')} disabled={isSyncing}>
            <IconDownload size={13} />
            {exporting === 'csv' ? 'Syncing...' : 'CSV'}
          </button>
        </div>
      </div>

      {/* Reset */}
      <div>
        <p className="mono text-sm uppercase tracking-widest mb-3" style={{ color: 'var(--text-ghost)' }}>
          Vault Data
        </p>
        <div className="flex gap-3">
          <button className="vault-btn-ghost flex-1" onClick={initializeMock}>
            <IconRefresh size={13} />
            Reload Mock
          </button>
          <button className="vault-btn-ghost flex-1" onClick={resetVault}
            style={{ borderColor: 'rgba(239,68,68,0.2)', color: 'var(--expense)' }}>
            <IconX size={13} />
            Reset Vault
          </button>
        </div>
      </div>
    </motion.div>
  );

  const VIEW_MAP = {
    overview:     renderOverview,
    transactions: renderTransactions,
    analytics:    renderAnalytics,
    intelligence: renderIntelligence,
    settings:     renderSettings,
  };

  const VIEW_TITLES = {
    overview:     'Overview',
    transactions: 'Transactions',
    analytics:    'Analytics',
    intelligence: 'Intelligence',
    settings:     'Settings',
  };

  return (
    <>
      {/* Sidebar */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      {/* Main content */}
      <div className="main-content">
        <div className="px-5 py-6 md:px-8 md:py-8 max-w-[1400px]">

          {/* Modal */}
          <AddTransactionModal
            isOpen={modalOpen}
            onClose={() => setModalOpen(false)}
            onAdd={addTransaction}
          />

          {/* Undo Toast */}
          <UndoToast undoStack={undoStack} onUndo={undoDelete} onClear={clearUndo} />

          {/* Viewer Tag */}
          {role === 'viewer' && (
            <div className="viewer-tag">
              <span className="flex items-center gap-1.5">
                <IconEye size={12} /> VIEWER / READ-ONLY
              </span>
            </div>
          )}

          {/* Top bar */}
          <motion.header
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-between gap-4 mb-7"
          >
            <div>
              <h1 className="mono font-bold text-lg tracking-widest uppercase">
                {VIEW_TITLES[activeView]}
              </h1>
              <p className="mono text-sm tracking-wider mt-0.5" style={{ color: 'var(--text-ghost)' }}>
                {role === 'admin' ? 'Full access' : 'Read-only mode'} / {transactions.length} records
              </p>
            </div>

            {/* Quick actions (only on overview) */}
            {activeView === 'overview' && (
              <div className="flex items-center gap-2">
                <div className="flex rounded overflow-hidden"
                  style={{ border: '1px solid var(--border)', background: 'rgba(255,255,255,0.01)' }}>
                  {[
                    { key: 'admin',  label: 'Admin',  activeColor: 'rgba(255,255,255,0.08)', textColor: 'var(--text-primary)' },
                    { key: 'viewer', label: 'Viewer', activeColor: 'rgba(239,68,68,0.08)', textColor: 'var(--expense)' },
                  ].map(({ key, label, activeColor, textColor }) => (
                    <button key={key}
                      onClick={() => setRole(key)}
                      className="mono text-base uppercase tracking-widest px-3 py-2 font-bold transition-all duration-200"
                      style={{
                        background: role === key ? activeColor : 'transparent',
                        color: role === key ? textColor : 'var(--text-ghost)',
                      }}>
                      {label}
                    </button>
                  ))}
                </div>

                <button className="vault-btn-ghost" onClick={() => handleExport('json')} disabled={isSyncing}>
                  <IconDownload size={12} />
                  {exporting === 'json' ? 'Syncing...' : 'JSON'}
                </button>
                <button className="vault-btn-ghost" onClick={() => handleExport('csv')} disabled={isSyncing}>
                  <IconDownload size={12} />
                  {exporting === 'csv' ? 'Syncing...' : 'CSV'}
                </button>
              </div>
            )}
          </motion.header>

          {/* Active view content */}
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35 }}
          >
            {VIEW_MAP[activeView]?.()}
          </motion.div>
        </div>
      </div>
    </>
  );
}
