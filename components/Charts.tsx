'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

export default function Charts({ data }: any) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const receitasData = Object.entries(data.receitas.porCategoria || {}).map(([name, value]) => ({
    name,
    value
  }));

  const despesasData = Object.entries(data.despesas.porCategoria || {}).map(([name, value]) => ({
    name,
    value
  }));

  const comparativoData = [
    { name: 'Receitas', valor: data.receitas.total },
    { name: 'Despesas', valor: data.despesas.total },
    { name: 'Saldo', valor: data.saldo }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">📈 Gráficos</h2>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        {/* Receitas */}
        <div>
          <h3 className="text-lg font-semibold text-center mb-4">Receitas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={receitasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {receitasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Despesas */}
        <div>
          <h3 className="text-lg font-semibold text-center mb-4">Despesas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={despesasData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {despesasData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => formatCurrency(value)} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Comparativo */}
      <div>
        <h3 className="text-lg font-semibold text-center mb-4">Comparativo Geral</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparativoData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value: any) => formatCurrency(value)} />
            <Bar dataKey="valor" fill="#3B82F6" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
