# 🔧 Solução para PDFs que não são lidos

## ❌ Problema
O sistema não consegue ler os PDFs automaticamente. Isso pode acontecer porque:
- PDFs são escaneados (imagens, não texto)
- PDFs têm proteção/criptografia
- Formato do PDF não é padrão
- Texto está em formato não reconhecido

## ✅ Solução: Entrada Manual de Dados

Agora o sistema tem **2 modos de entrada**:

### 1️⃣ Upload PDF (Automático)
- Para PDFs com texto extraível
- Processamento automático

### 2️⃣ Entrada Manual (Recomendado se PDF não funcionar)
- Cole os dados diretamente
- Controle total sobre os valores
- Mais preciso

---

## 📝 Como Usar a Entrada Manual

### Passo 1: Acesse o Sistema
https://dfc-analyzer.vercel.app

### Passo 2: Clique na Aba "Entrada Manual"
Você verá dois campos de texto grandes.

### Passo 3: Copie os Dados do PDF

#### Opção A: Copiar do PDF
1. Abra seu PDF
2. Selecione e copie o texto
3. Cole no campo correspondente

#### Opção B: Digitar Manualmente
Digite cada linha no formato:
```
Descrição R$ 1.234,56
```

### Passo 4: Formato dos Dados

#### Contas a Pagar (Despesas):
```
Salários R$ 10.000,00
Aluguel R$ 2.500,00
Energia Elétrica R$ 450,00
Água R$ 120,00
Internet R$ 200,00
Fornecedor ABC R$ 5.000,00
```

#### Contas a Receber (Receitas):
```
Vendas de Produtos R$ 25.000,00
Prestação de Serviços R$ 8.500,00
Juros Recebidos R$ 120,00
Aluguel Recebido R$ 1.500,00
```

### Passo 5: Clique em "Analisar Dados"

Pronto! O sistema vai processar e gerar:
- DFC completo
- Gráficos interativos
- Análise inteligente com IA
- Recomendações personalizadas

---

## 💡 Dicas

### Formato Aceito:
✅ `Descrição R$ 1.234,56`
✅ `Descrição 1.234,56`
✅ `Descrição R$ 1234,56`

### Não Precisa:
- Alinhar os valores
- Usar tabs ou espaços específicos
- Remover linhas em branco

### Cada Linha:
- Uma descrição + um valor
- Pode ter espaços entre descrição e valor
- Valor no formato brasileiro (vírgula para centavos)

---

## 🎯 Exemplo Completo

### Contas a Pagar:
```
Salário João Silva R$ 3.500,00
Salário Maria Santos R$ 4.200,00
Aluguel Escritório R$ 2.000,00
Energia Elétrica Janeiro R$ 450,00
Água e Esgoto R$ 120,00
Internet Fibra R$ 200,00
Telefone Fixo R$ 80,00
Fornecedor Materiais R$ 5.000,00
Manutenção Equipamentos R$ 800,00
Impostos Municipais R$ 1.200,00
```

### Contas a Receber:
```
Venda Produto A R$ 10.000,00
Venda Produto B R$ 8.500,00
Venda Produto C R$ 6.500,00
Serviço Consultoria Cliente X R$ 5.000,00
Serviço Consultoria Cliente Y R$ 3.500,00
Juros Aplicação Financeira R$ 120,00
Aluguel Sala Comercial R$ 1.500,00
```

---

## 🚀 Vantagens da Entrada Manual

✅ **Mais Preciso** - Você controla exatamente o que entra
✅ **Mais Rápido** - Não depende de processamento de PDF
✅ **Mais Flexível** - Funciona com qualquer fonte de dados
✅ **Sem Erros** - Não há risco de valores mal interpretados

---

## ❓ Perguntas Frequentes

### Posso misturar os dois modos?
Não, escolha um: Upload PDF ou Entrada Manual.

### Preciso colocar R$ antes dos valores?
Não é obrigatório. Funciona com ou sem.

### Posso usar ponto como separador de decimal?
Não, use vírgula (formato brasileiro): 1.234,56

### E se eu errar um valor?
Basta voltar e fazer nova análise com os dados corretos.

### Os dados ficam salvos?
Não, tudo é processado em tempo real e não é armazenado.

---

## 📊 Resultado

Após processar, você terá:
- **Resumo Financeiro** com totais
- **Gráficos** de pizza e barras
- **Análise Inteligente** com IA
- **Recomendações** personalizadas
- **Indicadores** financeiros

---

**Versão:** 1.1
**Atualização:** Entrada Manual adicionada
**Status:** ✅ Online e funcionando
