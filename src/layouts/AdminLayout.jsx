import { Outlet } from 'react-router-dom';
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
