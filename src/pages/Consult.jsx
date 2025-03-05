import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getReportByCode } from '../services/reportService';

const Consult = () => {
  const [code, setCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault(); // フォームのデフォルト動作を防止

    if (!code) {
      alert("コードを入力してください");
      return;
    }

    try {
      const response = await getReportByCode(code);
      if (response) {
        navigate(`/view/#${code}`); // view.jsx へ遷移
      } else {
        alert("該当するデータが見つかりません");
      }
    } catch (error) {
      console.error("データ取得エラー:", error);
      alert("エラーが発生しました。後でもう一度お試しください。");
    }
  };

  return (
    <div className="consulta-page">
      <div className="consulta">
        <main className="wrapper container-xxl -noScroll">
          <h2 className="headdingB fs-1 -blue -center">
            CONSULTA EL ESTADO DE TU REPORTE
          </h2>
          <p className="subtitle">Ingresa el código para verificar su estado</p>

          <form onSubmit={handleSubmit}>
            <div className="consulta-container">
              <input
                type="text"
                id="codigo"
                name="codigo"
                className="consulta-input"
                placeholder="XXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                required
              />
              <button type="submit" className="consulta-button">
                Acceder
              </button>
            </div>
          </form>
        </main>
      </div> 
    </div>
  );
};

export default Consult;