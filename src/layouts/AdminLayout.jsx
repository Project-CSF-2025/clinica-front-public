import { Outlet } from 'react-router-dom';
import RequireAdminAuth from '../components/RequireAdminAuth';

const AdminLayout = () => {
  return (
    <RequireAdminAuth>
      <Outlet />
    </RequireAdminAuth>
  );
};

export default AdminLayout;
