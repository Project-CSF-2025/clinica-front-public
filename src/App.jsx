import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Form from './pages/Form';
import Preview from './pages/Preview';
import Confirm from './pages/Confirm';
import Consult from './pages/Consult';
import View from './pages/View';
import AdminLogin from "./pages/AdminLogin";
import Admin from './pages/Admin';
import AdminDetail from './pages/AdminDetail';
import Footer from './components/Footer';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <Header isAdminPage={isAdminPage} />
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/view/:reportCode" element={<View />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/detail/:id" element={<AdminDetail />} />
      </Routes>

      <Footer />
    </>
  );
}

function App() {

  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
