import './App.css';
import CreditSelectionPage from './Pages/CreditSelectionPage';
import LandingPage from './Pages/LandingPage';
import PaymentCancelPage from './Pages/PaymentCancelPage';
import PaymentSuccessPage from './Pages/PaymentSuccessPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Router >
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path='/payment/cancel' element={<PaymentCancelPage />} />
        <Route path='/credit-selection' element={<CreditSelectionPage />} />
        <Route path='/payment/success' element={<PaymentSuccessPage />} />
      </Routes>
    </Router>
  );
}

export default App;