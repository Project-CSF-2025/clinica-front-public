import { Outlet } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RequireAdminAuth from '../components/RequireAdminAuth';

const AdminLayout = () => {
  return (
    <RequireAdminAuth>
      <>
        <Header isAdminPage={true} />
        <Outlet />
        <Footer />
      </>
    </RequireAdminAuth>
  );
};

export default AdminLayout;
