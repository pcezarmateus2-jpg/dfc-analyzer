# 🗄️ Configuração do Banco de Dados

## 📋 Passo a Passo

### 1. Criar Conta no Supabase

1. Acesse: https://supabase.com
2. Clique em "Start your project"
3. Faça login com GitHub
4. Crie um novo projeto:
   - Nome: `dfc-analyzer`
   - Database Password: (escolha uma senha forte)
   - Region: South America (São Paulo)

### 2. Criar Tabelas

No Supabase Dashboard, vá em **SQL Editor** e execute:

```sql
-- Tabela de usuários
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Tabela de análises
CREATE TABLE analyses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  periodo VARCHAR(50) NOT NULL,
  data_inicio DATE,
  data_fim DATE,
  receitas_total DECIMAL(15,2) NOT NULL,
  despesas_total DECIMAL(15,2) NOT NULL,
  saldo DECIMAL(15,2) NOT NULL,
  receitas_por_categoria JSONB,
  despesas_por_categoria JSONB,
  receitas_por_loja JSONB,
  despesas_por_loja JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_analyses_user_id ON analyses(user_id);
CREATE INDEX idx_analyses_periodo ON analyses(periodo);
CREATE INDEX idx_analyses_created_at ON analyses(created_at DESC);

-- Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE analyses ENABLE ROW LEVEL SECURITY;

-- Políticas de segurança
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view own analyses" ON analyses
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analyses" ON analyses
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own analyses" ON analyses
  FOR DELETE USING (auth.uid() = user_id);
```

### 3. Obter Credenciais

No Supabase Dashboard:

1. Vá em **Settings** → **API**
2. Copie:
   - `Project URL` (NEXT_PUBLIC_SUPABASE_URL)
   - `anon public` key (NEXT_PUBLIC_SUPABASE_ANON_KEY)

### 4. Configurar Variáveis de Ambiente

Crie o arquivo `.env.local` na raiz do projeto:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-anon-aqui

# NextAuth
NEXTAUTH_URL=http://localhost:3060
NEXTAUTH_SECRET=gere-uma-chave-secreta-aqui
```

Para gerar NEXTAUTH_SECRET:
```bash
openssl rand -base64 32
```

### 5. Deploy no Vercel

No Vercel Dashboard:

1. Vá em **Settings** → **Environment Variables**
2. Adicione as mesmas variáveis do `.env.local`
3. Faça redeploy

---

## 📊 Estrutura do Banco

### Tabela: users
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único do usuário |
| email | VARCHAR | Email (único) |
| password_hash | VARCHAR | Senha criptografada |
| name | VARCHAR | Nome do usuário |
| created_at | TIMESTAMP | Data de criação |

### Tabela: analyses
| Campo | Tipo | Descrição |
|-------|------|-----------|
| id | UUID | ID único da análise |
| user_id | UUID | ID do usuário |
| periodo | VARCHAR | Ex: "Janeiro 2024" |
| data_inicio | DATE | Data inicial |
| data_fim | DATE | Data final |
| receitas_total | DECIMAL | Total de receitas |
| despesas_total | DECIMAL | Total de despesas |
| saldo | DECIMAL | Saldo final |
| receitas_por_categoria | JSONB | Detalhes por categoria |
| despesas_por_categoria | JSONB | Detalhes por categoria |
| receitas_por_loja | JSONB | Detalhes por loja |
| despesas_por_loja | JSONB | Detalhes por loja |
| created_at | TIMESTAMP | Data da análise |

---

## 🔒 Segurança

- ✅ Senhas criptografadas com bcrypt
- ✅ Row Level Security (RLS) habilitado
- ✅ Cada usuário vê apenas seus dados
- ✅ HTTPS obrigatório
- ✅ Tokens JWT seguros

---

## 🚀 Pronto!

Após configurar, o sistema terá:
- ✅ Login e cadastro
- ✅ Histórico de análises
- ✅ Filtro por período
- ✅ Dados seguros no banco
