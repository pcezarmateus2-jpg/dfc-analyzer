import { NextRequest, NextResponse } from 'next/server';
import pdf from 'pdf-parse';

// Função para extrair valores monetários do texto
function extrairValores(texto: string): number[] {
  // Padrões para valores em reais: R$ 1.234,56 ou 1.234,56 ou 1234,56
  const padroes = [
    /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g,
    /(\d{1,3}(?:\.\d{3})*,\d{2})/g,
    /(\d+,\d{2})/g
  ];
  
  const valores: number[] = [];
  
  for (const padrao of padroes) {
    const matches = texto.matchAll(padrao);
    for (const match of matches) {
      const valorStr = match[1].replace(/\./g, '').replace(',', '.');
      const valor = parseFloat(valorStr);
      if (!isNaN(valor) && valor > 0) {
        valores.push(valor);
      }
    }
  }
  
  return valores;
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
  const valores = extrairValores(texto);
  
  // Dividir texto em linhas para melhor categorização
  const linhas = texto.split('\n').filter(l => l.trim());
  
  const categorias: { [key: string]: number } = {};
  let total = 0;
  
  // Tentar associar valores com suas categorias
  valores.forEach((valor, index) => {
    // Pegar contexto ao redor do valor (linhas próximas)
    const contexto = linhas.slice(Math.max(0, index - 2), index + 3).join(' ');
    
    const categoria = tipo === 'despesa' 
      ? categorizarDespesa(contexto, valor)
      : categorizarReceita(contexto, valor);
    
    if (!categorias[categoria]) {
      categorias[categoria] = 0;
    }
    categorias[categoria] += valor;
    total += valor;
  });
  
  // Se não encontrou valores, tentar extrair de forma mais agressiva
  if (total === 0) {
    // Buscar números que possam ser valores
    const numerosGerais = texto.match(/\d+[.,]\d{2}/g);
    if (numerosGerais) {
      numerosGerais.forEach(num => {
        const valor = parseFloat(num.replace('.', '').replace(',', '.'));
        if (!isNaN(valor) && valor > 0 && valor < 1000000) {
          const categoria = tipo === 'despesa' ? 'Despesas Gerais' : 'Receitas Gerais';
          if (!categorias[categoria]) {
            categorias[categoria] = 0;
          }
          categorias[categoria] += valor;
          total += valor;
        }
      });
    }
  }
  
  return {
    total,
    porCategoria: categorias,
    textoExtraido: texto.substring(0, 500) // Para debug
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
