# 📊 Guia: Importar do Google Sheets

## ✅ Implementado!

Agora você pode importar dados diretamente do Google Sheets sem precisar fazer download!

## 🎯 Como Funciona

### Passo 1: Prepare suas Planilhas

Crie duas planilhas no Google Sheets:
1. **Contas a Pagar** (Despesas)
2. **Contas a Receber** (Receitas)

### Passo 2: Formato das Planilhas

Cada planilha deve ter **3 colunas**:

| Loja | Conta | Valor |
|------|-------|-------|

#### Exemplo - Contas a Pagar:
```
A          B                    C
Loja       Conta                Valor
Matriz     Salários             10000,00
Filial 1   Aluguel              2500,00
Matriz     Energia Elétrica     450,00
Filial 1   Internet             200,00
```

#### Exemplo - Contas a Receber:
```
A          B                    C
Loja       Conta                Valor
Matriz     Vendas Produtos      25000,00
Filial 1   Vendas Produtos      18000,00
Matriz     Serviços             8500,00
```

### Passo 3: Tornar Planilhas Públicas

**IMPORTANTE:** As planilhas precisam estar públicas para o sistema acessar.

1. Abra sua planilha no Google Sheets
2. Clique em **"Compartilhar"** (canto superior direito)
3. Clique em **"Alterar para qualquer pessoa com o link"**
4. Certifique-se que está como **"Visualizador"**
5. Clique em **"Copiar link"**

### Passo 4: Usar no DFC Analyzer

1. Acesse: https://dfc-analyzer.vercel.app
2. Clique na aba **"Google Sheets"**
3. Cole o link da planilha de **Contas a Pagar**
4. Cole o link da planilha de **Contas a Receber**
5. Clique em **"Importar e Analisar"**

## 🔗 Formato do Link

O link deve ser algo como:
```
https://docs.google.com/spreadsheets/d/1ABC...XYZ/edit
```

## ⚠️ Erros Comuns

### ❌ "Não foi possível acessar a planilha"
**Solução:** Verifique se a planilha está pública (Qualquer pessoa com o link)

### ❌ "Nenhum dado encontrado"
**Solução:** Verifique se:
- A primeira linha é o cabeçalho
- As colunas estão na ordem: Loja, Conta, Valor
- Os valores estão no formato numérico

### ❌ "URL inválida"
**Solução:** Use o link completo do Google Sheets, não um link encurtado

## 💡 Dicas

### Formatação de Valores
No Google Sheets, você pode formatar a coluna "Valor" como:
- Número
- Moeda (R$)
- Personalizado

O sistema aceita todos os formatos!

### Múltiplas Abas
O sistema lê apenas a **primeira aba** da planilha.

### Atualização em Tempo Real
Se você atualizar a planilha no Google Sheets, basta clicar em "Importar e Analisar" novamente para ver os novos dados.

## 🎨 Exemplo Completo

### Planilha: Contas a Pagar
```
| Loja      | Conta              | Valor      |
|-----------|--------------------|-----------:|
| Matriz    | Salários           | 10.000,00  |
| Matriz    | Aluguel            |  2.500,00  |
| Filial 1  | Salários           |  8.000,00  |
| Filial 1  | Energia Elétrica   |    450,00  |
| Matriz    | Água               |    120,00  |
| Filial 1  | Internet           |    200,00  |
| Matriz    | Fornecedor ABC     |  5.000,00  |
| Filial 1  | Manutenção         |    800,00  |
```

### Planilha: Contas a Receber
```
| Loja      | Conta              | Valor      |
|-----------|--------------------|-----------:|
| Matriz    | Vendas Produtos    | 25.000,00  |
| Filial 1  | Vendas Produtos    | 18.000,00  |
| Matriz    | Serviços           |  8.500,00  |
| Filial 1  | Serviços           |  5.000,00  |
| Matriz    | Juros              |    120,00  |
| Matriz    | Aluguel Recebido   |  1.500,00  |
```

## 🚀 Vantagens

✅ **Sem Download** - Não precisa baixar arquivos
✅ **Atualização Fácil** - Edite no Google e reimporte
✅ **Colaborativo** - Várias pessoas podem editar
✅ **Backup Automático** - Google salva automaticamente
✅ **Acesso de Qualquer Lugar** - Basta ter o link

## 📊 Resultado

Após importar, você terá:
- **Total por Categoria** (Salários, Aluguel, Vendas, etc.)
- **Total por Loja** (Matriz, Filial 1, etc.)
- **Gráficos Interativos**
- **Análise Inteligente com IA**
- **Recomendações Personalizadas**

## 🔒 Segurança

- O sistema apenas **lê** os dados
- Não modifica suas planilhas
- Não armazena os dados
- Processamento em tempo real

## 📱 3 Formas de Usar o DFC Analyzer

1. **Upload Excel/PDF** - Faça upload de arquivos
2. **Google Sheets** - Importe diretamente do Google ✨ NOVO
3. **Entrada Manual** - Cole ou digite os dados

Escolha a forma que preferir!

---

**Versão:** 1.2
**Nova Funcionalidade:** Google Sheets
**Status:** ✅ Online e funcionando
