'use client';

import { useState } from 'react';

export default function ManualInput({ onAnalysis, setLoading }: any) {
  const [despesas, setDespesas] = useState('');
  const [receitas, setReceitas] = useState('');

  const handleAnalyze = () => {
    setLoading(true);

    try {
      // Parse despesas
      const linhasDespesas = despesas.split('\n').filter(l => l.trim());
      const despesasData: { [key: string]: number } = {};
      let totalDespesas = 0;

      linhasDespesas.forEach(linha => {
        const match = linha.match(/(.+?)\s+(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/);
        if (match) {
          const categoria = match[1].trim();
          const valor = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
          if (!despesasData[categoria]) {
            despesasData[categoria] = 0;
          }
          despesasData[categoria] += valor;
          totalDespesas += valor;
        }
      });

      // Parse receitas
      const linhasReceitas = receitas.split('\n').filter(l => l.trim());
      const receitasData: { [key: string]: number } = {};
      let totalReceitas = 0;

      linhasReceitas.forEach(linha => {
        const match = linha.match(/(.+?)\s+(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/);
        if (match) {
          const categoria = match[1].trim();
          const valor = parseFloat(match[2].replace(/\./g, '').replace(',', '.'));
          if (!receitasData[categoria]) {
            receitasData[categoria] = 0;
          }
          receitasData[categoria] += valor;
          totalReceitas += valor;
        }
      });

      const resultado = {
        receitas: {
          total: totalReceitas,
          porCategoria: receitasData
        },
        despesas: {
          total: totalDespesas,
          porCategoria: despesasData
        },
        saldo: totalReceitas - totalDespesas
      };

      onAnalysis(resultado);
    } catch (error) {
      console.error('Erro:', error);
      alert('Erro ao processar dados. Verifique o formato.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mb-4 shadow-lg">
            <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Entrada Manual de Dados
          </h2>
          <p className="text-gray-600 text-lg">
            Cole os dados dos seus relatórios financeiros
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Despesas */}
          <div>
            <label className="block text-lg font-bold text-red-700 mb-3">
              Contas a Pagar (Despesas)
            </label>
            <textarea
              value={despesas}
              onChange={(e) => setDespesas(e.target.value)}
              placeholder="Cole aqui os dados de despesas&#10;Exemplo:&#10;Salários R$ 10.000,00&#10;Aluguel R$ 2.500,00&#10;Energia R$ 450,00"
              className="w-full h-64 p-4 border-2 border-red-300 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Formato: Descrição R$ 1.234,56 (uma por linha)
            </p>
          </div>

          {/* Receitas */}
          <div>
            <label className="block text-lg font-bold text-green-700 mb-3">
              Contas a Receber (Receitas)
            </label>
            <textarea
              value={receitas}
              onChange={(e) => setReceitas(e.target.value)}
              placeholder="Cole aqui os dados de receitas&#10;Exemplo:&#10;Vendas R$ 25.000,00&#10;Serviços R$ 8.500,00&#10;Juros R$ 120,00"
              className="w-full h-64 p-4 border-2 border-green-300 rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition font-mono text-sm"
            />
            <p className="text-xs text-gray-500 mt-2">
              Formato: Descrição R$ 1.234,56 (uma por linha)
            </p>
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!despesas.trim() || !receitas.trim()}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-5 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
        >
          <span className="flex items-center justify-center space-x-2">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Analisar Dados</span>
          </span>
        </button>

        <div className="mt-8 p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <h3 className="font-bold text-purple-900 mb-3 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            Como usar:
          </h3>
          <ul className="text-sm text-purple-800 space-y-2">
            <li>• Copie os dados do seu PDF ou planilha</li>
            <li>• Cole no campo correspondente (despesas ou receitas)</li>
            <li>• Cada linha deve ter: Descrição + Valor</li>
            <li>• Formato do valor: R$ 1.234,56 ou 1.234,56</li>
            <li>• Clique em "Analisar Dados"</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
