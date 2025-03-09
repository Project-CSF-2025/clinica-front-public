import React from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/img/logo.svg";

function Header() {
  const location = useLocation();
  const isAdminPage = location.pathname.startsWith("/admin");
  const isAdminLoginPage = location.pathname === "/admin-login";

  return (
    <>
      <header className="header">
        <div className="header__inner">
          <h1 className="header__logo max-w-64">
            {/* When you in the `/admin-login` */}
            {isAdminLoginPage ? (
              <span>
                <img src={logo} alt="CLINICA SAGRADA FAMILIA" />
              </span>
            ) : (
              <Link to={isAdminPage ? "/admin" : "/"}>
                <img src={logo} alt="CLINICA SAGRADA FAMILIA" />
              </Link>
            )}
          </h1>
        </div>
      </header>
    </>
  )
}

export default Header

