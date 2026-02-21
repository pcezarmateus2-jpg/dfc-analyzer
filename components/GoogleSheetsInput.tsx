'use client';

import { useState } from 'react';

export default function GoogleSheetsInput({ onAnalysis, setLoading }: any) {
  const [urlPagar, setUrlPagar] = useState('');
  const [urlReceber, setUrlReceber] = useState('');
  const [error, setError] = useState('');

  const handleAnalyze = async () => {
    if (!urlPagar.trim() || !urlReceber.trim()) {
      setError('Por favor, cole os links das duas planilhas');
      return;
    }

    // Validar se são URLs do Google Sheets
    if (!urlPagar.includes('docs.google.com/spreadsheets') || !urlReceber.includes('docs.google.com/spreadsheets')) {
      setError('Por favor, use links válidos do Google Sheets');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/analyze-sheets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          urlPagar,
          urlReceber
        }),
      });

      const data = await response.json();
      
      if (data.error) {
        setError(data.error);
      } else {
        onAnalysis(data);
      }
    } catch (error) {
      console.error('Erro:', error);
      setError('Erro ao importar planilhas. Verifique se as planilhas estão públicas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/>
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Importar do Google Sheets
          </h2>
          <p className="text-gray-600 text-lg">
            Cole os links das suas planilhas do Google
          </p>
        </div>

        {/* Instruções */}
        <div className="mb-8 p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <h3 className="font-bold text-green-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Como preparar suas planilhas:
          </h3>
          <ol className="text-sm text-green-800 space-y-2 ml-7 list-decimal">
            <li>Abra sua planilha no Google Sheets</li>
            <li>Clique em "Compartilhar" → "Qualquer pessoa com o link"</li>
            <li>Copie o link da planilha</li>
            <li>Cole aqui nos campos abaixo</li>
          </ol>
          <div className="mt-4 p-3 bg-white rounded-lg border border-green-300">
            <p className="text-xs font-semibold text-green-900 mb-1">Formato da planilha:</p>
            <p className="text-xs text-green-700">Coluna A: Loja | Coluna B: Conta | Coluna C: Valor</p>
          </div>
        </div>

        {/* Inputs de URL */}
        <div className="space-y-6 mb-8">
          {/* Contas a Pagar */}
          <div>
            <label className="block text-lg font-bold text-red-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
              Link da Planilha - Contas a Pagar
            </label>
            <input
              type="url"
              value={urlPagar}
              onChange={(e) => setUrlPagar(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full p-4 border-2 border-red-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition text-sm"
            />
            {urlPagar && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Link adicionado
              </div>
            )}
          </div>

          {/* Contas a Receber */}
          <div>
            <label className="block text-lg font-bold text-green-700 mb-3 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
              Link da Planilha - Contas a Receber
            </label>
            <input
              type="url"
              value={urlReceber}
              onChange={(e) => setUrlReceber(e.target.value)}
              placeholder="https://docs.google.com/spreadsheets/d/..."
              className="w-full p-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition text-sm"
            />
            {urlReceber && (
              <div className="mt-2 flex items-center text-sm text-green-600">
                <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Link adicionado
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
          disabled={!urlPagar.trim() || !urlReceber.trim()}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
            </svg>
            <span>Importar e Analisar</span>
          </span>
        </button>

        {/* Exemplo de Link */}
        <div className="mt-8 p-6 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Exemplo de link válido:
          </h3>
          <code className="block text-xs bg-white p-3 rounded border border-gray-300 text-gray-700 break-all">
            https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
          </code>
        </div>
      </div>
    </div>
  );
}
