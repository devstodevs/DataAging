import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import "./LoadingDashboard.css";

const LoadingDashboard: React.FC = () => {
  return (
    <div className="loading-dashboard">
      {/* Header Skeleton */}
      <div className="loading-header">
        <div className="skeleton skeleton-button" />
        <div className="skeleton skeleton-title" />
        <div className="skeleton skeleton-button" />
      </div>

      {/* KPIs Skeleton */}
      <div className="loading-kpis">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="loading-kpi-card">
            <CardContent className="loading-kpi-content">
              <div className="skeleton skeleton-icon" />
              <div className="loading-kpi-text">
                <div className="skeleton skeleton-kpi-title" />
                <div className="skeleton skeleton-kpi-value" />
                <div className="skeleton skeleton-kpi-subtitle" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Skeleton */}
      <div className="loading-charts">
        {[1, 2].map((i) => (
          <Card key={i} className="loading-chart-card">
            <CardHeader>
              <div className="skeleton skeleton-chart-title" />
            </CardHeader>
            <CardContent>
              <div className="skeleton skeleton-chart" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table Skeleton */}
      <Card className="loading-table-card">
        <CardHeader>
          <div className="skeleton skeleton-table-title" />
        </CardHeader>
        <CardContent>
          <div className="loading-table">
            <div className="loading-table-header">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="skeleton skeleton-table-header" />
              ))}
            </div>
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="loading-table-row">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="skeleton skeleton-table-cell" />
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoadingDashboard;