import React, { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import { getAllReports } from "../services/reportService";
import { useNavigate } from "react-router-dom";

const COLORS = ["#97DD46", "#F4E66B", "#E53751", "#FFC5C5"]; // Custom colors for status pie

function Dashboard() {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();

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

  // 🔢 Status counts
  const statusCounts = {
    "No leído": 0,
    "En proceso": 0,
    "Resuelto": 0,
    "Eliminado": 0,
  };

  reports.forEach((report) => {
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

  return (
    <div className="container py-4">
      <h2 className="fs-2 text-center mb-4">📊 Panel de Control</h2>

      {/* 🔢 Summary Cards */}
      <div className="d-flex flex-wrap justify-content-around mb-5">
        <div className="p-3 border rounded text-center shadow-sm bg-light">
          <h4>Total Reportes</h4>
          <p className="fs-3">{reports.length}</p>
        </div>
        {Object.entries(statusCounts).map(([status, count], index) => (
          <div key={index} className="p-3 border rounded text-center shadow-sm bg-light">
            <h5>{status}</h5>
            <p className="fs-4">{count}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <h5 className="text-center">🟡 Distribución de Estado</h5>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="col-md-6 mb-4">
          <h5 className="text-center">📅 Reportes por Mes</h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={barData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" name="Cantidad" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="col-md-12 mb-4">
        <h5 className="text-center">📈 Reportes por Año</h5>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={yearData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="year" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#00b894" name="Cantidad" />
          </BarChart>
        </ResponsiveContainer>
      </div>


      <div className="text-center mt-4">
        <button className="btn btn-secondary" onClick={() => navigate("/admin")}>
          ← Volver al Panel de Admin
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
