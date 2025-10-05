import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import "./KPICard.css";

export interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  icon?: React.ReactNode;
  className?: string;
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  trend,
  trendValue,
  icon,
  className = "",
}) => {
  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="trend-icon trend-up" />;
      case "down":
        return <TrendingDown className="trend-icon trend-down" />;
      case "neutral":
        return <Minus className="trend-icon trend-neutral" />;
      default:
        return null;
    }
  };

  const getTrendClass = () => {
    switch (trend) {
      case "up":
        return "trend-up";
      case "down":
        return "trend-down";
      case "neutral":
        return "trend-neutral";
      default:
        return "";
    }
  };

  return (
    <Card className={`kpi-card ${className}`}>
      <CardContent className="kpi-card-content">
        <div className="kpi-header">
          <span className="kpi-title">{title}</span>
          {icon && <div className="kpi-icon">{icon}</div>}
        </div>
        
        <div className="kpi-value">{value}</div>
        
        {(subtitle || trendValue) && (
          <div className="kpi-footer">
            {trendValue && (
              <div className={`kpi-trend ${getTrendClass()}`}>
                {getTrendIcon()}
                <span className="trend-value">{trendValue}</span>
              </div>
            )}
            {subtitle && <span className="kpi-subtitle">{subtitle}</span>}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default KPICard;
