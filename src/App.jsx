// import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from './components/Header';
import Home from './pages/Home';
import Form from './pages/Form';
import Preview from './pages/Preview';
import Confirm from './pages/Confirm';
import Footer from './components/Footer';
import Admin from "./pages/Admin";
import AdminDetail from "./pages/AdminDetail";
import AdminLogin from "./pages/AdminLogin";
import Consult from "./pages/Consult";  
import Previsual from "./pages/Previsual";
import View from "./pages/View";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/form" element={<Form />} />
        <Route path="/preview" element={<Preview />} />
        <Route path="/confirm" element={<Confirm />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/detail" element={<AdminDetail />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/consult" element={<Consult />} />
        <Route path="/previsual" element={<Previsual />} />
        <Route path="/view" element={<View />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
