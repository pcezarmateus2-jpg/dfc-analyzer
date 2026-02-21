# 📖 Como Funciona a Leitura de PDF

## ✅ Melhorias Implementadas

O sistema agora **lê os PDFs de verdade** usando a biblioteca `pdf-parse`. Antes estava retornando apenas dados de exemplo.

## 🔍 Como o Sistema Extrai os Dados

### 1. Extração de Texto
- O PDF é convertido em texto puro
- Todo o conteúdo é analisado linha por linha

### 2. Identificação de Valores
O sistema busca valores monetários em vários formatos:
- `R$ 1.234,56`
- `1.234,56`
- `1234,56`

### 3. Categorização Inteligente

#### Para DESPESAS (Contas a Pagar):
O sistema identifica categorias baseado em palavras-chave:

- **Salários e Encargos**: salário, folha, funcionário
- **Aluguel**: aluguel, locação
- **Energia Elétrica**: energia, luz, elétrica
- **Água e Saneamento**: água, saneamento
- **Telecomunicações**: telefone, internet, telecom
- **Marketing**: marketing, publicidade, propaganda
- **Fornecedores**: fornecedor, compra, mercadoria
- **Impostos e Taxas**: imposto, taxa, tributo
- **Manutenção**: manutenção, reparo
- **Outras Despesas**: tudo que não se encaixa acima

#### Para RECEITAS (Contas a Receber):
- **Vendas de Produtos**: venda, produto
- **Prestação de Serviços**: serviço, prestação
- **Receitas Financeiras**: juros, rendimento, aplicação
- **Aluguéis Recebidos**: aluguel, locação
- **Outras Receitas**: tudo que não se encaixa acima

## 📋 Formato Ideal dos PDFs

Para melhor precisão, seus PDFs devem conter:

### Contas a Pagar (Despesas):
```
Descrição                    Valor
Salário João Silva          R$ 3.500,00
Aluguel Escritório          R$ 2.000,00
Conta de Luz - Janeiro      R$ 450,00
Fornecedor ABC Ltda         R$ 5.000,00
```

### Contas a Receber (Receitas):
```
Descrição                    Valor
Venda Produto X             R$ 10.000,00
Serviço Consultoria         R$ 5.000,00
Aluguel Imóvel              R$ 2.500,00
```

## 🎯 O que o Sistema Faz

1. **Lê ambos os PDFs** (contas a pagar e receber)
2. **Extrai todos os valores** encontrados
3. **Categoriza automaticamente** baseado no contexto
4. **Calcula o total** de receitas e despesas
5. **Gera o DFC** (Demonstração de Fluxo de Caixa)
6. **Cria análise inteligente** com recomendações
7. **Gera gráficos** interativos

## 🔧 Melhorias Futuras Possíveis

Se os PDFs não estiverem sendo lidos corretamente, podemos:

1. **Adicionar mais padrões de valores** (ex: valores sem vírgula)
2. **Melhorar categorização** com mais palavras-chave
3. **Usar OCR** para PDFs escaneados (imagens)
4. **Adicionar IA real** (OpenAI) para categorização mais precisa
5. **Permitir correção manual** das categorias

## 🧪 Como Testar

1. Acesse: https://dfc-analyzer.vercel.app
2. Envie seus PDFs reais
3. Veja os resultados
4. Se os valores não estiverem corretos, me envie os PDFs para eu ajustar o código

## 📊 Debug

O sistema agora retorna também um campo `debug` com os primeiros 500 caracteres extraídos de cada PDF. Isso ajuda a identificar se o PDF está sendo lido corretamente.

Se você ver o campo debug vazio ou com caracteres estranhos, pode ser que:
- O PDF seja uma imagem escaneada (precisa OCR)
- O PDF tenha proteção/criptografia
- O formato do PDF não seja padrão
