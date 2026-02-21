# 📊 Formato do Excel para DFC Analyzer

## ✅ Estrutura Obrigatória

Seus arquivos Excel devem ter **3 colunas** na seguinte ordem:

| Loja | Conta | Valor |
|------|-------|-------|

## 📝 Exemplo: Contas a Pagar (Despesas)

| Loja | Conta | Valor |
|------|-------|-------|
| Matriz | Salários | 10000,00 |
| Matriz | Aluguel | 2500,00 |
| Filial 1 | Salários | 8000,00 |
| Filial 1 | Energia Elétrica | 450,00 |
| Matriz | Água | 120,00 |
| Filial 1 | Internet | 200,00 |
| Matriz | Fornecedor ABC | 5000,00 |
| Filial 1 | Manutenção | 800,00 |

## 📝 Exemplo: Contas a Receber (Receitas)

| Loja | Conta | Valor |
|------|-------|-------|
| Matriz | Vendas Produtos | 25000,00 |
| Filial 1 | Vendas Produtos | 18000,00 |
| Matriz | Serviços | 8500,00 |
| Filial 1 | Serviços | 5000,00 |
| Matriz | Juros | 120,00 |
| Matriz | Aluguel Recebido | 1500,00 |

## 🎯 Regras Importantes

### 1. Cabeçalho (Primeira Linha)
- A primeira linha deve conter os nomes das colunas
- Pode ser: "Loja", "Conta", "Valor" ou qualquer outro nome
- O sistema ignora a primeira linha

### 2. Coluna "Loja"
- Nome da loja/filial/unidade
- Exemplos: "Matriz", "Filial 1", "Loja Centro", "Unidade SP"
- Obrigatório

### 3. Coluna "Conta"
- Descrição da despesa ou receita
- Exemplos: "Salários", "Aluguel", "Vendas", "Serviços"
- Obrigatório

### 4. Coluna "Valor"
- Valor numérico
- Aceita formatos:
  - `10000` (sem centavos)
  - `10000,00` (com vírgula)
  - `10.000,00` (com ponto de milhar)
  - `R$ 10.000,00` (com símbolo)
- Obrigatório

## 📋 Formato do Arquivo

### Extensões Aceitas:
- `.xlsx` (Excel 2007+) ✅ Recomendado
- `.xls` (Excel 97-2003) ✅

### Estrutura:
- Apenas a primeira aba será lida
- Primeira linha = cabeçalho (ignorada)
- Demais linhas = dados

## ⚠️ Erros Comuns

### ❌ Coluna faltando
```
| Loja | Valor |  ← ERRADO (falta "Conta")
```

### ❌ Ordem errada
```
| Conta | Loja | Valor |  ← ERRADO (ordem incorreta)
```

### ❌ Valor não numérico
```
| Matriz | Salários | Dez mil |  ← ERRADO (use 10000)
```

### ✅ Formato Correto
```
| Loja | Conta | Valor |
| Matriz | Salários | 10000,00 |
```

## 🎨 Dicas de Formatação

### No Excel:
1. Coluna "Valor" pode ser formatada como:
   - Número
   - Moeda (R$)
   - Contábil
2. Use vírgula para separar decimais
3. Ponto para separar milhares (opcional)

### Exemplo Visual:
```
A1: Loja          B1: Conta              C1: Valor
A2: Matriz        B2: Salários           C2: 10.000,00
A3: Filial 1      B3: Aluguel            C3: 2.500,00
A4: Matriz        B4: Energia Elétrica   C4: 450,00
```

## 📥 Como Usar

1. Prepare dois arquivos Excel:
   - `contas_pagar.xlsx` (despesas)
   - `contas_receber.xlsx` (receitas)

2. Acesse: https://dfc-analyzer.vercel.app

3. Clique na aba "Upload Excel/PDF"

4. Selecione os arquivos

5. Clique em "Analisar e Gerar DFC"

## 🎯 Resultado

O sistema vai gerar:
- **Total por Categoria** (Salários, Aluguel, Vendas, etc.)
- **Total por Loja** (Matriz, Filial 1, etc.)
- **Gráficos Interativos**
- **Análise Inteligente com IA**
- **Recomendações Personalizadas**

## 💡 Exemplo Completo

Baixe os arquivos de exemplo:
- [contas_pagar_exemplo.xlsx](#)
- [contas_receber_exemplo.xlsx](#)

---

**Versão:** 1.2
**Suporte:** Excel + PDF
**Status:** ✅ Online
