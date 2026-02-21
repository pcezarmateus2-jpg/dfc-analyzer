// Sistema de autenticação simples com localStorage

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'master' | 'user';
  active: boolean;
  createdAt: string;
}

export interface SavedAnalysis {
  id: string;
  userId: string;
  periodo: string;
  dataInicio?: string;
  dataFim?: string;
  data: any;
  createdAt: string;
}

// Inicializar usuário master
const initMasterUser = () => {
  if (typeof window === 'undefined') return;
  
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Verificar se já existe usuário master
  const masterExists = users.find((u: any) => u.role === 'master');
  
  if (!masterExists) {
    const masterUser = {
      id: 'master-001',
      email: 'admin@dfcanalyzer.com',
      password: 'admin123',
      name: 'Administrador',
      role: 'master',
      active: true,
      createdAt: new Date().toISOString()
    };
    
    users.push(masterUser);
    localStorage.setItem('users', JSON.stringify(users));
  }
};

// Autenticação
export const auth = {
  init: () => {
    initMasterUser();
  },
  
  login: (email: string, password: string): User | null => {
    if (typeof window === 'undefined') return null;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }
    
    if (!user.active) {
      throw new Error('Usuário inativo. Entre em contato com o administrador.');
    }
    
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      active: user.active,
      createdAt: user.createdAt
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    return userData;
  },
  
  logout: () => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('currentUser');
  },
  
  getCurrentUser: (): User | null => {
    if (typeof window === 'undefined') return null;
    const user = localStorage.getItem('currentUser');
    return user ? JSON.parse(user) : null;
  },
  
  isAuthenticated: (): boolean => {
    return auth.getCurrentUser() !== null;
  },
  
  isMaster: (): boolean => {
    const user = auth.getCurrentUser();
    return user?.role === 'master';
  }
};

// Gerenciamento de usuários (apenas MASTER)
export const userManagement = {
  create: (email: string, password: string, name: string): User => {
    if (typeof window === 'undefined') throw new Error('Not in browser');
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'master') {
      throw new Error('Apenas o administrador pode criar usuários');
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se email já existe
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email já cadastrado');
    }
    
    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
      role: 'user',
      active: true,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role as 'user',
      active: newUser.active,
      createdAt: newUser.createdAt
    };
  },
  
  list: (): User[] => {
    if (typeof window === 'undefined') return [];
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'master') {
      return [];
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    return users.map((u: any) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      active: u.active,
      createdAt: u.createdAt
    }));
  },
  
  toggleActive: (userId: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'master') {
      throw new Error('Apenas o administrador pode ativar/inativar usuários');
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const userIndex = users.findIndex((u: any) => u.id === userId);
    
    if (userIndex === -1) {
      throw new Error('Usuário não encontrado');
    }
    
    if (users[userIndex].role === 'master') {
      throw new Error('Não é possível inativar o usuário master');
    }
    
    users[userIndex].active = !users[userIndex].active;
    localStorage.setItem('users', JSON.stringify(users));
    
    return users[userIndex].active;
  },
  
  delete: (userId: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const currentUser = auth.getCurrentUser();
    if (!currentUser || currentUser.role !== 'master') {
      throw new Error('Apenas o administrador pode deletar usuários');
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.id === userId);
    
    if (user?.role === 'master') {
      throw new Error('Não é possível deletar o usuário master');
    }
    
    const filtered = users.filter((u: any) => u.id !== userId);
    localStorage.setItem('users', JSON.stringify(filtered));
    
    return true;
  }
};

// Análises
export const analyses = {
  save: (periodo: string, dataInicio: string | undefined, dataFim: string | undefined, data: any): SavedAnalysis => {
    if (typeof window === 'undefined') throw new Error('Not in browser');
    
    const user = auth.getCurrentUser();
    if (!user) throw new Error('Usuário não autenticado');
    
    const allAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    
    const analysis: SavedAnalysis = {
      id: Date.now().toString(),
      userId: user.id,
      periodo,
      dataInicio,
      dataFim,
      data,
      createdAt: new Date().toISOString()
    };
    
    allAnalyses.push(analysis);
    localStorage.setItem('analyses', JSON.stringify(allAnalyses));
    
    return analysis;
  },
  
  list: (): SavedAnalysis[] => {
    if (typeof window === 'undefined') return [];
    
    const user = auth.getCurrentUser();
    if (!user) return [];
    
    const allAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    return allAnalyses.filter((a: SavedAnalysis) => a.userId === user.id);
  },
  
  get: (id: string): SavedAnalysis | null => {
    if (typeof window === 'undefined') return null;
    
    const allAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    return allAnalyses.find((a: SavedAnalysis) => a.id === id) || null;
  },
  
  delete: (id: string): boolean => {
    if (typeof window === 'undefined') return false;
    
    const allAnalyses = JSON.parse(localStorage.getItem('analyses') || '[]');
    const filtered = allAnalyses.filter((a: SavedAnalysis) => a.id !== id);
    localStorage.setItem('analyses', JSON.stringify(filtered));
    
    return true;
  }
};
