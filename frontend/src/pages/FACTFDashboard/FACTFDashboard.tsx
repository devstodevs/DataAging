import React, { useState } from "react";
import { ArrowLeft, Download, Users, Activity, TrendingUp } from "lucide-react";
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
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import Title from "../../components/base/Title";
import KPICard from "../../components/compound/KPICard";
import Alert from "../../components/base/Alert";
import "./FACTFDashboard.css";

interface Patient {
  id: string;
  name: string;
  age: number;
  lastScore: number;
  status: "Leve" | "Grave";
  date: string;
  domainScores: {
    fisico: number;
    social: number;
    funcional: number;
    emocional: number;
  };
}

interface FACTFDashboardProps {
  onNavigate?: (page: string) => void;
}

const FACTFDashboard: React.FC<FACTFDashboardProps> = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("1");

  // Dados mockados
  const trendData = [
    { month: "Jan", escoreTotal: 35, subscalaFadiga: 40 },
    { month: "Fev", escoreTotal: 38, subscalaFadiga: 42 },
    { month: "Mar", escoreTotal: 42, subscalaFadiga: 45 },
    { month: "Abr", escoreTotal: 40, subscalaFadiga: 43 },
    { month: "Mai", escoreTotal: 45, subscalaFadiga: 48 },
    { month: "Jun", escoreTotal: 48, subscalaFadiga: 50 },
    { month: "Jul", escoreTotal: 50, subscalaFadiga: 52 },
    { month: "Ago", escoreTotal: 52, subscalaFadiga: 54 },
    { month: "Set", escoreTotal: 51, subscalaFadiga: 53 },
    { month: "Out", escoreTotal: 53, subscalaFadiga: 55 },
    { month: "Nov", escoreTotal: 55, subscalaFadiga: 57 },
    { month: "Dez", escoreTotal: 54, subscalaFadiga: 56 },
  ];

  const distributionData = [
    {
      comorbidade: "Diabetes",
      semFadiga: 25,
      fadigaLeve: 50,
      fadigaGrave: 25,
    },
    {
      comorbidade: "Hipertensão",
      semFadiga: 20,
      fadigaLeve: 55,
      fadigaGrave: 25,
    },
    {
      comorbidade: "Artrite",
      semFadiga: 15,
      fadigaLeve: 60,
      fadigaGrave: 25,
    },
  ];

  const patients: Patient[] = [
    {
      id: "1",
      name: "Paciente #1",
      age: 66,
      lastScore: 32,
      status: "Leve",
      date: "1/12/2023",
      domainScores: { fisico: 75, social: 60, funcional: 80, emocional: 70 },
    },
    {
      id: "2",
      name: "Paciente #2",
      age: 67,
      lastScore: 27,
      status: "Grave",
      date: "12/10/2023",
      domainScores: { fisico: 45, social: 50, funcional: 55, emocional: 48 },
    },
    {
      id: "3",
      name: "Paciente #3",
      age: 68,
      lastScore: 34,
      status: "Leve",
      date: "13/12/2023",
      domainScores: { fisico: 78, social: 65, funcional: 82, emocional: 72 },
    },
    {
      id: "4",
      name: "Paciente #4",
      age: 69,
      lastScore: 29,
      status: "Grave",
      date: "14/12/2023",
      domainScores: { fisico: 50, social: 48, funcional: 52, emocional: 45 },
    },
    {
      id: "5",
      name: "Paciente #5",
      age: 70,
      lastScore: 30,
      status: "Leve",
      date: "15/12/2023",
      domainScores: { fisico: 72, social: 68, funcional: 75, emocional: 70 },
    },
  ];

  const regionalAverage = {
    fisico: 65,
    social: 58,
    funcional: 70,
    emocional: 62,
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId) || patients[0];

  const radarData = [
    {
      domain: "Físico",
      paciente: selectedPatient.domainScores.fisico,
      mediaRegional: regionalAverage.fisico,
      fullMark: 100,
    },
    {
      domain: "Social",
      paciente: selectedPatient.domainScores.social,
      mediaRegional: regionalAverage.social,
      fullMark: 100,
    },
    {
      domain: "Funcional",
      paciente: selectedPatient.domainScores.funcional,
      mediaRegional: regionalAverage.funcional,
      fullMark: 100,
    },
    {
      domain: "Emocional",
      paciente: selectedPatient.domainScores.emocional,
      mediaRegional: regionalAverage.emocional,
      fullMark: 100,
    },
  ];

  const handleExportReport = () => {
    console.log("Exportando relatório FACT-F...");
    alert("Relatório exportado com sucesso!");
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate("home");
    }
  };

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatientId(patientId);
  };

  return (
    <div className="factf-dashboard">
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
            Dashboard FACT-F
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
          message="2 pacientes com vulnerabilidade crítica identificados"
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
          icon={<Users />}
        />
        <KPICard
          title="Fadiga Grave"
          value="22%"
          subtitle="54 pacientes com estado crítico"
          trend="up"
          trendValue="+3%"
          icon={<Activity />}
        />
        <KPICard
          title="Média de Escores"
          value="35.8"
          subtitle="Média geral dos domínios"
          icon={<TrendingUp />}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Tendência Temporal */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Tendência Temporal</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 140]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="escoreTotal"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Escore Total"
                />
                <Line
                  type="monotone"
                  dataKey="subscalaFadiga"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Subescala Fadiga"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Distribuição por Nível de Fadiga */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Distribuição por Nível de Fadiga</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={distributionData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="comorbidade" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="semFadiga"
                  stackId="a"
                  fill="#ef4444"
                  name="Sem Fadiga"
                />
                <Bar
                  dataKey="fadigaLeve"
                  stackId="a"
                  fill="#14b8a6"
                  name="Fadiga Leve"
                />
                <Bar
                  dataKey="fadigaGrave"
                  stackId="a"
                  fill="#1f2937"
                  name="Fadiga Grave"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pacientes */}
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
                <TableHead>Última Pontuação</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient.id)}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedPatientId === patient.id && "selected-row"
                  )}
                >
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        patient.lastScore < 30 && "text-red-600"
                      )}
                    >
                      {patient.lastScore}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={patient.status === "Grave" ? "destructive" : "default"}
                    >
                      {patient.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{patient.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Análise de Domínios */}
      <Card className="radar-card">
        <CardHeader>
          <CardTitle>
            Análise de Domínios - {selectedPatient.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <RadarChart data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="domain" />
              <PolarRadiusAxis domain={[0, 100]} />
              <Tooltip />
              <Legend />
              <Radar
                name="Paciente"
                dataKey="paciente"
                stroke="#ef4444"
                fill="#ef4444"
                fillOpacity={0.6}
              />
              <Radar
                name="Média Regional"
                dataKey="mediaRegional"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default FACTFDashboard;
