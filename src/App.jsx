import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Form from './pages/Form';
import Preview from './pages/Preview';
import Confirm from './pages/Confirm';
import AdminLogin from "./pages/AdminLogin";
import Admin from './pages/Admin';
import AdminDetail from './pages/AdminDetail';
import Footer from './components/Footer';

function App() {

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/detail/:reportCode" element={<AdminDetail />} />

      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
