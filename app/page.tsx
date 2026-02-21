'use client';

import { useState } from 'react';
import UploadSection from '@/components/UploadSection';
import DFCResults from '@/components/DFCResults';
import AIAnalysis from '@/components/AIAnalysis';
import Charts from '@/components/Charts';

export default function Home() {
  const [dfcData, setDfcData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysis = (data: any) => {
    setDfcData(data);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">💼 DFC Analyzer</h1>
              <p className="text-sm text-gray-600 mt-1">Análise de Fluxo de Caixa com IA</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Powered by OpenAI</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!dfcData ? (
          <UploadSection onAnalysis={handleAnalysis} setLoading={setLoading} loading={loading} />
        ) : (
          <div className="space-y-6">
            {/* Botão Voltar */}
            <button
              onClick={() => setDfcData(null)}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
            >
              ← Nova Análise
            </button>

            {/* Resultados */}
            <DFCResults data={dfcData} />
            
            {/* Gráficos */}
            <Charts data={dfcData} />
            
            {/* Análise com IA */}
            <AIAnalysis data={dfcData} />
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-white mt-12 border-t">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            DFC Analyzer v1.0 - Análise Financeira Inteligente
          </p>
        </div>
      </footer>
    </main>
  );
}
