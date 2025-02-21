import React from "react";
import { Link } from "react-router-dom";
import iconNew from "../assets/img/icon_new.png";
import iconSearch from "../assets/img/icon_search.png";


function Home() {
  return (
    <>
      <div className="inicio">
        <main className="wrapper container-xxl -noScroll">
          <h2 className="titleA fs-1 -center">BIENVENIDO</h2>

          <div className="inicio-subtititle ">
            <h3 className="headdingC-inicio fs-3 -center -mt40 ">Gestiona tus incidencias de forma rápida y sencilla</h3> 
          </div>

          <div className="button-container">
            <div className="buttonInicio">
              <Link to="/form" className="button-link">
                <img src={iconNew} alt="" className="button-icon-inicio" />
                Nuevo Reporte
              </Link>
              <Link to="" className="button-link">
                <img src={iconSearch} alt="" className="button-icon-inicio" />
                Consultar estado
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default Home
