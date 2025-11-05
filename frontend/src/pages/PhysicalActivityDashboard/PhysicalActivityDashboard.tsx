import React, { useState } from 'react';
import {
  Activity,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  RefreshCw
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';
import { usePhysicalActivityData } from '../../hooks/physicalActivity/usePhysicalActivityData';
import { PhysicalActivityApiService } from '../../services/physicalActivityApi';
import {
  SEDENTARY_RISK_COLORS,
  type SedentaryRiskLevel
} from '../../types/physicalActivity';
import './PhysicalActivityDashboard.css';

const PhysicalActivityDashboard: React.FC = () => {
  const {
    data,
    loading,
    error,
    lastUpdated,
    refreshData
  } = usePhysicalActivityData();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshData();
    setRefreshing(false);
  };

  if (loading && !data.summary) {
    return (
      <div className="physical-activity-dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Carregando dados de atividade física...</p>
        </div>
      </div>
    );
  }

  if (error && !data.summary) {
    return (
      <div className="physical-activity-dashboard">
        <div className="error-container">
          <AlertTriangle className="error-icon" />
          <h3>Erro ao carregar dados</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  // Prepare chart data
  const activityChartData = data.activityDistribution ?
    PhysicalActivityApiService.formatActivityDataForChart(data.activityDistribution) : [];

  const sedentaryTrendData = data.sedentaryTrend ?
    PhysicalActivityApiService.formatSedentaryTrendForChart(data.sedentaryTrend) : [];

  const whoComplianceData = data.whoCompliance ? [
    {
      name: data.whoCompliance.compliant.label,
      value: data.whoCompliance.compliant.count,
      percentage: data.whoCompliance.compliant.percentage,
      color: '#4CAF50'
    },
    {
      name: data.whoCompliance.non_compliant.label,
      value: data.whoCompliance.non_compliant.count,
      percentage: data.whoCompliance.non_compliant.percentage,
      color: '#F44336'
    }
  ] : [];

  const getRiskLevelColor = (level: SedentaryRiskLevel) => {
    return SEDENTARY_RISK_COLORS[level] || '#666';
  };

  return (
    <div className="physical-activity-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>
            <Activity className="header-icon" />
            Dashboard - Atividade Física e Sedentarismo
          </h1>
          <div className="header-actions">
            {lastUpdated && (
              <span className="last-updated">
                Última atualização: {lastUpdated.toLocaleString('pt-BR')}
              </span>
            )}
            <button
              onClick={handleRefresh}
              className={`refresh-button ${refreshing ? 'refreshing' : ''}`}
              disabled={refreshing}
            >
              <RefreshCw className={`refresh-icon ${refreshing ? 'spinning' : ''}`} />
              Atualizar
            </button>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon users">
            <Users />
          </div>
          <div className="card-content">
            <h3>Total Avaliados</h3>
            <p className="card-value">{data.summary?.total_patients_evaluated || 0}</p>
            <span className="card-subtitle">Idosos cadastrados</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon compliance">
            <CheckCircle />
          </div>
          <div className="card-content">
            <h3>Conformidade OMS</h3>
            <p className="card-value">{data.summary?.who_compliance_percentage || 0}%</p>
            <span className="card-subtitle">
              {data.summary?.compliant_patients || 0} de {data.summary?.total_evaluations || 0} avaliações
            </span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon sedentary">
            <Clock />
          </div>
          <div className="card-content">
            <h3>Média Sedentária</h3>
            <p className="card-value">{data.summary?.average_sedentary_hours || 0}h</p>
            <span className="card-subtitle">Horas por dia</span>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon critical">
            <AlertTriangle />
          </div>
          <div className="card-content">
            <h3>Pacientes Críticos</h3>
            <p className="card-value">{data.criticalPatients.length}</p>
            <span className="card-subtitle">&gt;10h sedentárias/dia</span>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        {/* Activity Distribution */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Distribuição por Intensidade de Atividade</h3>
            <span className="chart-subtitle">Minutos semanais médios</span>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={activityChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}min`}
                >
                  {activityChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} min/semana`, 'Média']} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* WHO Compliance */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Conformidade com Diretrizes OMS</h3>
            <span className="chart-subtitle">≥150min moderada OU ≥75min vigorosa/semana</span>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={whoComplianceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percentage }) => `${name}: ${percentage}%`}
                >
                  {whoComplianceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name, props) => [
                  `${value} pacientes (${props.payload.percentage}%)`,
                  name
                ]} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sedentary by Age */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Horas Sedentárias por Faixa Etária</h3>
            <span className="chart-subtitle">Média diária por grupo</span>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.sedentaryByAge}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="age_range" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}h`,
                    name === 'average_sedentary_hours' ? 'Média Sedentária' : name
                  ]}
                  labelFormatter={(label) => `Faixa etária: ${label}`}
                />
                <Legend />
                <Bar
                  dataKey="average_sedentary_hours"
                  fill="#FF9800"
                  name="Horas Sedentárias"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sedentary Trend */}
        <div className="chart-container">
          <div className="chart-header">
            <h3>Tendência de Sedentarismo (12 meses)</h3>
            <span className="chart-subtitle">Diabéticos vs Hipertensos</span>
          </div>
          <div className="chart-content">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sedentaryTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  formatter={(value, name) => [
                    `${value}h`,
                    name === 'diabetics' ? 'Diabéticos' : 'Hipertensos'
                  ]}
                  labelFormatter={(label) => `Mês: ${label}`}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="diabetics"
                  stroke="#2196F3"
                  strokeWidth={2}
                  name="Diabéticos"
                />
                <Line
                  type="monotone"
                  dataKey="hypertensives"
                  stroke="#FF5722"
                  strokeWidth={2}
                  name="Hipertensos"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Critical Patients Table */}
      {data.criticalPatients.length > 0 && (
        <div className="critical-patients-section">
          <div className="section-header">
            <h3>
              <AlertTriangle className="section-icon" />
              Pacientes com Sedentarismo Crítico
            </h3>
            <span className="section-subtitle">
              Pacientes com mais de 10 horas sedentárias por dia
            </span>
          </div>
          <div className="table-container">
            <table className="critical-patients-table">
              <thead>
                <tr>
                  <th>Nome</th>
                  <th>Idade</th>
                  <th>Bairro</th>
                  <th>Horas Sedentárias</th>
                  <th>Conformidade OMS</th>
                  <th>Data Avaliação</th>
                  <th>Unidade de Saúde</th>
                </tr>
              </thead>
              <tbody>
                {data.criticalPatients.map((patient) => (
                  <tr key={patient.patient_id}>
                    <td>{patient.patient_name}</td>
                    <td>{patient.age} anos</td>
                    <td>{patient.bairro}</td>
                    <td className="sedentary-hours">
                      {patient.sedentary_hours_per_day}h
                    </td>
                    <td>
                      {patient.who_compliance ? (
                        <span className="compliance-badge compliant">
                          <CheckCircle size={16} />
                          Conforme
                        </span>
                      ) : (
                        <span className="compliance-badge non-compliant">
                          <XCircle size={16} />
                          Não Conforme
                        </span>
                      )}
                    </td>
                    <td>{new Date(patient.evaluation_date).toLocaleDateString('pt-BR')}</td>
                    <td>{patient.health_unit || 'N/A'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* All Patients Summary */}
      <div className="all-patients-section">
        <div className="section-header">
          <h3>
            <Users className="section-icon" />
            Resumo de Todos os Pacientes
          </h3>
          <span className="section-subtitle">
            {data.allPatients.length} pacientes cadastrados
          </span>
        </div>
        <div className="table-container">
          <table className="patients-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Idade</th>
                <th>Bairro</th>
                <th>Avaliado</th>
                <th>Última Avaliação</th>
                <th>Risco Sedentário</th>
                <th>OMS</th>
              </tr>
            </thead>
            <tbody>
              {data.allPatients.map((patient) => (
                <tr key={patient.id}>
                  <td>{patient.nome_completo}</td>
                  <td>{patient.idade} anos</td>
                  <td>{patient.bairro}</td>
                  <td>
                    {patient.has_evaluation ? (
                      <span className="status-badge evaluated">Sim</span>
                    ) : (
                      <span className="status-badge not-evaluated">Não</span>
                    )}
                  </td>
                  <td>
                    {patient.last_evaluation_date
                      ? new Date(patient.last_evaluation_date).toLocaleDateString('pt-BR')
                      : 'N/A'
                    }
                  </td>
                  <td>
                    {patient.sedentary_risk_level ? (
                      <span
                        className="risk-badge"
                        style={{
                          backgroundColor: getRiskLevelColor(patient.sedentary_risk_level),
                          color: 'white'
                        }}
                      >
                        {patient.sedentary_risk_level}
                      </span>
                    ) : (
                      'N/A'
                    )}
                  </td>
                  <td>
                    {patient.who_compliance !== undefined ? (
                      patient.who_compliance ? (
                        <CheckCircle className="compliance-icon compliant" size={16} />
                      ) : (
                        <XCircle className="compliance-icon non-compliant" size={16} />
                      )
                    ) : (
                      'N/A'
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PhysicalActivityDashboard;