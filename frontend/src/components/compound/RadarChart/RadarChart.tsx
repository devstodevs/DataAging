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
}

const RadarChartComponent: React.FC<RadarChartProps> = ({
  data,
  title,
  className = "",
  height = 300,
}) => {
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="radar-chart__tooltip">
          <p className="radar-chart__tooltip-label">{data.domain}</p>
          <p className="radar-chart__tooltip-value">Pontuação: {data.score}</p>
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
              domain={[0, 40]}
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
