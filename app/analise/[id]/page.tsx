'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { auth, analyses, SavedAnalysis } from '@/lib/auth';
import DFCResults from '@/components/DFCResults';
import Charts from '@/components/Charts';
import AIAnalysis from '@/components/AIAnalysis';

export default function AnalysisViewPage() {
  const router = useRouter();
  const params = useParams();
  const [analysis, setAnalysis] = useState<SavedAnalysis | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);

    // Carregar análise
    const id = params.id as string;
    const savedAnalysis = analyses.get(id);
    
    if (!savedAnalysis) {
      alert('Análise não encontrada');
      router.push('/dashboard');
      return;
    }

    // Verificar se a análise pertence ao usuário
    if (savedAnalysis.userId !== user.id) {
      alert('Você não tem permissão para ver esta análise');
      router.push('/dashboard');
      return;
    }

    setAnalysis(savedAnalysis);
  }, [params.id, router]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (!currentUser || !analysis) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-lg border-b-4 border-blue-600">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-3 rounded-xl shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Análise: {analysis.periodo}</h1>
                <p className="text-sm text-gray-600">
                  {analysis.dataInicio && analysis.dataFim 
                    ? `${formatDate(analysis.dataInicio)} - ${formatDate(analysis.dataFim)}`
                    : `Criado em ${formatDate(analysis.createdAt)}`
                  }
                </p>
              </div>
            </div>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Informações da Análise */}
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Informações da Análise</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 font-medium mb-1">Período</p>
                <p className="text-lg font-bold text-blue-900">{analysis.periodo}</p>
              </div>
              {analysis.dataInicio && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-600 font-medium mb-1">Data Início</p>
                  <p className="text-lg font-bold text-green-900">{formatDate(analysis.dataInicio)}</p>
                </div>
              )}
              {analysis.dataFim && (
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium mb-1">Data Fim</p>
                  <p className="text-lg font-bold text-purple-900">{formatDate(analysis.dataFim)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Resultados DFC */}
          <DFCResults data={analysis.data} />
          
          {/* Gráficos */}
          <Charts data={analysis.data} />
          
          {/* Análise com IA */}
          <AIAnalysis data={analysis.data} />
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t-2 border-gray-100">
        <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <p className="text-sm text-gray-600">
                DFC Analyzer v1.2 - Sistema Online
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <span>📊 Análise Financeira</span>
              <span>🤖 IA Integrada</span>
              <span>🔒 Seguro</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
