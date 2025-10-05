import React, { useState } from "react";
import {
  ArrowLeft,
  Download,
  Users,
  TrendingUp,
  BarChart3,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { RadioGroup, RadioGroupItem } from "../../components/ui/radio-group";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { DateRangePicker } from "../../components/ui/date-range-picker";
import { cn } from "../../lib/utils";
import Title from "../../components/base/Title";
import KPICard from "../../components/compound/KPICard";
import RadarChart from "../../components/compound/RadarChart/RadarChart";
import LineChart from "../../components/compound/LineChart/LineChart";
import type { DateRange } from "react-day-picker";
import "./IVCFDashboard.css";

interface IVCFDashboardProps {
  testId?: string;
  onNavigate?: (page: string) => void;
}

const IVCFDashboard: React.FC<IVCFDashboardProps> = ({
  testId = "ivcf-20",
  onNavigate,
}) => {
  const [filters, setFilters] = useState({
    period: {
      from: new Date("2024-01-01"),
      to: new Date("2024-02-28"),
    } as DateRange,
    ageRange: "all",
    region: "all",
    administrativeUnit: "all",
    riskClassification: "all",
  });

  // Dados mockados para demonstração
  const mockData = {
    criticalPatients: 2,
    kpis: {
      totalElderly: 245,
      fragilePercentage: 35,
      averageScore: 13.2,
    },
    radarData: [
      { domain: "Idade", score: 15, fullMark: 40 },
      { domain: "Autopercepção", score: 12, fullMark: 40 },
      { domain: "AVD", score: 28, fullMark: 40 },
      { domain: "Cognição", score: 32, fullMark: 40 },
      { domain: "Humor", score: 18, fullMark: 40 },
      { domain: "Mobilidade", score: 25, fullMark: 40 },
      { domain: "Comunicação", score: 20, fullMark: 40 },
      { domain: "Comorbidades", score: 30, fullMark: 40 },
    ],
    lineData: [
      { month: "Jan", Robusto: 40, Risco: 20, Frágil: 15 },
      { month: "Fev", Robusto: 45, Risco: 22, Frágil: 18 },
      { month: "Mar", Robusto: 42, Risco: 25, Frágil: 16 },
      { month: "Abr", Robusto: 38, Risco: 28, Frágil: 20 },
      { month: "Mai", Robusto: 35, Risco: 30, Frágil: 25 },
      { month: "Jun", Robusto: 32, Risco: 32, Frágil: 28 },
    ],
    patients: [
      {
        name: "A.M.S",
        age: 75,
        score: 16,
        classification: "Frágil",
        comorbidities: "HAS, DM2",
        lastEvaluation: "15/02/2024",
        isCritical: true,
      },
      {
        name: "J.R.P",
        age: 68,
        score: 12,
        classification: "Em risco",
        comorbidities: "HAS",
        lastEvaluation: "14/02/2024",
        isCritical: false,
      },
      {
        name: "M.C.L",
        age: 82,
        score: 18,
        classification: "Frágil",
        comorbidities: "HAS, Artrite",
        lastEvaluation: "13/02/2024",
        isCritical: true,
      },
    ],
  };

  const filterOptions = {
    ageRange: [
      { value: "all", label: "Todas" },
      { value: "60-70", label: "60-70 anos" },
      { value: "71-80", label: "71-80 anos" },
      { value: "81+", label: "81+ anos" },
    ],
    region: [
      { value: "all", label: "Todas" },
      { value: "centro", label: "Centro" },
      { value: "norte", label: "Norte" },
      { value: "sul", label: "Sul" },
      { value: "leste", label: "Leste" },
      { value: "oeste", label: "Oeste" },
    ],
    administrativeUnit: [
      { value: "all", label: "Todas" },
      { value: "unidade1", label: "Unidade 1" },
      { value: "unidade2", label: "Unidade 2" },
      { value: "unidade3", label: "Unidade 3" },
    ],
    riskClassification: [
      { value: "all", label: "Todos" },
      { value: "fragile", label: "Frágil" },
      { value: "robust", label: "Robusto" },
      { value: "risk", label: "Em risco" },
    ],
  };

  const getBadgeVariant = (classification: string) => {
    switch (classification.toLowerCase()) {
      case "frágil":
        return "destructive";
      case "em risco":
        return "secondary";
      case "robusto":
        return "default";
      default:
        return "outline";
    }
  };

  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleExportReport = () => {
    console.log("Exportando relatório...");
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate("home");
    } else {
      console.log("Voltando para home...");
    }
  };

  return (
    <div className="ivcf-dashboard">
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
            Dashboard {testId.toUpperCase()}
          </Title>
        </div>
        
        <div className="header-right">
          <Button onClick={handleExportReport}>
            <Download />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Alerta de Pacientes Críticos */}
      {mockData.criticalPatients > 0 && (
        <div className="dashboard-alert">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Pacientes em Estado Crítico</AlertTitle>
            <AlertDescription>
              {mockData.criticalPatients} pacientes em estado crítico
              identificados. Recomenda-se atenção imediata para estes casos.
            </AlertDescription>
          </Alert>
        </div>
      )}

      {/* Barra de Filtros */}
      <Card className="filters-card">
        <CardContent className="filters-content">
          <div className="filters-grid">
            <div className="filter-item">
              <label className="filter-label">Período</label>
                <DateRangePicker
                  value={filters.period}
                  onChange={(range) => handleFilterChange("period", range)}
                  placeholder="Selecionar período"
                  className="w-full"
                />
              </div>

            <div className="filter-item">
              <label className="filter-label">Faixa Etária</label>
              <Select
                value={filters.ageRange}
                onValueChange={(value) =>
                  handleFilterChange("ageRange", value)
                }
              >
                <SelectTrigger className="filter-select">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.ageRange.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="filter-item">
              <label className="filter-label">Região/Bairro</label>
              <Select
                value={filters.region}
                onValueChange={(value) => handleFilterChange("region", value)}
              >
                <SelectTrigger className="filter-select">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.region.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="filter-item">
              <label className="filter-label">
                Unidade Administrativa
              </label>
              <Select
                value={filters.administrativeUnit}
                onValueChange={(value) =>
                  handleFilterChange("administrativeUnit", value)
                }
              >
                <SelectTrigger className="filter-select">
                    <SelectValue placeholder="Todas" />
                  </SelectTrigger>
                  <SelectContent>
                    {filterOptions.administrativeUnit.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            <div className="filter-item filter-item-full">
              <label className="filter-label">
                Classificação de Risco
              </label>
              <RadioGroup
                value={filters.riskClassification}
                onValueChange={(value) =>
                  handleFilterChange("riskClassification", value)
                }
                className="radio-group-horizontal"
              >
                <div className="radio-options">
                  {filterOptions.riskClassification.map((option) => (
                    <div
                      key={option.value}
                      className="radio-option"
                    >
                      <RadioGroupItem
                        value={option.value}
                        id={option.value}
                      />
                      <label
                        htmlFor={option.value}
                        className="radio-label"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* KPIs */}
      <div className="kpis-grid">
        <KPICard
          title="Total de Idosos Avaliados"
          value={mockData.kpis.totalElderly}
          icon={<Users />}
        />
        <KPICard
          title="Percentual de Idosos Frágeis"
          value={`${mockData.kpis.fragilePercentage}%`}
          trend="up"
          icon={<TrendingUp />}
        />
        <KPICard
          title="Média de Pontuação por Região"
          value={mockData.kpis.averageScore}
          icon={<BarChart3 />}
        />
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Distribuição por Domínio</CardTitle>
          </CardHeader>
          <CardContent>
            <RadarChart data={mockData.radarData} height={350} />
          </CardContent>
        </Card>

        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Evolução Mensal por Categoria</CardTitle>
          </CardHeader>
          <CardContent>
            <LineChart
              data={mockData.lineData}
              height={350}
              lines={[
                { dataKey: "Robusto", name: "Robusto", color: "#f97316" },
                { dataKey: "Risco", name: "Risco", color: "#06b6d4" },
                { dataKey: "Frágil", name: "Frágil", color: "#8b5cf6" },
              ]}
            />
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
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead>Comorbidades</TableHead>
                  <TableHead>Última Avaliação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockData.patients.map((patient, index) => (
                  <TableRow
                    key={index}
                    className={cn(patient.isCritical && "bg-red-50")}
                  >
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {patient.isCritical && (
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                        )}
                        Paciente {patient.name}
                      </div>
                    </TableCell>
                    <TableCell>{patient.age}</TableCell>
                    <TableCell>{patient.score}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(patient.classification)}>
                        {patient.classification}
                      </Badge>
                    </TableCell>
                    <TableCell>{patient.comorbidities}</TableCell>
                    <TableCell>{patient.lastEvaluation}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default IVCFDashboard;
