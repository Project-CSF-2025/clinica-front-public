import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const UserLayout = () => {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <>
      <Header isAdminPage={isAdminPage} />
      <Outlet />
      <Footer />
    </>
  );
};

export default UserLayout;
