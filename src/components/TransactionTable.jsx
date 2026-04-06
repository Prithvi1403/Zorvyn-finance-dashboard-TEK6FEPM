import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CategoryIcon, IconSearch, IconAlert } from './Icons';

const ROW_VARIANTS = {
  hidden:  { opacity: 0, x: -16, height: 0 },
  visible: { opacity: 1, x:   0, height: 'auto' },
  exit:    { opacity: 0, x:  16, height: 0 },
};

const formatDate = (d) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' });
};

const fmt = (n) => `${n.toLocaleString('en-IN')}`;

export default function TransactionTable({
  filteredTransactions,
  transactions,
  search, setSearch,
  sortBy, setSortBy,
  filterType, setFilterType,
  deleteTransaction,
  role,
  onAdd,
  initializeMock,
  anomalies,
  searchRef,
}) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const isEmpty   = transactions.length === 0;
  const noResults = !isEmpty && filteredTransactions.length === 0;

  return (
    <motion.div
      className="glass-card flex flex-col"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.45 }}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center gap-3 p-5 border-b" style={{ borderColor: 'var(--border)' }}>
        <div className="flex-1 min-w-0">
          <h2 className="mono font-bold text-sm tracking-widest uppercase" style={{ color: 'var(--text-primary)' }}>
            Transaction Ledger
          </h2>
          <p className="mono text-base mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {filteredTransactions.length} of {transactions.length} entries
          </p>
        </div>
        <button
          id="add-transaction-btn"
          className="vault-btn"
          onClick={onAdd}
          disabled={role === 'viewer'}
          title={role === 'viewer' ? 'Read-only mode' : 'Add transaction (N)'}
        >
          + Add Entry
        </button>
      </div>

      {/* Filters */}
      {!isEmpty && (
        <div className="flex flex-wrap items-center gap-2 px-5 py-3 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="relative flex-1 min-w-[160px]">
            <span className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-ghost)' }}>
              <IconSearch size={13} />
            </span>
            <input
              ref={searchRef}
              id="transaction-search"
              className="vault-input pl-8 text-[0.78rem]"
              placeholder="Search merchant or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div className="flex gap-1">
            {['all','income','expense'].map(t => (
              <button key={t} onClick={() => setFilterType(t)}
                className={`tab-btn ${filterType === t ? 'active' : ''}`}>
                {t}
              </button>
            ))}
          </div>

          <select
            id="sort-select"
            className="vault-select text-[0.73rem]"
            value={sortBy}
            onChange={e => setSortBy(e.target.value)}
          >
            <option value="date-desc">Latest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-high">Amount High</option>
            <option value="amount-low">Amount Low</option>
          </select>
        </div>
      )}

      {/* Empty State */}
      {isEmpty && (
        <div style={{ animation: 'empty-float 3s ease-in-out infinite' }}
          className="flex flex-col items-center justify-center py-16 px-6 gap-4">
          <div className="mono text-4xl font-bold tracking-[0.3em]" style={{ color: 'var(--text-ghost)' }}>
            VAULT
          </div>
          <div className="mono text-4xl font-bold tracking-[0.3em]" style={{ color: 'rgba(255,255,255,0.04)' }}>
            EMPTY
          </div>
          <p className="mono text-sm tracking-widest" style={{ color: 'var(--text-ghost)' }}>
            No transactions recorded.
          </p>
          <button className="vault-btn mt-2" onClick={initializeMock}>
            Initialize with Mock Data
          </button>
        </div>
      )}

      {/* No Results */}
      {noResults && (
        <div className="flex flex-col items-center justify-center py-12 gap-3">
          <div className="mono text-2xl font-bold tracking-widest" style={{ color: 'var(--text-ghost)' }}>
            NO RESULTS
          </div>
          <p className="mono text-sm" style={{ color: 'var(--text-ghost)' }}>
            Try a different search or filter.
          </p>
        </div>
      )}

      {/* Table */}
      {!isEmpty && !noResults && (
        <div className="overflow-x-auto">
          <table className="w-full" style={{ borderCollapse: 'collapse' }}>
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                {['Date', 'Merchant', 'Category', 'Type', 'Amount', ''].map(h => (
                  <th key={h}
                    className="mono text-left text-sm tracking-widest uppercase px-5 py-3 font-semibold"
                    style={{ color: 'var(--text-ghost)' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <AnimatePresence mode="popLayout">
                {filteredTransactions.map(tx => {
                  const isAnomaly = anomalies?.has(tx.id);
                  return (
                    <motion.tr
                      key={tx.id}
                      layout
                      variants={ROW_VARIANTS}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      transition={{ duration: 0.22, ease: 'easeInOut' }}
                      onMouseEnter={() => setHoveredRow(tx.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      style={{
                        borderBottom: '1px solid var(--border)',
                        background: hoveredRow === tx.id ? 'rgba(255,255,255,0.015)' : 'transparent',
                        transition: 'background 0.15s',
                      }}
                    >
                      <td className="mono text-sm px-5 py-3.5 whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>
                        {formatDate(tx.date)}
                      </td>

                      <td className="text-sm font-medium px-5 py-3.5 whitespace-nowrap max-w-[200px] truncate">
                        <span className="flex items-center gap-2">
                          {tx.merchant}
                          {isAnomaly && (
                            <span className="anomaly-badge">
                              <IconAlert size={10} />
                              High
                            </span>
                          )}
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="inline-flex items-center gap-1.5 mono text-sm uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{ background: 'rgba(255,255,255,0.04)', color: 'var(--text-muted)' }}>
                          <CategoryIcon category={tx.category} size={11} />
                          <span className="hidden sm:inline">{tx.category}</span>
                        </span>
                      </td>

                      <td className="px-5 py-3.5">
                        <span className="mono text-sm font-bold uppercase tracking-wider px-2 py-0.5 rounded"
                          style={{
                            background: tx.type === 'income' ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
                            color:      tx.type === 'income' ? 'var(--income)' : 'var(--expense)',
                          }}>
                          {tx.type}
                        </span>
                      </td>

                      <td className="mono text-sm font-bold px-5 py-3.5 whitespace-nowrap"
                        style={{ color: tx.type === 'income' ? 'var(--income)' : 'var(--expense)' }}>
                        {tx.type === 'income' ? '+' : '-'}{fmt(tx.amount)}
                      </td>

                      <td className="px-5 py-3.5">
                        {role !== 'viewer' && (
                          <button
                            className="vault-btn-danger"
                            onClick={() => deleteTransaction(tx.id)}
                            title="Delete transaction"
                            aria-label={`Delete ${tx.merchant}`}
                          >
                            <span className="mono text-base font-bold">X</span>
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
}
