import { createContext, useReducer, useEffect, useContext } from 'react';
import { INITIAL_TRANSACTIONS } from '../data/mockData';

const FinanceContext = createContext(null);

const bootstrap = {
  transactions: [],
  role: 'admin',
  initialized: false,
  undoStack: [],       // { transaction, index }
};

function financeReducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...state, ...action.payload, initialized: true, undoStack: [] };

    case 'INITIALIZE':
      return { ...state, transactions: INITIAL_TRANSACTIONS, initialized: true };

    case 'RESET':
      return { ...state, transactions: [], undoStack: [] };

    case 'ADD_TRANSACTION':
      return { ...state, transactions: [action.payload, ...state.transactions] };

    case 'DELETE_TRANSACTION': {
      const idx = state.transactions.findIndex(t => t.id === action.payload);
      if (idx === -1) return state;
      const deleted = state.transactions[idx];
      return {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        undoStack: [{ transaction: deleted, index: idx }, ...state.undoStack].slice(0, 10),
      };
    }

    case 'UNDO_DELETE': {
      if (state.undoStack.length === 0) return state;
      const [restored, ...rest] = state.undoStack;
      const txs = [...state.transactions];
      txs.splice(Math.min(restored.index, txs.length), 0, restored.transaction);
      return { ...state, transactions: txs, undoStack: rest };
    }

    case 'CLEAR_UNDO':
      return { ...state, undoStack: [] };

    case 'SET_ROLE':
      return { ...state, role: action.payload };

    default:
      return state;
  }
}

export function FinanceProvider({ children }) {
  const [state, dispatch] = useReducer(financeReducer, bootstrap);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('vault_v2');
      if (raw) {
        dispatch({ type: 'LOAD_STATE', payload: JSON.parse(raw) });
      } else {
        dispatch({ type: 'INITIALIZE' });
      }
    } catch {
      dispatch({ type: 'INITIALIZE' });
    }
  }, []);

  useEffect(() => {
    if (!state.initialized) return;
    localStorage.setItem('vault_v2', JSON.stringify({
      transactions: state.transactions,
      role: state.role,
    }));
  }, [state.transactions, state.role, state.initialized]);

  return (
    <FinanceContext.Provider value={{ state, dispatch }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinanceContext() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error('useFinanceContext must be inside <FinanceProvider>');
  return ctx;
}
