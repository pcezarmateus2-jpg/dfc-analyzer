'use client';

export default function DFCResults({ data }: any) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📊 Demonstrativo de Fluxo de Caixa</h2>

      {/* Resumo */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-50 rounded-lg p-6">
          <p className="text-sm text-green-600 font-medium mb-2">Total Receitas</p>
          <p className="text-3xl font-bold text-green-700">{formatCurrency(data.receitas.total)}</p>
        </div>

        <div className="bg-red-50 rounded-lg p-6">
          <p className="text-sm text-red-600 font-medium mb-2">Total Despesas</p>
          <p className="text-3xl font-bold text-red-700">{formatCurrency(data.despesas.total)}</p>
        </div>

        <div className={`${data.saldo >= 0 ? 'bg-blue-50' : 'bg-orange-50'} rounded-lg p-6`}>
          <p className={`text-sm ${data.saldo >= 0 ? 'text-blue-600' : 'text-orange-600'} font-medium mb-2`}>
            Saldo Final
          </p>
          <p className={`text-3xl font-bold ${data.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'}`}>
            {formatCurrency(data.saldo)}
          </p>
        </div>
      </div>

      {/* Detalhes */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Receitas */}
        <div>
          <h3 className="text-lg font-semibold text-green-700 mb-4">Receitas por Categoria</h3>
          <div className="space-y-2">
            {Object.entries(data.receitas.porCategoria || {}).map(([cat, val]: any) => (
              <div key={cat} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                <span className="text-gray-700">{cat}</span>
                <span className="font-semibold text-green-700">{formatCurrency(val)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Despesas */}
        <div>
          <h3 className="text-lg font-semibold text-red-700 mb-4">Despesas por Categoria</h3>
          <div className="space-y-2">
            {Object.entries(data.despesas.porCategoria || {}).map(([cat, val]: any) => (
              <div key={cat} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-gray-700">{cat}</span>
                <span className="font-semibold text-red-700">{formatCurrency(val)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
