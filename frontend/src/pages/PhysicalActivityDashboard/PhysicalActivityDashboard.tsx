import React, { useState } from "react";
import { ArrowLeft, Download, Users, Activity, Clock, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Alert from "../../components/base/Alert";
import Title from "../../components/base/Title";
import KPICard from "../../components/compound/KPICard";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import "./PhysicalActivityDashboard.css";

interface Patient {
  id: string;
  name: string;
  age: number;
  factScore: number;
  sedentaryHours: number;
  status: "Abaixo" | "Conforme";
}

interface PhysicalActivityDashboardProps {
  onNavigate?: (page: string) => void;
}

const PhysicalActivityDashboard: React.FC<PhysicalActivityDashboardProps> = ({
  onNavigate,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");

  // Dados de exemplo para os gráficos
  const activityDistributionData = [
    { name: "Leve", value: 45, color: "#ef4444" },
    { name: "Moderada", value: 35, color: "#14b8a6" },
    { name: "Vigorosa", value: 20, color: "#1f2937" },
  ];

  const sedentaryByAgeData = [
    { ageRange: "60-70", hours: 7.2 },
    { ageRange: "71-80", hours: 6.8 },
    { ageRange: "81+", hours: 8.5 },
  ];

  const sedentaryTrendData = [
    { month: "Jan", diabetes: 6.2, hipertensao: 6.0 },
    { month: "Fev", diabetes: 6.0, hipertensao: 6.1 },
    { month: "Mar", diabetes: 6.2, hipertensao: 6.0 },
    { month: "Abr", diabetes: 6.0, hipertensao: 5.9 },
    { month: "Mai", diabetes: 6.1, hipertensao: 6.2 },
    { month: "Jun", diabetes: 6.5, hipertensao: 6.5 },
  ];

  const patientsAtRisk: Patient[] = [
    {
      id: "001",
      name: "Paciente 001",
      age: 75,
      factScore: 32,
      sedentaryHours: 8.5,
      status: "Abaixo",
    },
    {
      id: "002",
      name: "Paciente 002",
      age: 68,
      factScore: 41,
      sedentaryHours: 6.2,
      status: "Conforme",
    },
    {
      id: "003",
      name: "Paciente 003",
      age: 82,
      factScore: 28,
      sedentaryHours: 9.1,
      status: "Abaixo",
    },
  ];

  const handleExportReport = () => {
    console.log("Exportando relatório...");
    alert("Relatório exportado com sucesso!");
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate("dashboard");
    }
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{payload[0].name}</p>
          <p className="tooltip-value">{`${payload[0].value}${
            payload[0].name === "hours" ? "h" : ""
          }`}</p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLegend = (props: any) => {
    const { payload } = props;
    return (
      <div className="custom-legend">
        {payload.map((entry: any, index: number) => (
          <div key={`legend-${index}`} className="legend-item">
            <div
              className="legend-color"
              style={{ backgroundColor: entry.color }}
            />
            <span className="legend-text">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="physical-activity-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-left">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft />
            Voltar
          </Button>
        </div>
        
        <div className="header-center">
          <Title level="h1" className="dashboard-title">
            Dashboard Atividade Física e Sedentarismo
          </Title>
        </div>
        
        <div className="header-right">
          <Button onClick={handleExportReport}>
            <Download />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Alert */}
      <div className="dashboard-alert">
        <Alert 
          type="warning" 
          message="3 pacientes com sedentarismo crítico identificados"
        />
      </div>

      {/* Filters */}
      <Card className="filters-card">
        <CardContent className="filters-content">
          <div className="filters-grid">
            <div className="filter-item">
              <label className="filter-label">Período</label>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Selecionar data" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="last-7-days">Últimos 7 dias</SelectItem>
                  <SelectItem value="last-30-days">Últimos 30 dias</SelectItem>
                  <SelectItem value="last-90-days">Últimos 90 dias</SelectItem>
                  <SelectItem value="last-year">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Faixa Etária</label>
              <Select value={selectedAgeRange} onValueChange={setSelectedAgeRange}>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Todas as faixas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="60-70">60-70 anos</SelectItem>
                  <SelectItem value="71-80">71-80 anos</SelectItem>
                  <SelectItem value="81+">81+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Condição de Saúde</label>
              <Select value={selectedCondition} onValueChange={setSelectedCondition}>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Digite para buscar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="diabetes">Diabetes</SelectItem>
                  <SelectItem value="hipertensao">Hipertensão</SelectItem>
                  <SelectItem value="cardiopatia">Cardiopatia</SelectItem>
                  <SelectItem value="artrite">Artrite</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Profissional Responsável</label>
              <Select>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Digite para buscar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dr-silva">Dr. Silva</SelectItem>
                  <SelectItem value="dra-santos">Dra. Santos</SelectItem>
                  <SelectItem value="dr-oliveira">Dr. Oliveira</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="kpis-grid">
        <KPICard
          title="Total de Idosos Avaliados"
          value="245"
          subtitle="+12% em relação ao mês anterior"
          trend="up"
          trendValue="+12%"
          icon={<Users />}
        />
        <KPICard
          title="Conformidade com OMS"
          value="62%"
          subtitle="38% não conformes"
          trend="down"
          trendValue="-5%"
          icon={<Activity />}
        />
        <KPICard
          title="Média de Horas Sedentárias"
          value="6.8h"
          subtitle="+0.3h em relação ao mês anterior"
          trend="up"
          trendValue="+0.3h"
          icon={<Clock />}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Distribuição de Atividade Física */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Distribuição de Atividade Física</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {activityDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={renderCustomLegend} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Horas Sedentárias por Faixa Etária */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Horas Sedentárias por Faixa Etária</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart
                data={sedentaryByAgeData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 12]} />
                <YAxis dataKey="ageRange" type="category" />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="hours" fill="#eab308" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tendência de Sedentarismo */}
      <Card className="chart-card-full">
        <CardHeader>
          <CardTitle>Tendência de Sedentarismo (12 meses)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={sedentaryTrendData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 8]} />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="diabetes"
                stroke="#ef4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Diabetes"
              />
              <Line
                type="monotone"
                dataKey="hipertensao"
                stroke="#14b8a6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Hipertensão"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Tabela de Pacientes em Risco */}
      <Card className="table-card">
        <CardHeader>
          <CardTitle>Lista de Pacientes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Idade</TableHead>
                <TableHead>Pontuação FACT-F</TableHead>
                <TableHead>Horas Sedentárias/dia</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patientsAtRisk.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>{patient.factScore}</TableCell>
                  <TableCell>
                    <div className="sedentary-hours-cell">
                      {patient.sedentaryHours}h
                      {patient.sedentaryHours >= 8.5 && (
                        <AlertTriangle className="risk-icon" size={16} />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        patient.status === "Abaixo" ? "destructive" : "secondary"
                      }
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalActivityDashboard;
