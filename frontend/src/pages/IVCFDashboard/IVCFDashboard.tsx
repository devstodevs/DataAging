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
import RadarChart from "../../components/compound/RadarChart/RadarChart";
import LineChart from "../../components/compound/LineChart/LineChart";
import type { DateRange } from "react-day-picker";

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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 lg:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard {testId.toUpperCase()}
          </h1>
          <Button
            onClick={handleExportReport}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Exportar Relatório
          </Button>
        </div>
      </div>

      <main className="p-4 lg:p-6 space-y-6">
        {/* Alerta de Pacientes Críticos */}
        {mockData.criticalPatients > 0 && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Pacientes em Estado Crítico</AlertTitle>
            <AlertDescription>
              {mockData.criticalPatients} pacientes em estado crítico
              identificados. Recomenda-se atenção imediata para estes casos.
            </AlertDescription>
          </Alert>
        )}

        {/* Barra de Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="grid gap-4 w-full"
              style={{
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              }}
            >
              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Período</label>
                <DateRangePicker
                  value={filters.period}
                  onChange={(range) => handleFilterChange("period", range)}
                  placeholder="Selecionar período"
                  className="w-full"
                />
              </div>

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Faixa Etária</label>
                <Select
                  value={filters.ageRange}
                  onValueChange={(value) =>
                    handleFilterChange("ageRange", value)
                  }
                >
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">Região/Bairro</label>
                <Select
                  value={filters.region}
                  onValueChange={(value) => handleFilterChange("region", value)}
                >
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">
                  Unidade Administrativa
                </label>
                <Select
                  value={filters.administrativeUnit}
                  onValueChange={(value) =>
                    handleFilterChange("administrativeUnit", value)
                  }
                >
                  <SelectTrigger className="w-full">
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

              <div className="space-y-2 w-full">
                <label className="text-sm font-medium">
                  Classificação de Risco
                </label>
                <RadioGroup
                  value={filters.riskClassification}
                  onValueChange={(value) =>
                    handleFilterChange("riskClassification", value)
                  }
                  className="w-full"
                >
                  <div className="grid grid-cols-2 gap-2">
                    {filterOptions.riskClassification.map((option) => (
                      <div
                        key={option.value}
                        className="flex items-center space-x-2"
                      >
                        <RadioGroupItem
                          value={option.value}
                          id={option.value}
                        />
                        <label
                          htmlFor={option.value}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total de Idosos Avaliados
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.kpis.totalElderly}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Percentual de Idosos Frágeis
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.kpis.fragilePercentage}%
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Média de Pontuação por Região
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockData.kpis.averageScore}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Distribuição por Domínio</CardTitle>
            </CardHeader>
            <CardContent>
              <RadarChart data={mockData.radarData} height={350} />
            </CardContent>
          </Card>

          <Card>
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
        <Card>
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
      </main>
    </div>
  );
};

export default IVCFDashboard;
