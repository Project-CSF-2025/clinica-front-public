import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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

function App() {
  useEffect(() => {
    console.log("📡 Attempting API call..."); // Debug log
    fetch("http://localhost:5000/api/users")
      .then(response => response.json())
      .then(data => {
        console.log("✅ API Response:", data); // Show data in console
      })
      .catch(error => console.error("❌ API Error:", error));
  }, []);

  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/view" element={<View />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/detail" element={<AdminDetail />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
