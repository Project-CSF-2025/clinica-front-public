import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Form from './pages/Form';
import Preview from './pages/Preview';
import Confirm from './pages/Confirm';
import Admin from './pages/Admin';
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
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
