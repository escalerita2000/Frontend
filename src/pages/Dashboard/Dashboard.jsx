// src/pages/Dashboard/Dashboard.jsx
// Usa recharts — ya instalado en tu proyecto.

import {
  AreaChart, Area,
  BarChart,  Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
  Cell,
} from "recharts";
import { PieChart, Pie } from "recharts";

// ── Datos ────────────────────────────────────────────────────────────────────

const visitasData = [
  { x: 1,  v: 80  }, { x: 2,  v: 75  }, { x: 3,  v: 85  },
  { x: 4,  v: 72  }, { x: 5,  v: 90  }, { x: 6,  v: 95  },
  { x: 7,  v: 88  }, { x: 8,  v: 100 }, { x: 9,  v: 110 },
  { x: 10, v: 105 }, { x: 11, v: 120 }, { x: 12, v: 130 },
  { x: 13, v: 125 }, { x: 14, v: 140 }, { x: 15, v: 150 },
];

const registrosData = [
  { label: "249", v: 249 },
  { label: "379", v: 379 },
  { label: "421", v: 421 },
];

const donutData = [
  { name: "No registrados", value: 27 },
  { name: "Registrados",    value: 73 },
];

const erroresData = [
  { x: 1, v: 3  }, { x: 2, v: 2  }, { x: 3, v: 4  },
  { x: 4, v: 3  }, { x: 5, v: 5  }, { x: 6, v: 4  },
  { x: 7, v: 6  }, { x: 8, v: 5  }, { x: 9, v: 7  },
  { x: 10, v: 8 }, { x: 11, v: 9 }, { x: 12, v: 12 },
];

// ── Tooltip personalizado (transparente, sin fondo blanco) ────────────────────
const DarkTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "rgba(0,0,0,0.75)",
        border: "1px solid rgba(93,170,79,0.3)",
        borderRadius: 4,
        padding: "4px 10px",
        fontSize: 11,
        color: "rgba(255,255,255,0.8)",
        fontFamily: "'Cinzel', serif",
      }}>
        {payload[0].value}
      </div>
    );
  }
  return null;
};

// ── Componente principal ──────────────────────────────────────────────────────
export default function Dashboard() {
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&display=swap');

        .dash-home {
          width: 100%;
          height: 100%;
          padding: 14px;
          background: #1a3318;
          display: flex;
          flex-direction: column;
          box-sizing: border-box;
          animation: dashFadeIn 0.35s ease both;
        }
        @keyframes dashFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        .dash-grid {
          flex: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          gap: 12px;
          min-height: 0;
        }

        .dash-card {
          background: #122610;
          border: 1px solid rgba(93,170,79,0.12);
          border-radius: 3px;
          padding: 14px 16px 12px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          overflow: hidden;
          min-height: 0;
          box-sizing: border-box;
          transition: border-color 0.2s;
        }
        .dash-card:hover {
          border-color: rgba(93,170,79,0.25);
        }

        .dash-card__label {
          font-family: 'Cinzel', serif;
          font-size: 9px;
          font-weight: 600;
          letter-spacing: 0.14em;
          color: rgba(255,255,255,0.45);
          text-transform: uppercase;
          flex-shrink: 0;
        }

        .dash-card__chart {
          flex: 1;
          min-height: 0;
        }

        .dash-card__value {
          font-family: 'Cinzel', serif;
          font-size: 26px;
          font-weight: 700;
          color: rgba(255,255,255,0.85);
          letter-spacing: 0.02em;
          flex-shrink: 0;
          line-height: 1;
        }

        .dash-donut-row {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 16px;
          min-height: 0;
        }

        .dash-donut-legend {
          font-family: 'Cinzel', serif;
          font-size: 22px;
          font-weight: 700;
          color: rgba(255,255,255,0.8);
        }
      `}</style>

      <div className="dash-home">
        <div className="dash-grid">

          {/* ── Card 1: Visitas (AreaChart) ── */}
          <div className="dash-card">
            <p className="dash-card__label">VISITAS DE LA PAGINA</p>
            <div className="dash-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitasData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradVisitas" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#5daa4f" stopOpacity={0.35}/>
                      <stop offset="95%" stopColor="#5daa4f" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="x" hide />
                  <YAxis hide />
                  <Tooltip content={<DarkTooltip />} />
                  <Area
                    type="monotone" dataKey="v"
                    stroke="#5daa4f" strokeWidth={2}
                    fill="url(#gradVisitas)"
                    dot={false} activeDot={{ r: 4, fill: "#5daa4f" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <p className="dash-card__value">2.134</p>
          </div>

          {/* ── Card 2: Registros (BarChart) ── */}
          <div className="dash-card">
            <p className="dash-card__label">REGISTROS DE USUARIO</p>
            <div className="dash-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={registrosData} margin={{ top: 4, right: 4, left: -30, bottom: 16 }}>
                  <XAxis
                    dataKey="label"
                    tick={{ fill: "rgba(255,255,255,0.45)", fontSize: 9,
                      fontFamily: "'Cinzel', serif" }}
                    axisLine={false} tickLine={false}
                  />
                  <YAxis hide />
                  <Tooltip content={<DarkTooltip />} />
                  <Bar dataKey="v" radius={[2, 2, 0, 0]}>
                    <Cell fill="#2d6a2d"/>
                    <Cell fill="#3a8030"/>
                    <Cell fill="#4a9040"/>
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* ── Card 3: No registrados (PieChart donut) ── */}
          <div className="dash-card">
            <p className="dash-card__label">USUARIOS NO REGISTRADOS</p>
            <div className="dash-donut-row">
              <ResponsiveContainer width={110} height="100%">
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%" cy="50%"
                    innerRadius="55%" outerRadius="80%"
                    startAngle={90} endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill="#3a7232"/>
                    <Cell fill="rgba(255,255,255,0.06)"/>
                  </Pie>
                  <Tooltip content={<DarkTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <span className="dash-donut-legend">27%</span>
            </div>
          </div>

          {/* ── Card 4: Errores (LineChart) ── */}
          <div className="dash-card">
            <p className="dash-card__label">ERRORES DE LA PAGINA</p>
            <div className="dash-card__chart">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={erroresData} margin={{ top: 4, right: 4, left: -30, bottom: 0 }}>
                  <XAxis dataKey="x" hide />
                  <YAxis hide />
                  <Tooltip content={<DarkTooltip />} />
                  <Line
                    type="monotone" dataKey="v"
                    stroke="#5daa4f" strokeWidth={2}
                    dot={false} activeDot={{ r: 4, fill: "#5daa4f" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <p className="dash-card__value">12</p>
          </div>

        </div>
      </div>
    </>
  );
}