import React, { useState, useEffect } from "react";
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
import { useFACTFData } from "../../hooks/factf";
import { getClassificationVariant, formatDateForDisplay, getFatigueChartColors } from "../../utils/factfHelpers";
import LoadingDashboard from "../../components/factf/LoadingDashboard/LoadingDashboard";
import ErrorDashboard from "../../components/factf/ErrorDashboard/ErrorDashboard";
import "./FACTFDashboard.css";

interface FACTFDashboardProps {
  onNavigate?: (page: string) => void;
}

const FACTFDashboard: React.FC<FACTFDashboardProps> = ({ onNavigate }) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("");
  const [selectedCondition, setSelectedCondition] = useState<string>("");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");

  // Hook para dados FACT-F
  const {
    summary,
    criticalPatients,
    fatigueDistribution,
    monthlyEvolution,
    domainDistribution,
    allPatients,
    loading,
    errors,
    isLoading,
    hasErrors,
    getProcessedSummary,
    getProcessedCriticalPatients,
    getProcessedFatigueDistribution,
    getProcessedMonthlyEvolution,
    getProcessedDomainDistribution,
    getLineChartData,
    getBarChartData,
    getRadarChartData,
    refetchDashboard
  } = useFACTFData();

  // Atualizar dados quando filtros mudarem
  useEffect(() => {
    // Por enquanto, apenas recarrega os dados
    // Futuramente, pode aplicar filtros específicos
    refetchDashboard();
  }, [selectedPeriod, selectedAgeRange, selectedCondition]);

  // Processar dados para os gráficos
  const processedSummary = getProcessedSummary();
  const processedCriticalPatients = getProcessedCriticalPatients();
  const trendData = getLineChartData();
  const distributionData = getBarChartData();
  const radarData = getRadarChartData();

  // Usar dados reais dos pacientes
  const patients = allPatients?.patients || [];
  const selectedPatient = selectedPatientId 
    ? patients.find((p) => p.id.toString() === selectedPatientId) 
    : patients[0];

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

  // Show loading state
  if (isLoading && !summary) {
    return <LoadingDashboard />;
  }

  // Show error state
  if (hasErrors && !summary) {
    return (
      <ErrorDashboard
        error="Não foi possível carregar os dados do dashboard FACT-F"
        onRetry={refetchDashboard}
        onGoHome={() => onNavigate?.("home")}
      />
    );
  }

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
      {criticalPatients && criticalPatients.count > 0 && (
        <div className="dashboard-alert">
          <Alert
            type="warning"
            message={`${criticalPatients.count} paciente(s) com fadiga crítica identificado(s)`}
          />
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="loading-state">
          <div className="loading-spinner" />
          <p>Carregando dados do dashboard...</p>
        </div>
      )}

      {/* Error State */}
      {hasErrors && (
        <div className="error-state">
          <Alert
            type="error"
            message="Erro ao carregar dados do dashboard. Tente novamente."
          />
        </div>
      )}

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
      {!isLoading && processedSummary && (
        <div className="kpis-grid">
          <KPICard
            title="Total de Pacientes Avaliados"
            value={processedSummary.totalPatients?.toString() || "0"}
            subtitle={`${processedSummary.monthlyGrowth || "0%"} em relação ao mês anterior`}
            icon={<Users />}
          />
          <KPICard
            title="Fadiga Grave"
            value={processedSummary.severeFatiguePercentage || "0%"}
            subtitle={`${processedSummary.criticalPatientsCount || 0} pacientes com estado crítico`}
            trend="up"
            trendValue={processedSummary.monthlyGrowth || "0%"}
            icon={<Activity />}
          />
          <KPICard
            title="Média de Escores FACT-F"
            value={processedSummary.averageTotalScore || "0.0"}
            subtitle="Pontuação média total (0-136)"
            icon={<TrendingUp />}
          />
        </div>
      )}

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
                  fill="#10b981"
                  name="Sem Fadiga"
                />
                <Bar
                  dataKey="fadigaLeve"
                  stackId="a"
                  fill="#f59e0b"
                  name="Fadiga Leve"
                />
                <Bar
                  dataKey="fadigaGrave"
                  stackId="a"
                  fill="#ef4444"
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
              {patients.slice(0, 10).map((patient) => (
                <TableRow
                  key={patient.id}
                  onClick={() => handlePatientSelect(patient.id.toString())}
                  className={cn(
                    "cursor-pointer hover:bg-gray-50 transition-colors",
                    selectedPatientId === patient.id.toString() && "selected-row"
                  )}
                >
                  <TableCell className="font-medium">{patient.name}</TableCell>
                  <TableCell>{patient.age}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "font-semibold",
                        patient.last_score && patient.last_score < 60 && "text-red-600"
                      )}
                    >
                      {patient.last_score?.toFixed(1) || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell>
                    {patient.classification ? (
                      <Badge variant={getClassificationVariant(patient.classification)}>
                        {patient.classification}
                      </Badge>
                    ) : (
                      <span className="text-gray-500">Sem avaliação</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {patient.evaluation_date 
                      ? formatDateForDisplay(patient.evaluation_date)
                      : "N/A"
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Análise de Domínios */}
      {domainDistribution && radarData.length > 0 && (
        <Card className="radar-card">
          <CardHeader>
            <CardTitle>
              Distribuição por Domínios FACT-F
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
                  name="Média dos Pacientes"
                  dataKey="paciente"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Pontuação Máxima"
                  dataKey="mediaRegional"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.3}
                />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FACTFDashboard;
