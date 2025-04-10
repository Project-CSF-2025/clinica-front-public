import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { getAllReports } from "../services/reportService";
import { useNavigate, Link } from "react-router-dom";
import { downloadReportCSV } from "../services/reportService";

const COLORS = [
  "rgba(243, 66, 53, 0.9)",   
  "rgba(53, 135, 242, 0.9)", 
  "rgba(15, 46, 94, 0.9)", 
  "rgba(161, 161, 151, 0.9)" 
];

function Dashboard() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getAllReports();
        setReports(data);
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter((report) => {
    const createdAt = new Date(report.created_at);
    const from = startDate ? new Date(startDate) : null;
    const to = endDate ? new Date(endDate) : null;
  
    return (!from || createdAt >= from) && (!to || createdAt <= to);
  });  

  // 🔢 Status counts
  const statusCounts = {
    "No leído": 0,
    "En proceso": 0,
    "Resuelto": 0,
    "Eliminado": 0,
  };

  filteredReports.forEach((report) => {
    const status = report.status || "No leído";
    if (statusCounts[status] !== undefined) {
      statusCounts[status]++;
    }
  });

  const pieData = Object.entries(statusCounts).map(([status, count]) => ({
    name: status,
    value: count,
  }));

  // 📅 Monthly breakdown
  const monthMap = {};

  reports.forEach((report) => {
    const date = new Date(report.created_at);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;
    if (!monthMap[key]) {
      monthMap[key] = 0;
    }
    monthMap[key]++;
  });

  const barData = Object.entries(monthMap).map(([month, count]) => ({
    month,
    count,
  }));

  // 📅 Yearly breakdown
  const yearMap = {};

  reports.forEach((report) => {
    const date = new Date(report.created_at);
    const year = `${date.getFullYear()}`;
    if (!yearMap[year]) {
      yearMap[year] = 0;
    }
    yearMap[year]++;
  });

  const yearData = Object.entries(yearMap).map(([year, count]) => ({
    year,
    count,
  }));

  const handleDownloadCSV = async () => {
    try {
      const blob = await downloadReportCSV();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "reportes_clinica.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      alert("No se pudo descargar el archivo CSV.");
    }
  };

  return (
    <div className="dashboardPage container mt-5">
      <h2 className="headdingA fs-1 -blue -center -regular mb-5">📊 Panel de Control</h2>

      {/* 🔢 Summary Cards */}
      <div className="dashboardCardsWrap">
        {/* 📅 フィルター用カレンダー */}
        <div className="dashboardCards__head">
          <div className="mb-3 d-flex gap-3 align-items-center">
            <label className="dashboardCards__filterTitle fw-bold">Filtrar por fecha:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="form-control"
            />
            <span>〜</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="form-control"
            />
          </div>
          <button className="btn btn-outline-primary" onClick={handleDownloadCSV}>
            📂 Descargar todo
          </button>
        </div>
        
        <div className="dashboardCards d-flex flex-wrap justify-content-between">
          {/* <div className="dashboardCards__item p-3 rounded text-center shadow-sm -total">
            <h4 className="fw-bold">Total Reportes</h4>
            <p className="fs-2 fw-bold">{filteredReports.length}</p>
          </div> */}
          {Object.entries(statusCounts).map(([status, count], index) => {
            const safeStatus = status
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // アクセント除去
            .toLowerCase()
            .split(" ")
            .map((word, i) => i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1))
            .join("");

            return (
              <div
                key={index}
                className={`dashboardCards__item p-3 rounded text-center shadow-sm -${safeStatus}`}
              >
                <h5>{status}</h5>
                <p className="fs-2 fw-medium">{count}</p>
              </div>
            );
          })}
          <div className="dashboardCards__item p-3 rounded text-center shadow-sm -total">
            <h4 className="fw-bold">Total Reportes</h4>
            <p className="fs-2 fw-bold">{filteredReports.length}</p>
          </div>
        </div>
      </div>

      <div className="dashboardGraphWrap row">
        {/* Left: barChart */}
        <div className="col-md-6 d-flex flex-column gap-5">
          <div className="mb-4">
            <h5 class="headdingB fs-4 -blue -bold px-5">Reportes por Año</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={yearData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="count" fill="#ffa500" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mb-4">
            <h5 className="headdingB fs-4 -blue -bold px-5">Reportes por Mes</h5>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                {/* <Legend /> */}
                <Bar dataKey="count" fill="#ffa500" name="Cantidad" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Left: pieChart */}
        <div className="col-md-6 d-flex align-items-center justify-content-center">
          <div style={{ width: "100%", maxWidth: 400 }}>
            <h5 className="headdingB fs-4 -blue -bold">Distribución de Estado</h5>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={120}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend layout="horizontal" verticalAlign="bottom" align="right" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="btn btn-primary salir-adminDetail">
          <Link to="/admin" className="-iconBack">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"/>
            </svg>
            Volver
          </Link>
        </div>
      {/* <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
          ← Volver al Panel de Admin
        </button>
      </div> */}
    </div>
  );
}

export default Dashboard;
