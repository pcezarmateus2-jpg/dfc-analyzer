// Sistema de autenticação simples com localStorage

export interface User {
  id: string;
  email: string;
  name: string;
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

// Autenticação
export const auth = {
  register: (email: string, password: string, name: string): User | null => {
    if (typeof window === 'undefined') return null;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Verificar se email já existe
    if (users.find((u: any) => u.email === email)) {
      throw new Error('Email já cadastrado');
    }
    
    const user: User = {
      id: Date.now().toString(),
      email,
      name
    };
    
    users.push({ ...user, password });
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(user));
    
    return user;
  },
  
  login: (email: string, password: string): User | null => {
    if (typeof window === 'undefined') return null;
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u: any) => u.email === email && u.password === password);
    
    if (!user) {
      throw new Error('Email ou senha incorretos');
    }
    
    const userData: User = {
      id: user.id,
      email: user.email,
      name: user.name
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
