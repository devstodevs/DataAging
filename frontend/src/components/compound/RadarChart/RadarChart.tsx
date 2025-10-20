import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import "./RadarChart.css";

interface RadarData {
  domain: string;
  score: number;
  fullMark: number;
}

interface RadarChartProps {
  data: RadarData[];
  title?: string;
  className?: string;
  height?: number;
  domain?: [number, number];
}

const RadarChartComponent: React.FC<RadarChartProps> = ({
  data,
  title,
  className = "",
  height = 300,
  domain,
}) => {
  const chartDomain = domain || (() => {
    if (data.length === 0) return [0, 10];
    const maxFullMark = Math.max(...data.map(d => d.fullMark));
    if (maxFullMark === 8) return [0, 8];
    return [0, maxFullMark];
  })();
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isIVCFScale = chartDomain[0] === 0 && chartDomain[1] === 8;
      return (
        <div className="radar-chart__tooltip">
          <p className="radar-chart__tooltip-label">{data.domain}</p>
          <p className="radar-chart__tooltip-value">
            Média: {typeof data.score === 'number' ? data.score.toFixed(1) : data.score}
          </p>
          {isIVCFScale && (
            <p className="radar-chart__tooltip-scale">
              Escala: 0 (melhor) - 8 (pior)
            </p>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className={`radar-chart ${className}`}>
      {title && <h3 className="radar-chart__title">{title}</h3>}
      <div className="radar-chart__container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <PolarGrid stroke="#e5e7eb" />
            <PolarAngleAxis
              dataKey="domain"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={{ stroke: "#d1d5db" }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={chartDomain}
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={{ stroke: "#d1d5db" }}
            />
            <Radar
              name="Pontuação"
              dataKey="score"
              stroke="#ef4444"
              fill="#fef2f2"
              fillOpacity={0.6}
              strokeWidth={2}
            />
            <Tooltip content={<CustomTooltip />} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RadarChartComponent;
