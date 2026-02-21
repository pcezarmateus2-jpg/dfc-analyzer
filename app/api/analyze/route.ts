import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

// Função para extrair valores monetários do texto com contexto
function extrairValoresComContexto(texto: string): Array<{ valor: number; linha: string }> {
  const linhas = texto.split('\n');
  const valoresComContexto: Array<{ valor: number; linha: string }> = [];
  
  // Padrões mais específicos para valores monetários
  const padraoValor = /(?:R\$\s*)?(\d{1,3}(?:\.\d{3})*,\d{2})/g;
  
  for (const linha of linhas) {
    const linhaLimpa = linha.trim();
    if (!linhaLimpa) continue;
    
    let match;
    padraoValor.lastIndex = 0; // Reset regex
    
    while ((match = padraoValor.exec(linhaLimpa)) !== null) {
      const valorStr = match[1].replace(/\./g, '').replace(',', '.');
      const valor = parseFloat(valorStr);
      
      // Filtrar valores muito pequenos (provavelmente não são valores monetários)
      if (!isNaN(valor) && valor >= 0.01 && valor < 10000000) {
        valoresComContexto.push({ valor, linha: linhaLimpa });
      }
    }
  }
  
  return valoresComContexto;
}

// Função para extrair apenas os valores
function extrairValores(texto: string): number[] {
  return extrairValoresComContexto(texto).map(v => v.valor);
}

// Função para categorizar despesas baseado em palavras-chave
function categorizarDespesa(texto: string, valor: number): string {
  const textoLower = texto.toLowerCase();
  
  if (textoLower.includes('salario') || textoLower.includes('salário') || 
      textoLower.includes('folha') || textoLower.includes('funcionario')) {
    return 'Salários e Encargos';
  }
  if (textoLower.includes('aluguel') || textoLower.includes('aluguer') || 
      textoLower.includes('locação') || textoLower.includes('locacao')) {
    return 'Aluguel';
  }
  if (textoLower.includes('energia') || textoLower.includes('luz') || 
      textoLower.includes('eletric')) {
    return 'Energia Elétrica';
  }
  if (textoLower.includes('agua') || textoLower.includes('água') || 
      textoLower.includes('saneamento')) {
    return 'Água e Saneamento';
  }
  if (textoLower.includes('telefone') || textoLower.includes('internet') || 
      textoLower.includes('telecom')) {
    return 'Telecomunicações';
  }
  if (textoLower.includes('marketing') || textoLower.includes('publicidade') || 
      textoLower.includes('propaganda')) {
    return 'Marketing';
  }
  if (textoLower.includes('fornecedor') || textoLower.includes('compra') || 
      textoLower.includes('mercadoria')) {
    return 'Fornecedores';
  }
  if (textoLower.includes('imposto') || textoLower.includes('taxa') || 
      textoLower.includes('tributo')) {
    return 'Impostos e Taxas';
  }
  if (textoLower.includes('manutencao') || textoLower.includes('manutenção') || 
      textoLower.includes('reparo')) {
    return 'Manutenção';
  }
  
  return 'Outras Despesas';
}

// Função para categorizar receitas
function categorizarReceita(texto: string, valor: number): string {
  const textoLower = texto.toLowerCase();
  
  if (textoLower.includes('venda') || textoLower.includes('produto')) {
    return 'Vendas de Produtos';
  }
  if (textoLower.includes('servico') || textoLower.includes('serviço') || 
      textoLower.includes('prestacao') || textoLower.includes('prestação')) {
    return 'Prestação de Serviços';
  }
  if (textoLower.includes('juros') || textoLower.includes('rendimento') || 
      textoLower.includes('aplicacao') || textoLower.includes('aplicação')) {
    return 'Receitas Financeiras';
  }
  if (textoLower.includes('aluguel') || textoLower.includes('locacao') || 
      textoLower.includes('locação')) {
    return 'Aluguéis Recebidos';
  }
  
  return 'Outras Receitas';
}

// Função para processar PDF e extrair dados estruturados
async function processarPDF(file: File, tipo: 'despesa' | 'receita') {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  const data = await pdf(buffer);
  
  const texto = data.text;
  const valoresComContexto = extrairValoresComContexto(texto);
  
  const categorias: { [key: string]: number } = {};
  let total = 0;
  
  // Processar cada valor com seu contexto
  for (const { valor, linha } of valoresComContexto) {
    const categoria = tipo === 'despesa' 
      ? categorizarDespesa(linha, valor)
      : categorizarReceita(linha, valor);
    
    if (!categorias[categoria]) {
      categorias[categoria] = 0;
    }
    categorias[categoria] += valor;
    total += valor;
  }
  
  // Se não encontrou valores, retornar informação de debug
  if (total === 0) {
    return {
      total: 0,
      porCategoria: {},
      textoExtraido: texto.substring(0, 1000),
      aviso: 'Nenhum valor monetário foi encontrado no PDF. Verifique se o formato está correto.'
    };
  }
  
  return {
    total,
    porCategoria: categorias,
    textoExtraido: texto.substring(0, 500),
    quantidadeValores: valoresComContexto.length
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const contasPagar = formData.get('contasPagar') as File;
    const contasReceber = formData.get('contasReceber') as File;

    if (!contasPagar || !contasReceber) {
      return NextResponse.json({ error: 'Arquivos não enviados' }, { status: 400 });
    }

    // Processar PDFs
    const despesas = await processarPDF(contasPagar, 'despesa');
    const receitas = await processarPDF(contasReceber, 'receita');
    
    const saldo = receitas.total - despesas.total;

    const resultado = {
      receitas: {
        total: receitas.total,
        porCategoria: receitas.porCategoria
      },
      despesas: {
        total: despesas.total,
        porCategoria: despesas.porCategoria
      },
      saldo,
      debug: {
        textoContasPagar: despesas.textoExtraido,
        textoContasReceber: receitas.textoExtraido
      }
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao processar:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar arquivos',
      detalhes: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
