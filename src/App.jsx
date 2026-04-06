import { FinanceProvider } from './context/FinanceContext';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <FinanceProvider>
      <Dashboard />
    </FinanceProvider>
  );
}

export default App;