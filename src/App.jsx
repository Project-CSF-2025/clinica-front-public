import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UserLayout from './layouts/UserLayout';
import AdminLayout from './layouts/AdminLayout';
import Home from './pages/Home';
import Form from './pages/Form';
import Preview from './pages/Preview';
import Confirm from './pages/Confirm';
import Consult from './pages/Consult';
import View from './pages/View';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import AdminDetail from './pages/AdminDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* 👥 Public/user-facing pages */}
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/form" element={<Form />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/consult" element={<Consult />} />
          <Route path="/view/:reportCode" element={<View />} />
        </Route>

        {/* 🔐 Admin login - no layout */}
        <Route path="/admin-login" element={<AdminLogin />} />

        {/* 🛡 Protected admin pages */}
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<Admin />} />
          <Route path="/admin/detail/:id" element={<AdminDetail />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
