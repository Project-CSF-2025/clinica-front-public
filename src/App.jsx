import { useLocation, BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Form from './pages/Form';
import Preview from './pages/Preview';
import Confirm from './pages/Confirm';
import Consult from './pages/Consult';
import View from './pages/View';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminDetail from './pages/AdminDetail';
import Dashboard from './pages/Dashboard';
import RequireAdminAuth from './components/RequireAdminAuth';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';

function AppContent() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");

  return (
    <>
      <Header isAdminPage={isAdminPage} />

      <Routes>
        {/* 👤 Public user routes */}
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/view/:reportCode" element={<View />} />

        {/* 🔐 Admin login (no protection needed) */}
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword />} />
        
        {/* 🔐 Protected admin routes */}
        <Route
          path="/admin"
          element={
            <RequireAdminAuth>
              <Admin />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/detail/:id"
          element={
            <RequireAdminAuth>
              <AdminDetail />
            </RequireAdminAuth>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <RequireAdminAuth>
              <Dashboard />
            </RequireAdminAuth>
          }
        />

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
