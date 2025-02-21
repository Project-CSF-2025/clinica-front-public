import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/img/logo.svg";

function Header() {
  return (
    <>
      <header className="header">
        <div className="header__inner">
          <h1 className="header__logo max-w-64">
            <Link to="/">
              <img src={logo} alt="CLINICA SAGRADA FAMILIA" />
            </Link>
          </h1>
        </div>
      </header>
    </>
  )
}

export default Header
