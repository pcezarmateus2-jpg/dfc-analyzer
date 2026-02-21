'use client';

import { useState } from 'react';

export default function UploadSection({ onAnalysis, setLoading, loading }: any) {
  const [contasPagar, setContasPagar] = useState<File | null>(null);
  const [contasReceber, setContasReceber] = useState<File | null>(null);

  const handleAnalyze = async () => {
    if (!contasPagar || !contasReceber) {
      alert('Por favor, envie ambos os arquivos PDF');
      return;
    }

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
      onAnalysis(data);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar arquivos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Envie seus PDFs para Análise
          </h2>
          <p className="text-gray-600">
            Faça upload das contas a pagar e receber para gerar o DFC automaticamente
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Contas a Pagar */}
          <div className="border-2 border-dashed border-red-300 rounded-lg p-6 text-center hover:border-red-500 transition">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-red-700">Contas a Pagar</h3>
            <p className="text-sm text-gray-600 mb-4">PDF com despesas</p>
            <label className="cursor-pointer bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition inline-block">
              {contasPagar ? '✓ Arquivo Selecionado' : 'Selecionar PDF'}
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setContasPagar(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {contasPagar && (
              <p className="text-xs text-gray-500 mt-2">{contasPagar.name}</p>
            )}
          </div>

          {/* Contas a Receber */}
          <div className="border-2 border-dashed border-green-300 rounded-lg p-6 text-center hover:border-green-500 transition">
            <div className="mb-4">
              <svg className="mx-auto h-12 w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-green-700">Contas a Receber</h3>
            <p className="text-sm text-gray-600 mb-4">PDF com receitas</p>
            <label className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition inline-block">
              {contasReceber ? '✓ Arquivo Selecionado' : 'Selecionar PDF'}
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => setContasReceber(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {contasReceber && (
              <p className="text-xs text-gray-500 mt-2">{contasReceber.name}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !contasPagar || !contasReceber}
          className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Analisando com IA...
            </span>
          ) : (
            '🚀 Analisar e Gerar DFC'
          )}
        </button>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>💡 Dica:</strong> Os PDFs serão processados com IA para extrair automaticamente as informações financeiras e gerar o DFC completo com análises e gráficos.
          </p>
        </div>
      </div>
    </div>
  );
}
