// src/features/TicketSummary/App.tsx
import MainLayout from '../src/components/MainLayout'; // <<< CORRECTED PATH
// ... other imports like TicketSummaryPage might also need path adjustments if App.tsx moved
import TicketSummary from './features/TicketSummary'; // This would be correct if TicketSummaryPage is in the same folder
import './index.css'; // Path to global CSS from here would be ../../index.css

function App() {
  return (
    <MainLayout>
      <TicketSummary/>
    </MainLayout>
  );
}

export default App;