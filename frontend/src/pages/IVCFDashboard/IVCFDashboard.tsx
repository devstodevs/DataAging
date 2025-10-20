import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  ArrowLeft,
  Download,
  Users,
  TrendingUp,
  BarChart3,
  AlertTriangle,
  RefreshCw,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
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
import Alert from "../../components/base/Alert";
import RadarChart from "../../components/compound/RadarChart/RadarChart";
import LineChart from "../../components/compound/LineChart/LineChart";
import type { DateRange } from "react-day-picker";
import { useIVCFData } from "../../hooks/ivcf";
import { type IVCFFilters } from "../../types/ivcf";
import {
  formatDate,
  formatDateForAPI,
  getBadgeVariant,
  formatScore,
  formatPercentage,
  prepareDataForExport,
} from "../../utils/ivcfHelpers";
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
      to: new Date("2024-12-31"),
    } as DateRange,
    ageRange: "all",
    region: "all",
    administrativeUnit: "all",
    riskClassification: "all",
  });

  const [isInitialLoad, setIsInitialLoad] = useState(true);

  // Hook para gerenciar dados do IVCF
  const {
    summary,
    criticalPatients,
    allPatients,
    fragilePercentage,
    curitibaRegions,
    loading,
    refetchAll,
    refetchFilteredData,
    getRadarChartData,
    getLineChartData,
    isAnyLoading,
    hasAnyError,
  } = useIVCFData();

  // Converter filtros para formato da API
  const apiFilters = useMemo((): IVCFFilters => {
    const result: IVCFFilters = {};

    if (filters.period.from) {
      result.period_from = formatDateForAPI(filters.period.from);
    }
    if (filters.period.to) {
      result.period_to = formatDateForAPI(filters.period.to);
    }
    if (filters.ageRange !== "all") {
      result.age_range = filters.ageRange as IVCFFilters['age_range'];
    }
    if (filters.region !== "all") {
      result.region = filters.region;
    }
    if (filters.riskClassification !== "all") {
      const classificationMap: Record<string, IVCFFilters['classification']> = {
        fragile: "Frágil",
        risk: "Em Risco",
        robust: "Robusto",
      };
      result.classification = classificationMap[filters.riskClassification];
    }

    return result;
  }, [filters]);

  // Função para atualizar dados quando filtros mudam
  const updateFilteredData = useCallback((apiFilters: IVCFFilters) => {
    refetchFilteredData(apiFilters);
  }, [refetchFilteredData]);

  // Opções de filtros
  const filterOptions = {
    ageRange: [
      { value: "all", label: "Todas" },
      { value: "60-70", label: "60-70 anos" },
      { value: "71-80", label: "71-80 anos" },
      { value: "81+", label: "81+ anos" },
    ],
    region: [
      { value: "all", label: "Todas" },
      ...curitibaRegions.map(region => ({
        value: region,
        label: region,
      })),
    ],
    riskClassification: [
      { value: "all", label: "Todos" },
      { value: "fragile", label: "Frágil" },
      { value: "risk", label: "Em Risco" },
      { value: "robust", label: "Robusto" },
    ],
  };

  // Carregamento inicial dos dados filtrados
  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        // Carrega os dados filtrados com os filtros iniciais
        refetchFilteredData(apiFilters);
        setIsInitialLoad(false);
      }, 500); // Aguarda um pouco após o carregamento inicial
      return () => clearTimeout(timer);
    }
  }, [isInitialLoad, refetchFilteredData, apiFilters]);

  // Efeito para atualizar dados quando filtros mudam (apenas após carregamento inicial)
  useEffect(() => {
    if (!isInitialLoad) {
      const timeoutId = setTimeout(() => {
        updateFilteredData(apiFilters);
      }, 500);

      return () => clearTimeout(timeoutId);
    }
  }, [apiFilters, updateFilteredData, isInitialLoad]);

  // Dados processados para exibição (memoizados para evitar recálculos)
  const radarData = useMemo(() => getRadarChartData(), [getRadarChartData]);
  const lineData = useMemo(() => getLineChartData(), [getLineChartData]);
  const criticalPatientsCount = criticalPatients?.total_critical || 0;
  const patientsList = allPatients?.critical_patients || [];
  const totalPatients = allPatients?.total_critical || 0;

  // Handlers
  const handleFilterChange = (filterType: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterType]: value,
    }));
  };

  const handleExportReport = () => {
    if (patientsList.length > 0) {
      const exportData = patientsList.map(patient => ({
        Nome: patient.nome_completo,
        Idade: patient.idade,
        Pontuação: patient.pontuacao_total,
        Classificação: patient.classificacao,
        Comorbidades: patient.comorbidades,
        'Última Avaliação': formatDate(patient.data_ultima_avaliacao),
        Bairro: patient.bairro,
        'Unidade de Saúde': patient.unidade_saude,
      }));

      prepareDataForExport(exportData, `ivcf-dashboard-${new Date().toISOString().split('T')[0]}`);
    }
  };

  const handleRefresh = () => {
    refetchAll(apiFilters);
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
          <Button
            className="mr-4"
            variant="outline"
            onClick={handleRefresh}
            disabled={isAnyLoading}
          >
            <RefreshCw className={cn("h-4 w-4", isAnyLoading && "animate-spin")} />
            Atualizar
          </Button>
          <Button
            onClick={handleExportReport}
            disabled={patientsList.length === 0}
          >
            <Download />
            Exportar Relatório
          </Button>
        </div>
      </div>

      {/* Alerta de Pacientes Críticos */}
      {criticalPatientsCount > 0 && (
        <div className="dashboard-alert">
          <Alert
            type="error"
            message={`${criticalPatientsCount} pacientes em estado crítico identificados`}
          />
        </div>
      )}

      {/* Alerta de Erros */}
      {hasAnyError && (
        <div className="dashboard-alert">
          <Alert
            type="error"
            message="Erro ao carregar alguns dados. Tente atualizar a página."
          />
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
          value={loading.summary ? "..." : (summary?.total_elderly || 0)}
          icon={<Users />}
        />
        <KPICard
          title="Percentual de Idosos Frágeis"
          value={loading.fragilePercentage ? "..." : (fragilePercentage?.percentage_data ? formatPercentage(fragilePercentage.percentage_data.fragile_percentage) : "0%")}
          trend={fragilePercentage?.percentage_data && fragilePercentage.percentage_data.fragile_percentage > 30 ? "up" : "down"}
          icon={<TrendingUp />}
        />
        <KPICard
          title="Média de Pontuação IVCF-20"
          value={loading.summary ? "..." : (summary ? formatScore(summary.average_score) : "0")}
          icon={<BarChart3 />}
        />
      </div>

      {/* Gráficos */}
      <div className="charts-grid">
        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Distribuição da Média de Pontuação por Domínio</CardTitle>
            <p className="text-sm text-gray-600 mt-1">
              Escala: 2 (melhor condição) a 8 (pior condição)
            </p>
          </CardHeader>
          <CardContent>
            {loading.domainDistribution ? (
              <div className="flex items-center justify-center h-[350px]">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : radarData.length > 0 ? (
              <RadarChart
                data={radarData}
                height={350}
                domain={[2, 8]}
              />
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="chart-card">
          <CardHeader>
            <CardTitle>Evolução Mensal por Categoria (Últimos 6 meses)</CardTitle>
          </CardHeader>
          <CardContent>
            {loading.monthlyEvolution ? (
              <div className="flex items-center justify-center h-[350px]">
                <RefreshCw className="h-8 w-8 animate-spin" />
              </div>
            ) : lineData.length > 0 ? (
              <LineChart
                data={lineData}
                height={350}
                lines={[
                  { dataKey: "Robusto", name: "Robusto", color: "#22c55e" },
                  { dataKey: "Risco", name: "Em Risco", color: "#f59e0b" },
                  { dataKey: "Frágil", name: "Frágil", color: "#ef4444" },
                ]}
              />
            ) : (
              <div className="flex items-center justify-center h-[350px] text-gray-500">
                Nenhum dado disponível
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Lista de Pacientes */}
      <Card className="table-card">
        <CardHeader>
          <CardTitle>
            Lista de Pacientes
            {totalPatients > 0 && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({totalPatients} pacientes)
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading.allPatients ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin" />
            </div>
          ) : patientsList.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Idade</TableHead>
                  <TableHead>Pontuação</TableHead>
                  <TableHead>Classificação</TableHead>
                  <TableHead>Comorbidades</TableHead>
                  <TableHead>Última Avaliação</TableHead>
                  <TableHead>Bairro</TableHead>
                  <TableHead>Unidade de Saúde</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patientsList.map((patient) => {
                  const isCritical = patient.classificacao === "Frágil" && patient.pontuacao_total >= 20;
                  return (
                    <TableRow
                      key={patient.patient_id}
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
                      <TableCell>{patient.pontuacao_total}</TableCell>
                      <TableCell>
                        <Badge variant={getBadgeVariant(patient.classificacao)}>
                          {patient.classificacao}
                        </Badge>
                      </TableCell>
                      <TableCell>{patient.comorbidades || "Não informado"}</TableCell>
                      <TableCell>{formatDate(patient.data_ultima_avaliacao)}</TableCell>
                      <TableCell>{patient.bairro}</TableCell>
                      <TableCell>{patient.unidade_saude}</TableCell>
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
        </CardContent>
      </Card>
    </div>
  );
};

export default IVCFDashboard;
