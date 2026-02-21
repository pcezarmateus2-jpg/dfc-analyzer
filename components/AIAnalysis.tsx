'use client';

import { useState, useEffect } from 'react';

export default function AIAnalysis({ data }: any) {
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateAnalysis();
  }, []);

  const generateAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/analyze-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      setAnalysis(result.analysis);
    } catch (error) {
      setAnalysis('Erro ao gerar análise com IA. Verifique se a chave da OpenAI está configurada.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">🤖 Análise com IA</h2>
        <button
          onClick={generateAnalysis}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition text-sm"
        >
          Gerar Nova Análise
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <svg className="animate-spin h-12 w-12 text-purple-600 mx-auto mb-4" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <p className="text-gray-600">Gerando análise inteligente...</p>
          </div>
        </div>
      ) : (
        <div className="prose prose-sm max-w-none">
          <div className="bg-purple-50 rounded-lg p-6 whitespace-pre-wrap text-gray-700">
            {analysis}
          </div>
        </div>
      )}
    </div>
  );
}
