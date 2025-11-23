import React from "react";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { TooltipProps } from "recharts";
import "./LineChart.css";

interface LineData {
  month: string;
  [key: string]: string | number;
}

interface TooltipPayload {
  color: string;
  name: string;
  value: string | number;
}

interface CustomTooltipProps extends TooltipProps<number, string> {
  active?: boolean;
  payload?: Array<{
    color: string;
  } & TooltipPayload>;
  label?: string;
}

interface LegendPayload {
  color: string;
  value: string;
}

interface CustomLegendProps {
  payload?: LegendPayload[];
}

interface LineChartProps {
  data: LineData[];
  title?: string;
  className?: string;
  height?: number;
  lines: {
    dataKey: string;
    name: string;
    color: string;
  }[];
}

const LineChartComponent: React.FC<LineChartProps> = ({
  data,
  title,
  className = "",
  height = 300,
  lines,
}) => {
  const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="line-chart__tooltip">
          <p className="line-chart__tooltip-label">{label}</p>
          {payload.map((entry, index: number) => (
            <p key={index} className="line-chart__tooltip-item">
              <span
                className="line-chart__tooltip-color"
                style={{ backgroundColor: entry.color }}
              />
              {entry.name}: {entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: CustomLegendProps) => {
    if (!payload) return null;
    return (
      <div className="line-chart__legend">
        {payload.map((entry, index: number) => (
          <div key={index} className="line-chart__legend-item">
            <span
              className="line-chart__legend-color"
              style={{ backgroundColor: entry.color }}
            />
            <span className="line-chart__legend-label">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`line-chart ${className}`}>
      {title && <h3 className="line-chart__title">{title}</h3>}
      <div className="line-chart__container" style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={{ stroke: "#d1d5db" }}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#6b7280" }}
              tickLine={{ stroke: "#d1d5db" }}
              axisLine={{ stroke: "#d1d5db" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend content={<CustomLegend />} />
            {lines.map((line) => (
              <Line
                key={line.dataKey}
                type="monotone"
                dataKey={line.dataKey}
                name={line.name}
                stroke={line.color}
                strokeWidth={2}
                dot={{ fill: line.color, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: line.color, strokeWidth: 2 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LineChartComponent;
