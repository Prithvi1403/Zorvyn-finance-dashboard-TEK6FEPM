export const CATEGORIES = [
  'Food & Dining',
  'Transport',
  'Housing',
  'Entertainment',
  'Health & Wellness',
  'Shopping',
  'Salary',
  'Investment',
  'Freelance',
  'Utilities',
];

export const BUDGETS = {
  'Food & Dining':    5000,
  'Transport':        4000,
  'Housing':         20000,
  'Entertainment':    2500,
  'Health & Wellness': 3000,
  'Shopping':         6000,
  'Utilities':        3500,
  'Investment':      10000,
};

export const INITIAL_TRANSACTIONS = [
  { id: 't001', date: '2026-03-28', merchant: 'Netflix Premium',    category: 'Entertainment',     type: 'expense', amount: 1499  },
  { id: 't002', date: '2026-03-27', merchant: 'TechCorp Inc.',      category: 'Salary',            type: 'income',  amount: 85000 },
  { id: 't003', date: '2026-03-25', merchant: 'Zomato',             category: 'Food & Dining',     type: 'expense', amount: 340   },
  { id: 't004', date: '2026-03-24', merchant: 'Ola Cabs',           category: 'Transport',         type: 'expense', amount: 180   },
  { id: 't005', date: '2026-03-22', merchant: 'Apollo Pharmacy',    category: 'Health & Wellness', type: 'expense', amount: 820   },
  { id: 't006', date: '2026-03-20', merchant: 'Amazon Prime',       category: 'Shopping',          type: 'expense', amount: 3200  },
  { id: 't007', date: '2026-03-18', merchant: 'Freelance - Acme',   category: 'Freelance',         type: 'income',  amount: 12000 },
  { id: 't008', date: '2026-03-15', merchant: 'HDFC Rent ECS',      category: 'Housing',           type: 'expense', amount: 18000 },
  { id: 't009', date: '2026-03-12', merchant: 'Zerodha Invest',     category: 'Investment',        type: 'expense', amount: 5000  },
  { id: 't010', date: '2026-03-10', merchant: 'Swiggy',             category: 'Food & Dining',     type: 'expense', amount: 520   },
  { id: 't011', date: '2026-03-08', merchant: 'BSNL Broadband',     category: 'Utilities',         type: 'expense', amount: 999   },
  { id: 't012', date: '2026-03-05', merchant: 'Spotify Family',     category: 'Entertainment',     type: 'expense', amount: 179   },
  { id: 't013', date: '2026-03-03', merchant: 'Q1 Performance Bonus', category: 'Salary',          type: 'income',  amount: 15000 },
  { id: 't014', date: '2026-03-01', merchant: 'Decathlon',          category: 'Shopping',          type: 'expense', amount: 2800  },
  { id: 't015', date: '2026-02-28', merchant: 'TechCorp Inc.',      category: 'Salary',            type: 'income',  amount: 85000 },
  { id: 't016', date: '2026-02-25', merchant: 'Rapido Ride',        category: 'Transport',         type: 'expense', amount: 95    },
  { id: 't017', date: '2026-02-20', merchant: 'Cult.fit Membership', category: 'Health & Wellness', type: 'expense', amount: 1200  },
  { id: 't018', date: '2026-02-18', merchant: 'Design Client - UI', category: 'Freelance',         type: 'income',  amount: 8500  },
  { id: 't019', date: '2026-02-15', merchant: 'HDFC Rent ECS',      category: 'Housing',           type: 'expense', amount: 18000 },
  { id: 't020', date: '2026-02-10', merchant: 'BigBasket',          category: 'Food & Dining',     type: 'expense', amount: 1800  },
  { id: 't021', date: '2026-02-06', merchant: 'AWS Credits',        category: 'Utilities',         type: 'expense', amount: 1450  },
  { id: 't022', date: '2026-01-30', merchant: 'TechCorp Inc.',      category: 'Salary',            type: 'income',  amount: 85000 },
  { id: 't023', date: '2026-01-22', merchant: 'Airtel Postpaid',    category: 'Utilities',         type: 'expense', amount: 699   },
  { id: 't024', date: '2026-01-18', merchant: 'MakeMyTrip Flight',  category: 'Transport',         type: 'expense', amount: 6800  },
];

export const MONTHLY_CHART_DATA = [
  { month: 'Oct', income: 85000, expenses: 32000 },
  { month: 'Nov', income: 97000, expenses: 27500 },
  { month: 'Dec', income: 112000, expenses: 48000 },
  { month: 'Jan', income: 85000, expenses: 30000 },
  { month: 'Feb', income: 93500, expenses: 29545 },
  { month: 'Mar', income: 112000, expenses: 33537 },
];
