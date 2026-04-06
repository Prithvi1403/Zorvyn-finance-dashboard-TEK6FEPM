import { useState, useMemo } from 'react';
import { useFinanceContext } from '../context/FinanceContext';
import { BUDGETS } from '../data/mockData';

export function useFinance() {
  const { state, dispatch } = useFinanceContext();
  const { transactions, role, undoStack } = state;

  const [search,     setSearch]     = useState('');
  const [sortBy,     setSortBy]     = useState('date-desc');
  const [filterType, setFilterType] = useState('all');

  /* ── Filtered + sorted ── */
  const filteredTransactions = useMemo(() => {
    let res = [...transactions];
    if (filterType !== 'all') res = res.filter(t => t.type === filterType);
    if (search.trim()) {
      const q = search.toLowerCase();
      res = res.filter(t =>
        t.merchant.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'date-desc':   res.sort((a,b) => new Date(b.date) - new Date(a.date)); break;
      case 'date-asc':    res.sort((a,b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount-high': res.sort((a,b) => b.amount - a.amount); break;
      case 'amount-low':  res.sort((a,b) => a.amount - b.amount); break;
      default: break;
    }
    return res;
  }, [transactions, search, sortBy, filterType]);

  /* ── Summary calculations ── */
  const summary = useMemo(() => {
    const income   = transactions.filter(t => t.type === 'income').reduce((s,t) => s + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'expense').reduce((s,t) => s + t.amount, 0);
    const balance  = income - expenses;

    // Category breakdown
    const catMap = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catMap[t.category] = (catMap[t.category] || 0) + t.amount;
    });
    const sortedCats = Object.entries(catMap).sort((a,b) => b[1] - a[1]);
    const highestCat = sortedCats[0] || ['-', 0];
    const donutData  = sortedCats.map(([name, value]) => ({ name, value }));

    // Monthly comparison
    const now     = new Date();
    const curMon  = now.getMonth();
    const curYear = now.getFullYear();
    const prevMon = curMon === 0 ? 11 : curMon - 1;
    const prevYr  = curMon === 0 ? curYear - 1 : curYear;

    const thisMonthExp = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === curMon && d.getFullYear() === curYear;
    }).reduce((s,t) => s + t.amount, 0);

    const lastMonthExp = transactions.filter(t => {
      const d = new Date(t.date);
      return t.type === 'expense' && d.getMonth() === prevMon && d.getFullYear() === prevYr;
    }).reduce((s,t) => s + t.amount, 0);

    const monthlyDelta = lastMonthExp > 0
      ? +((thisMonthExp - lastMonthExp) / lastMonthExp * 100).toFixed(1)
      : 0;

    // Budget utilization
    const budgetData = Object.entries(BUDGETS).map(([cat, budget]) => {
      const spent = catMap[cat] || 0;
      const pct   = Math.min((spent / budget) * 100, 150);
      return { category: cat, budget, spent, pct };
    }).sort((a,b) => b.pct - a.pct);

    // Spending velocity
    const dayOfMonth    = Math.max(now.getDate(), 1);
    const dailyAvgThis  = dayOfMonth > 0 ? thisMonthExp / dayOfMonth : 0;
    const daysInMonth   = new Date(curYear, curMon + 1, 0).getDate();
    const projectedTotal = dailyAvgThis * daysInMonth;

    const prevMonDays   = new Date(prevYr, prevMon + 1, 0).getDate();
    const dailyAvgLast  = prevMonDays > 0 ? lastMonthExp / prevMonDays : 0;

    // Anomaly detection (2x+ category average)
    const catAvgs = {};
    const catCounts = {};
    transactions.filter(t => t.type === 'expense').forEach(t => {
      catAvgs[t.category] = (catAvgs[t.category] || 0) + t.amount;
      catCounts[t.category] = (catCounts[t.category] || 0) + 1;
    });
    Object.keys(catAvgs).forEach(k => { catAvgs[k] = catAvgs[k] / catCounts[k]; });

    const anomalies = new Set(
      transactions
        .filter(t => t.type === 'expense' && catAvgs[t.category] && t.amount >= catAvgs[t.category] * 2)
        .map(t => t.id)
    );

    // Financial tip
    let tip = '';
    if (balance < 0)              tip = 'Spending exceeds income this period. Consider auditing your subscriptions and recurring charges.';
    else if (monthlyDelta > 20)   tip = `Expenses rose ${monthlyDelta}% vs last month. Housing and shopping are the primary drivers.`;
    else if (highestCat[0] === 'Housing') tip = `Housing is your top expense at ${((highestCat[1]/expenses)*100).toFixed(0)}% of total spend. That is typical for metro areas.`;
    else                          tip = `Spending is within healthy bounds. Your current savings rate is ${balance > 0 ? ((balance/income)*100).toFixed(0) : 0}%.`;

    return {
      balance, income, expenses, highestCat, donutData, monthlyDelta,
      thisMonthExp, lastMonthExp, budgetData, tip, anomalies,
      dailyAvgThis, dailyAvgLast, projectedTotal,
    };
  }, [transactions]);

  /* ── Actions ── */
  const addTransaction    = (tx) => dispatch({ type: 'ADD_TRANSACTION',    payload: tx });
  const deleteTransaction = (id) => dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  const undoDelete        = ()   => dispatch({ type: 'UNDO_DELETE' });
  const clearUndo         = ()   => dispatch({ type: 'CLEAR_UNDO' });
  const setRole           = (r)  => dispatch({ type: 'SET_ROLE',           payload: r  });
  const initializeMock    = ()   => dispatch({ type: 'INITIALIZE' });
  const resetVault        = ()   => dispatch({ type: 'RESET' });

  return {
    transactions, filteredTransactions, summary, role, undoStack,
    search, setSearch, sortBy, setSortBy, filterType, setFilterType,
    addTransaction, deleteTransaction, undoDelete, clearUndo,
    setRole, initializeMock, resetVault,
  };
}
