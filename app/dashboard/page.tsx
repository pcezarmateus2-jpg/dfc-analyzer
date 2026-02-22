'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { auth, userManagement, analyses, User, SavedAnalysis } from '@/lib/auth';
import Link from 'next/link';

export default function DashboardPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserName, setNewUserName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
    
    if (user.role === 'master') {
      loadUsers();
    }
    
    loadAnalyses();
  }, [router]);

  const loadUsers = () => {
    const userList = userManagement.list();
    setUsers(userList);
  };

  const loadAnalyses = () => {
    const analysesList = analyses.list();
    setSavedAnalyses(analysesList);
  };

  const handleAddUser = () => {
    setError('');
    setSuccess('');

    try {
      userManagement.create(newUserEmail, newUserPassword, newUserName);
      setSuccess('Usuário criado com sucesso!');
      setNewUserEmail('');
      setNewUserPassword('');
      setNewUserName('');
      setShowAddUser(false);
      loadUsers();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleToggleActive = (userId: string) => {
    try {
      userManagement.toggleActive(userId);
      loadUsers();
      setSuccess('Status do usuário atualizado!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  const handleDeleteAnalysis = (id: string) => {
    if (confirm('Deseja realmente excluir esta análise?')) {
      analyses.delete(id);
      loadAnalyses();
      setSuccess('Análise excluída com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
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
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-sm text-gray-600">Bem-vindo, {currentUser.name}</p>
              </div>
            </div>
            
            {/* Menu Hambúrguer */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50">
                  <button
                    onClick={() => {
                      router.push('/');
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-blue-50 transition flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="text-gray-700 font-medium">Nova Análise</span>
                  </button>
                  <button
                    onClick={() => {
                      handleLogout();
                      setShowMenu(false);
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-red-50 transition flex items-center space-x-2"
                  >
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    <span className="text-gray-700 font-medium">Sair</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Mensagens */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-lg">
            <p className="text-green-700">{success}</p>
          </div>
        )}

        {/* Botão Nova Análise */}
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <span>Nova Análise</span>
          </Link>
        </div>

        {/* Gerenciamento de Usuários (apenas MASTER) */}
        {currentUser.role === 'master' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
              <button
                onClick={() => setShowAddUser(!showAddUser)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                {showAddUser ? 'Cancelar' : '+ Novo Usuário'}
              </button>
            </div>

            {/* Formulário Adicionar Usuário */}
            {showAddUser && (
              <div className="mb-6 p-6 bg-gray-50 rounded-xl border-2 border-gray-200">
                <h3 className="font-semibold text-gray-900 mb-4">Adicionar Novo Usuário</h3>
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <input
                    type="text"
                    placeholder="Nome"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                  <input
                    type="password"
                    placeholder="Senha"
                    value={newUserPassword}
                    onChange={(e) => setNewUserPassword(e.target.value)}
                    className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 outline-none"
                  />
                </div>
                <button
                  onClick={handleAddUser}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Criar Usuário
                </button>
              </div>
            )}

            {/* Lista de Usuários */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.role === 'master' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role === 'master' ? 'MASTER' : 'Usuário'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          user.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.role !== 'master' && (
                          <button
                            onClick={() => handleToggleActive(user.id)}
                            className={`px-3 py-1 rounded text-sm font-semibold ${
                              user.active 
                                ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            {user.active ? 'Inativar' : 'Ativar'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Histórico de Análises */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Histórico de Análises</h2>
          
          {savedAnalyses.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-600 text-lg">Nenhuma análise salva ainda</p>
              <p className="text-gray-500 text-sm mt-2">Suas análises aparecerão aqui após serem salvas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Período</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data Início</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Data Fim</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Receitas</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Despesas</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Saldo</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Criado em</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {savedAnalyses.map((analysis) => (
                    <tr 
                      key={analysis.id} 
                      className="border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition group"
                      onClick={() => router.push(`/analise/${analysis.id}`)}
                    >
                      <td className="py-3 px-4 font-semibold text-gray-900 group-hover:text-blue-700 transition">
                        <div className="flex items-center space-x-2">
                          <svg className="w-4 h-4 text-blue-600 opacity-0 group-hover:opacity-100 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span>{analysis.periodo}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {analysis.dataInicio ? new Date(analysis.dataInicio).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="py-3 px-4 text-gray-600">
                        {analysis.dataFim ? new Date(analysis.dataFim).toLocaleDateString('pt-BR') : '-'}
                      </td>
                      <td className="py-3 px-4 text-green-700 font-semibold">
                        {formatCurrency(analysis.data.receitas?.total || 0)}
                      </td>
                      <td className="py-3 px-4 text-red-700 font-semibold">
                        {formatCurrency(analysis.data.despesas?.total || 0)}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-semibold ${
                          analysis.data.saldo >= 0 ? 'text-blue-700' : 'text-orange-700'
                        }`}>
                          {formatCurrency(analysis.data.saldo || 0)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm">
                        {formatDate(analysis.createdAt)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => router.push(`/analise/${analysis.id}`)}
                            className="px-3 py-1 bg-blue-100 text-blue-700 rounded text-sm font-semibold hover:bg-blue-200 transition"
                          >
                            Ver Detalhes
                          </button>
                          <button
                            onClick={() => handleDeleteAnalysis(analysis.id)}
                            className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm font-semibold hover:bg-red-200 transition"
                          >
                            Excluir
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
