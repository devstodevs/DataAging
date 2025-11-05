import React from "react";
import { Activity, Battery, User, Brain, BarChart3 } from "lucide-react";
import Title from "../../components/base/Title/Title";
import Subtitle from "../../components/base/Subtitle/Subtitle";
import TestCard from "../../components/compound/TestCard/TestCard";
import HighlightsCard from "../../components/compound/HighlightsCard/HighlightsCard";
import { useAuth } from "../../contexts/AuthContext";

interface HomeProps {
  onNavigate?: (page: string) => void;
}

const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  
  const firstName = user?.nome_completo?.split(' ')[0] || 'Usuário';
  const clinicalTests = [
    {
      id: "atividade-fisica",
      icon: Activity,
      title: "Atividade Física e Sedentarismo",
      description:
        "Avalia níveis de atividade física e comportamento sedentário",
      link: "/teste/atividade-fisica",
    },
    {
      id: "fact-f",
      icon: Battery,
      title: "FACT-F",
      description: "Avaliação funcional para fadiga em doenças crônicas",
      link: "/teste/fact-f",
    },
    {
      id: "ivcf-20",
      icon: User,
      title: "iVCF-20",
      description: "Índice de vulnerabilidade clínico-funcional para idosos",
      link: "/teste/ivcf-20",
    },
    {
      id: "meem",
      icon: Brain,
      title: "MEEM",
      description: "Mini exame do estado mental para avaliação cognitiva",
      link: "/teste/meem",
    },
    {
      id: "pfs",
      icon: BarChart3,
      title: "PFS",
      description: "Escala de fadiga de Pittsburgh para avaliação",
      link: "/teste/pfs",
    },
  ];

  const highlights = [
    {
      type: "Dica do dia",
      description:
        "Mantenha os dados do paciente sempre atualizados para melhor acompanhamento.",
    },
    {
      type: "Atualização",
      description: "Novo teste FACT-F disponível na plataforma.",
    },
    {
      type: "Lembrete",
      description: "Revise os resultados dos testes semanalmente.",
    },
  ];

  return (
    <div className="h-full bg-gray-50">
      {/* Header with user info */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Dashboard DataAging
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Bem-vindo de volta, {firstName}!
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-blue-700">
                {firstName.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Seção de Testes Clínicos */}
        <section className="mb-12">
          <div className="mb-6">
            <Title level="h1" size="large" className="mb-2">
              Testes Clínicos Disponíveis
            </Title>
            <Subtitle size="medium">
              Selecione um teste para começar a avaliação
            </Subtitle>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clinicalTests.map((test) => (
              <TestCard
                key={test.id}
                icon={test.icon}
                title={test.title}
                description={test.description}
                onClick={() => {
                  if (onNavigate) {
                    if (test.id === "ivcf-20") {
                      onNavigate("ivcf-dashboard");
                    } else if (test.id === "atividade-fisica") {
                      onNavigate("physical-activity-dashboard");
                    } else if (test.id === "fact-f") {
                      onNavigate("factf-dashboard");
                    } else {
                      console.log(`Teste ${test.id} ainda não implementado`);
                    }
                  }
                }}
              />
            ))}
          </div>
        </section>

        {/* Seção de Destaques */}
        <section>
          <HighlightsCard highlights={highlights} />
        </section>
      </main>
    </div>
  );
};

export default Home;
