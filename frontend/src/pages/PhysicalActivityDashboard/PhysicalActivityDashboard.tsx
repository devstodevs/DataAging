import React, { useState } from "react";
import { ArrowLeft, Download, Users, Activity, Clock, AlertTriangle, RefreshCw } from "lucide-react";
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
import { cn } from "@/lib/utils";
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
import { usePhysicalActivityData } from "../../hooks/physicalActivity";
import { LoadingDashboard, ErrorDashboard } from "../../components/physicalActivity";
import { PhysicalActivityApiService } from "../../services/physicalActivityApi";
import {
  formatDate,
  formatSedentaryHours,
  formatPercentage,
  getBadgeVariant,
  getComplianceBadgeVariant,
  prepareDataForExport,
  calculateSummaryStats,
  filterPatients,
} from "../../utils/physicalActivityHelpers";
import "./PhysicalActivityDashboard.css";

interface PhysicalActivityDashboardProps {
  onNavigate?: (page: string) => void;
}

const PhysicalActivityDashboard: React.FC<PhysicalActivityDashboardProps> = ({
  onNavigate,
}) => {
  const [selectedPeriod, setSelectedPeriod] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState<string>("all");
  const [selectedRiskLevel, setSelectedRiskLevel] = useState<string>("all");
  const [selectedCompliance, setSelectedCompliance] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  // Hook para dados de atividade física
  const {
    data: {
      summary,
      criticalPatients,
      activityDistribution,
      sedentaryByAge,
      sedentaryTrend,
      whoCompliance,
      allPatients,
    },
    loading,
    error,
    refreshData,
  } = usePhysicalActivityData();

  // Dados processados para os gráficos
  const donutData = activityDistribution ? PhysicalActivityApiService.formatActivityDataForChart(activityDistribution) : [];
  const barData = sedentaryByAge || [];
  const lineData = sedentaryTrend ? PhysicalActivityApiService.formatSedentaryTrendForChart(sedentaryTrend) : [];

  // Filtrar pacientes baseado nos filtros selecionados
  const filteredPatients = filterPatients(allPatients || [], {
    ageRange: selectedAgeRange,
    riskLevel: selectedRiskLevel,
    compliance: selectedCompliance,
  });

  // Estatísticas dos pacientes filtrados
  const filteredStats = calculateSummaryStats(filteredPatients);

  // Paginação
  const totalPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedPatients = filteredPatients.slice(startIndex, endIndex);

  // Reset page when filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [selectedAgeRange, selectedRiskLevel, selectedCompliance]);

  const handleExportReport = () => {
    if (filteredPatients.length > 0) {
      const exportData = filteredPatients.map(patient => ({
        Nome: patient.nome_completo,
        CPF: patient.cpf,
        Idade: patient.idade,
        Bairro: patient.bairro,
        'Horas Sedentárias/dia': patient.sedentary_hours_per_day || 'N/A',
        'Nível de Risco': patient.sedentary_risk_level || 'N/A',
        'Conformidade OMS': patient.who_compliance ? 'Sim' : 'Não',
        'Última Avaliação': patient.last_evaluation_date ? formatDate(patient.last_evaluation_date) : 'N/A',
      }));

      prepareDataForExport(exportData, `atividade-fisica-dashboard-${new Date().toISOString().split('T')[0]}`);
    }
  };

  const handleRefresh = () => {
    refreshData();
  };

  const handleBack = () => {
    if (onNavigate) {
      onNavigate("home");
    }
  };

  interface TooltipPayload {
    name: string;
    dataKey: string;
    value: number;
  }

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: TooltipPayload[] }) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{data.name}</p>
          <p className="tooltip-value">
            {data.dataKey === 'average_sedentary_hours'
              ? formatSedentaryHours(data.value)
              : `${data.value}min/semana`
            }
          </p>
        </div>
      );
    }
    return null;
  };

  interface LegendPayload {
    color: string;
    value: string;
  }

  const renderCustomLegend = (props: { payload?: LegendPayload[] }) => {
    const { payload } = props;
    if (!payload) return null;
    return (
      <div className="custom-legend">
        {payload.map((entry, index: number) => (
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

  // Show loading state
  if (loading && !summary) {
    return <LoadingDashboard />;
  }

  // Show error state
  if (error && !summary) {
    return (
      <ErrorDashboard
        error={error}
        onRetry={refreshData}
        onGoHome={() => onNavigate?.("home")}
      />
    );
  }

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
          <Button
            className="mr-4"
            variant="outline"
            onClick={handleRefresh}
            disabled={loading}
          >
            <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            Atualizar
          </Button>
          <Button
            onClick={handleExportReport}
            disabled={filteredPatients.length === 0}
          >
            <Download />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Alert de Pacientes Críticos */}
      {criticalPatients && criticalPatients.length > 0 && (
        <div className="dashboard-alert">
          <Alert
            type="warning"
            message={`${criticalPatients.length} paciente(s) com sedentarismo crítico identificado(s)`}
          />
        </div>
      )}

      {/* Alert de Erros */}
      {error && (
        <div className="dashboard-alert">
          <Alert
            type="error"
            message="Erro ao carregar alguns dados. Tente atualizar a página."
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
                  <SelectItem value="all">Todas as faixas</SelectItem>
                  <SelectItem value="60-70">60-70 anos</SelectItem>
                  <SelectItem value="71-80">71-80 anos</SelectItem>
                  <SelectItem value="81+">81+ anos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Nível de Risco</label>
              <Select value={selectedRiskLevel} onValueChange={setSelectedRiskLevel}>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Todos os níveis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os níveis</SelectItem>
                  <SelectItem value="Baixo">Baixo</SelectItem>
                  <SelectItem value="Moderado">Moderado</SelectItem>
                  <SelectItem value="Alto">Alto</SelectItem>
                  <SelectItem value="Crítico">Crítico</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="filter-item">
              <label className="filter-label">Conformidade OMS</label>
              <Select value={selectedCompliance} onValueChange={setSelectedCompliance}>
                <SelectTrigger className="filter-select">
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="compliant">Conforme</SelectItem>
                  <SelectItem value="non-compliant">Não Conforme</SelectItem>
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
          value={loading ? "..." : (summary?.total_patients_evaluated?.toString() || "0")}
          subtitle={`${filteredStats.totalPatients} pacientes filtrados`}
          icon={<Users />}
        />
        <KPICard
          title="Conformidade com OMS"
          value={loading ? "..." : (whoCompliance ? formatPercentage(whoCompliance.compliant.percentage) : "0%")}
          subtitle={whoCompliance ? `${whoCompliance.non_compliant.count} não conformes` : "Carregando..."}
          trend={whoCompliance && whoCompliance.compliant.percentage >= 50 ? "up" : "down"}
          icon={<Activity />}
        />
        <KPICard
          title="Média de Horas Sedentárias"
          value={loading ? "..." : (summary ? formatSedentaryHours(summary.average_sedentary_hours) : "0h")}
          subtitle={`${filteredStats.criticalCount} pacientes críticos`}
          trend={summary && summary.average_sedentary_hours > 8 ? "up" : "down"}
          icon={<Clock />}
        />
      </div>

      {/* Charts */}
      <div className="charts-grid">
        {/* Distribuição de Atividade Física */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Distribuição de Atividade Física</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Minutos semanais médios por intensidade
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : donutData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={donutData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {donutData.map((entry: { color: string }, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                  <Legend content={renderCustomLegend} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        {/* Horas Sedentárias por Faixa Etária */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Horas Sedentárias por Faixa Etária</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Média de horas sedentárias por dia
            </p>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-[300px]">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : barData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={barData}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 12]} />
                  <YAxis dataKey="age_range" type="category" />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="average_sedentary_hours" fill="#eab308" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-[300px] text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Tendência de Sedentarismo */}
      <Card className="chart-card-full">
        <CardHeader>
          <CardTitle>Tendência de Sedentarismo (12 meses)</CardTitle>
          <p className="text-sm text-gray-600 mt-1">
            Evolução das horas sedentárias por condição de saúde
          </p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-[300px]">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : lineData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={lineData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis domain={[0, 12]} />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="diabetics"
                  stroke="#ef4444"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Diabéticos"
                />
                <Line
                  type="monotone"
                  dataKey="hypertensives"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  name="Hipertensos"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-gray-500">
              Nenhum dado disponível
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Pacientes */}
      <Card className="table-card">
        <CardHeader>
          <CardTitle>
            Lista de Pacientes
            {filteredPatients.length > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredPatients.length} pacientes)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredPatients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Horas Sedentárias/dia</TableHead>
                  <TableHead>Nível de Risco</TableHead>
                  <TableHead>Conformidade OMS</TableHead>
                  <TableHead>Última Avaliação</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedPatients.map((patient) => {
                  const isCritical = patient.sedentary_risk_level === 'Crítico' || (patient.sedentary_hours_per_day && patient.sedentary_hours_per_day >= 10);
                  return (
                    <TableRow
                      key={patient.id}
                      className={isCritical ? "bg-red-50" : ""}
                    >
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {isCritical && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                          {patient.nome_completo}
                        </div>
                      </TableCell>
                      <TableCell>{patient.idade}</TableCell>
                      <TableCell>{patient.bairro}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "font-medium",
                          patient.sedentary_hours_per_day && patient.sedentary_hours_per_day >= 10 && "text-red-600"
                        )}>
                          {patient.sedentary_hours_per_day
                            ? formatSedentaryHours(patient.sedentary_hours_per_day)
                            : 'N/A'
                          }
                        </span>
                      </TableCell>
                      <TableCell>
                        {patient.sedentary_risk_level ? (
                          <Badge variant={getBadgeVariant(patient.sedentary_risk_level)}>
                            {patient.sedentary_risk_level}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.who_compliance !== undefined ? (
                          <Badge variant={getComplianceBadgeVariant(patient.who_compliance)}>
                            {patient.who_compliance ? 'Conforme' : 'Não Conforme'}
                          </Badge>
                        ) : (
                          <span className="text-gray-500">N/A</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {patient.last_evaluation_date
                          ? formatDate(patient.last_evaluation_date)
                          : 'Sem avaliação'
                        }
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex items-center justify-center py-8 text-gray-500">
              Nenhum paciente encontrado
            </div>
          )}
          
          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <div className="text-sm text-gray-600">
                Mostrando {startIndex + 1} a {Math.min(endIndex, filteredPatients.length)} de {filteredPatients.length} pacientes
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      // Show first page, last page, current page, and pages around current
                      return page === 1 || 
                             page === totalPages || 
                             Math.abs(page - currentPage) <= 1;
                    })
                    .map((page, index, array) => {
                      // Add ellipsis if there's a gap
                      const prevPage = array[index - 1];
                      const showEllipsis = prevPage && page - prevPage > 1;
                      
                      return (
                        <React.Fragment key={page}>
                          {showEllipsis && (
                            <span className="px-2 text-gray-400">...</span>
                          )}
                          <Button
                            variant={currentPage === page ? "default" : "outline"}
                            size="sm"
                            onClick={() => setCurrentPage(page)}
                            className="min-w-[40px]"
                          >
                            {page}
                          </Button>
                        </React.Fragment>
                      );
                    })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PhysicalActivityDashboard;
