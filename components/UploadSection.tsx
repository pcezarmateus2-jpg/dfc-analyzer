'use client';

import { useState } from 'react';

export default function UploadSection({ onAnalysis, setLoading, loading }: any) {
  const [contasPagar, setContasPagar] = useState<File | null>(null);
  const [contasReceber, setContasReceber] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const handleAnalyze = async () => {
    if (!contasPagar || !contasReceber) {
      setError('Por favor, envie ambos os arquivos PDF');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('contasPagar', contasPagar);
      formData.append('contasReceber', contasReceber);

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        onAnalysis(data);
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao processar arquivos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        {/* Header da Seção */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Envie seus Relatórios Financeiros
          </h2>
          <p className="text-gray-600 text-lg">
            Faça upload dos PDFs de contas a pagar e receber para análise automática
          </p>
        </div>

        {/* Cards de Upload */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Contas a Pagar */}
          <div className={`relative border-3 ${contasPagar ? 'border-red-400 bg-red-50' : 'border-dashed border-red-300 bg-white'} rounded-2xl p-8 text-center hover:border-red-500 hover:shadow-lg transition-all duration-300 group`}>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-red-700">Contas a Pagar</h3>
            <p className="text-sm text-gray-600 mb-6">Relatório de despesas e pagamentos</p>
            <label className="cursor-pointer inline-flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 text-white px-6 py-3 rounded-xl hover:from-red-700 hover:to-red-800 transition-all shadow-md hover:shadow-lg font-semibold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{contasPagar ? 'Alterar PDF' : 'Selecionar PDF'}</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setContasPagar(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {contasPagar && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-red-200">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium truncate max-w-[200px]">{contasPagar.name}</p>
                </div>
              </div>
            )}
          </div>

          {/* Contas a Receber */}
          <div className={`relative border-3 ${contasReceber ? 'border-green-400 bg-green-50' : 'border-dashed border-green-300 bg-white'} rounded-2xl p-8 text-center hover:border-green-500 hover:shadow-lg transition-all duration-300 group`}>
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full group-hover:scale-110 transition-transform">
                <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                </svg>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-2 text-green-700">Contas a Receber</h3>
            <p className="text-sm text-gray-600 mb-6">Relatório de receitas e recebimentos</p>
            <label className="cursor-pointer inline-flex items-center space-x-2 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg font-semibold">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{contasReceber ? 'Alterar PDF' : 'Selecionar PDF'}</span>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setContasReceber(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {contasReceber && (
              <div className="mt-4 p-3 bg-white rounded-lg border border-green-200">
                <div className="flex items-center justify-center space-x-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-gray-700 font-medium truncate max-w-[200px]">{contasReceber.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Botão de Análise */}
        <button
          onClick={handleAnalyze}
          disabled={loading || !contasPagar || !contasReceber}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-6 w-6 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analisando com IA...
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-2">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Analisar e Gerar DFC</span>
            </span>
          )}
        </button>

        {/* Informações */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-xl">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-blue-900">Extração Automática</p>
              <p className="text-xs text-blue-700 mt-1">Valores extraídos automaticamente dos PDFs</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-indigo-50 rounded-xl">
            <svg className="w-6 h-6 text-indigo-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-indigo-900">Análise Inteligente</p>
              <p className="text-xs text-indigo-700 mt-1">IA analisa e categoriza automaticamente</p>
            </div>
          </div>
          <div className="flex items-start space-x-3 p-4 bg-purple-50 rounded-xl">
            <svg className="w-6 h-6 text-purple-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <div>
              <p className="text-sm font-semibold text-purple-900">100% Seguro</p>
              <p className="text-xs text-purple-700 mt-1">Seus dados são processados com segurança</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
