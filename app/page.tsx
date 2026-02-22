'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, analyses } from '@/lib/auth';
import UploadSection from '@/components/UploadSection';
import ManualInput from '@/components/ManualInput';
import GoogleSheetsInput from '@/components/GoogleSheetsInput';
import DFCResults from '@/components/DFCResults';
import AIAnalysis from '@/components/AIAnalysis';
import Charts from '@/components/Charts';
import ExportPDF from '@/components/ExportPDF';

export default function Home() {
  const router = useRouter();
  const [dfcData, setDfcData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'manual' | 'sheets'>('upload');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [periodo, setPeriodo] = useState('');
  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  useEffect(() => {
    const user = auth.getCurrentUser();
    if (!user) {
      router.push('/login');
      return;
    }
    setCurrentUser(user);
  }, [router]);

  const handleAnalysis = (data: any) => {
    setDfcData(data);
    setShowSaveModal(true);
  };

  const handleSaveAnalysis = () => {
    if (!periodo) {
      alert('Por favor, informe o período da análise');
      return;
    }

    try {
      analyses.save(periodo, dataInicio || undefined, dataFim || undefined, dfcData);
      setShowSaveModal(false);
      setPeriodo('');
      setDataInicio('');
      setDataFim('');
      alert('Análise salva com sucesso!');
    } catch (err: any) {
      alert('Erro ao salvar análise: ' + err.message);
    }
  };

  const handleLogout = () => {
    auth.logout();
    router.push('/login');
  };

  if (!currentUser) {
    return <div className="min-h-screen flex items-center justify-center">Carregando...</div>;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header Melhorado */}
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
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  DFC Analyzer
                </h1>
                <p className="text-sm text-gray-600 mt-1">Análise Inteligente de Fluxo de Caixa</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200">
                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-sm font-semibold text-blue-600">Powered by IA</span>
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
                        router.push('/dashboard');
                        setShowMenu(false);
                      }}
                      className="w-full px-4 py-2 text-left hover:bg-blue-50 transition flex items-center space-x-2"
                    >
                      <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                      </svg>
                      <span className="text-gray-700 font-medium">Dashboard</span>
                    </button>
                    {currentUser?.role === 'master' && (
                      <button
                        onClick={() => {
                          router.push('/usuarios');
                          setShowMenu(false);
                        }}
                        className="w-full px-4 py-2 text-left hover:bg-purple-50 transition flex items-center space-x-2"
                      >
                        <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                        <span className="text-gray-700 font-medium">Gerenciar Usuários</span>
                      </button>
                    )}
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
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {!dfcData ? (
          <div>
            {/* Tabs */}
            <div className="flex justify-center mb-8 overflow-x-auto">
              <div className="inline-flex bg-white rounded-2xl shadow-lg p-1 border border-gray-200">
                <button
                  onClick={() => setActiveTab('upload')}
                  className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'upload'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <span>Excel/PDF</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('sheets')}
                  className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'sheets'
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
                    </svg>
                    <span>Google Sheets</span>
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('manual')}
                  className={`px-4 md:px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    activeTab === 'manual'
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    <span>Manual</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Content based on active tab */}
            {activeTab === 'upload' && (
              <UploadSection onAnalysis={handleAnalysis} setLoading={setLoading} loading={loading} />
            )}
            {activeTab === 'sheets' && (
              <GoogleSheetsInput onAnalysis={handleAnalysis} setLoading={setLoading} />
            )}
            {activeTab === 'manual' && (
              <ManualInput onAnalysis={handleAnalysis} setLoading={setLoading} />
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {/* Modal de Salvar Análise */}
            {showSaveModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
                  <h3 className="text-2xl font-bold text-gray-900 mb-6">Salvar Análise</h3>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Período/Descrição *
                      </label>
                      <input
                        type="text"
                        value={periodo}
                        onChange={(e) => setPeriodo(e.target.value)}
                        placeholder="Ex: Janeiro 2024, Q1 2024, etc."
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Data Início (opcional)
                      </label>
                      <input
                        type="date"
                        value={dataInicio}
                        onChange={(e) => setDataInicio(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Data Fim (opcional)
                      </label>
                      <input
                        type="date"
                        value={dataFim}
                        onChange={(e) => setDataFim(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <button
                      onClick={() => setShowSaveModal(false)}
                      className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition font-semibold"
                    >
                      Agora Não
                    </button>
                    <button
                      onClick={handleSaveAnalysis}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition font-semibold"
                    >
                      Salvar
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Botões de Ação */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => setDfcData(null)}
                className="group flex items-center space-x-2 px-6 py-3 bg-white text-gray-700 rounded-xl hover:bg-gray-50 transition-all shadow-md hover:shadow-lg border border-gray-200"
              >
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="font-semibold">Nova Análise</span>
              </button>

              <ExportPDF contentId="analysis-content" fileName={`DFC-Analise-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}`} />
            </div>

            {/* Conteúdo para Exportar */}
            <div id="analysis-content">
              {/* Resultados */}
              <DFCResults data={dfcData} />
              
              {/* Gráficos */}
              <Charts data={dfcData} />
              
              {/* Análise com IA */}
              <AIAnalysis data={dfcData} />
            </div>
          </div>
        )}
      </div>

      {/* Footer Melhorado */}
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
