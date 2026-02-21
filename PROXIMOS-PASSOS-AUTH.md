# 🔐 Próximos Passos - Sistema de Autenticação

## ✅ O que já foi preparado:

1. **package.json** - Dependências adicionadas:
   - next-auth (autenticação)
   - @supabase/supabase-js (banco de dados)
   - bcryptjs (criptografia de senhas)

2. **SETUP-BANCO.md** - Guia completo de configuração do Supabase

3. **lib/supabase.ts** - Cliente do Supabase configurado

## 📋 O que precisa ser implementado:

### 1. Telas de Autenticação
- [ ] Página de Login (`/login`)
- [ ] Página de Cadastro (`/register`)
- [ ] Componente de formulário de login
- [ ] Componente de formulário de cadastro

### 2. APIs de Autenticação
- [ ] `/api/auth/register` - Criar conta
- [ ] `/api/auth/login` - Fazer login
- [ ] `/api/auth/logout` - Fazer logout
- [ ] Middleware de autenticação

### 3. Histórico de Análises
- [ ] `/api/analyses/save` - Salvar análise
- [ ] `/api/analyses/list` - Listar análises do usuário
- [ ] `/api/analyses/[id]` - Ver análise específica
- [ ] `/api/analyses/delete/[id]` - Deletar análise

### 4. Interface do Usuário
- [ ] Dashboard com histórico
- [ ] Filtro por período
- [ ] Botão "Salvar Análise" após gerar DFC
- [ ] Modal para informar período
- [ ] Lista de análises salvas
- [ ] Visualizar análise antiga

### 5. Proteção de Rotas
- [ ] Middleware para verificar autenticação
- [ ] Redirecionar para login se não autenticado
- [ ] Proteger rotas de análise

## 🎯 Fluxo do Usuário

### Novo Usuário:
1. Acessa o site
2. Clica em "Criar Conta"
3. Preenche email e senha
4. Faz login automaticamente
5. Usa o sistema normalmente

### Usuário Existente:
1. Acessa o site
2. Faz login
3. Vê dashboard com histórico
4. Pode criar nova análise ou ver antigas

### Após Gerar Análise:
1. Sistema mostra resultados
2. Botão "Salvar Análise" aparece
3. Modal pede: Período (ex: "Janeiro 2024")
4. Análise é salva no banco
5. Aparece no histórico

## 🗄️ Estrutura do Banco

```
users
├── id (UUID)
├── email (único)
├── password_hash
├── name
└── created_at

analyses
├── id (UUID)
├── user_id (FK → users)
├── periodo ("Janeiro 2024")
├── data_inicio
├── data_fim
├── receitas_total
├── despesas_total
├── saldo
├── receitas_por_categoria (JSON)
├── despesas_por_categoria (JSON)
├── receitas_por_loja (JSON)
├── despesas_por_loja (JSON)
└── created_at
```

## 🚀 Como Continuar

### Passo 1: Configurar Supabase
Siga o guia em `SETUP-BANCO.md`

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Configurar .env.local
```env
NEXT_PUBLIC_SUPABASE_URL=sua-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave
NEXTAUTH_URL=http://localhost:3060
NEXTAUTH_SECRET=sua-secret
```

### Passo 4: Implementar Componentes
Criar os componentes e páginas listados acima.

## 💡 Funcionalidades Futuras

- [ ] Recuperação de senha
- [ ] Editar perfil
- [ ] Exportar análise para PDF
- [ ] Comparar períodos
- [ ] Gráficos de evolução
- [ ] Notificações por email
- [ ] Compartilhar análise

---

**Status:** Preparação concluída
**Próximo:** Implementar telas e APIs
