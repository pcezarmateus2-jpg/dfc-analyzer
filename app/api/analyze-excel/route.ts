import { NextRequest, NextResponse } from 'next/server';
import ExcelJS from 'exceljs';

interface LinhaExcel {
  loja: string;
  conta: string;
  valor: number;
}

// Função para processar arquivo Excel
async function processarExcel(file: File): Promise<LinhaExcel[]> {
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.load(buffer as any);
  
  const worksheet = workbook.worksheets[0]; // Primeira aba
  const linhas: LinhaExcel[] = [];
  
  // Pular a primeira linha (cabeçalho) e processar o resto
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber === 1) return; // Pular cabeçalho
    
    const loja = row.getCell(1).value?.toString().trim() || '';
    const conta = row.getCell(2).value?.toString().trim() || '';
    const valorCell = row.getCell(3).value;
    
    // Tentar converter valor para número
    let valor = 0;
    if (typeof valorCell === 'number') {
      valor = valorCell;
    } else if (typeof valorCell === 'string') {
      // Remover R$, pontos e substituir vírgula por ponto
      const valorLimpo = valorCell.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.');
      valor = parseFloat(valorLimpo);
    }
    
    // Validar e adicionar
    if (loja && conta && !isNaN(valor) && valor > 0) {
      linhas.push({ loja, conta, valor });
    }
  });
  
  return linhas;
}

// Função para categorizar despesas
function categorizarDespesa(conta: string): string {
  const contaLower = conta.toLowerCase();
  
  if (contaLower.includes('salario') || contaLower.includes('salário') || 
      contaLower.includes('folha') || contaLower.includes('funcionario')) {
    return 'Salários e Encargos';
  }
  if (contaLower.includes('aluguel') || contaLower.includes('aluguer') || 
      contaLower.includes('locação') || contaLower.includes('locacao')) {
    return 'Aluguel';
  }
  if (contaLower.includes('energia') || contaLower.includes('luz') || 
      contaLower.includes('eletric')) {
    return 'Energia Elétrica';
  }
  if (contaLower.includes('agua') || contaLower.includes('água') || 
      contaLower.includes('saneamento')) {
    return 'Água e Saneamento';
  }
  if (contaLower.includes('telefone') || contaLower.includes('internet') || 
      contaLower.includes('telecom')) {
    return 'Telecomunicações';
  }
  if (contaLower.includes('marketing') || contaLower.includes('publicidade') || 
      contaLower.includes('propaganda')) {
    return 'Marketing';
  }
  if (contaLower.includes('fornecedor') || contaLower.includes('compra') || 
      contaLower.includes('mercadoria')) {
    return 'Fornecedores';
  }
  if (contaLower.includes('imposto') || contaLower.includes('taxa') || 
      contaLower.includes('tributo')) {
    return 'Impostos e Taxas';
  }
  if (contaLower.includes('manutencao') || contaLower.includes('manutenção') || 
      contaLower.includes('reparo')) {
    return 'Manutenção';
  }
  
  return conta || 'Outras Despesas';
}

// Função para categorizar receitas
function categorizarReceita(conta: string): string {
  const contaLower = conta.toLowerCase();
  
  if (contaLower.includes('venda') || contaLower.includes('produto')) {
    return 'Vendas de Produtos';
  }
  if (contaLower.includes('servico') || contaLower.includes('serviço') || 
      contaLower.includes('prestacao') || contaLower.includes('prestação')) {
    return 'Prestação de Serviços';
  }
  if (contaLower.includes('juros') || contaLower.includes('rendimento') || 
      contaLower.includes('aplicacao') || contaLower.includes('aplicação')) {
    return 'Receitas Financeiras';
  }
  if (contaLower.includes('aluguel') || contaLower.includes('locacao') || 
      contaLower.includes('locação')) {
    return 'Aluguéis Recebidos';
  }
  
  return conta || 'Outras Receitas';
}

// Função para agrupar dados
function agruparDados(linhas: LinhaExcel[], tipo: 'despesa' | 'receita') {
  const porCategoria: { [key: string]: number } = {};
  const porLoja: { [key: string]: number } = {};
  let total = 0;
  
  for (const { loja, conta, valor } of linhas) {
    // Agrupar por categoria
    const categoria = tipo === 'despesa' 
      ? categorizarDespesa(conta)
      : categorizarReceita(conta);
    
    if (!porCategoria[categoria]) {
      porCategoria[categoria] = 0;
    }
    porCategoria[categoria] += valor;
    
    // Agrupar por loja
    if (!porLoja[loja]) {
      porLoja[loja] = 0;
    }
    porLoja[loja] += valor;
    
    total += valor;
  }
  
  return { total, porCategoria, porLoja };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const contasPagar = formData.get('contasPagar') as File;
    const contasReceber = formData.get('contasReceber') as File;

    if (!contasPagar || !contasReceber) {
      return NextResponse.json({ error: 'Arquivos não enviados' }, { status: 400 });
    }

    // Processar Excel
    const linhasDespesas = await processarExcel(contasPagar);
    const linhasReceitas = await processarExcel(contasReceber);
    
    // Agrupar dados
    const despesas = agruparDados(linhasDespesas, 'despesa');
    const receitas = agruparDados(linhasReceitas, 'receita');
    
    const saldo = receitas.total - despesas.total;

    const resultado = {
      receitas: {
        total: receitas.total,
        porCategoria: receitas.porCategoria,
        porLoja: receitas.porLoja
      },
      despesas: {
        total: despesas.total,
        porCategoria: despesas.porCategoria,
        porLoja: despesas.porLoja
      },
      saldo,
      debug: {
        quantidadeLinhasPagar: linhasDespesas.length,
        quantidadeLinhasReceber: linhasReceitas.length,
        primeiraLinhaPagar: linhasDespesas[0],
        primeiraLinhaReceber: linhasReceitas[0]
      }
    };

    return NextResponse.json(resultado);
  } catch (error) {
    console.error('Erro ao processar:', error);
    return NextResponse.json({ 
      error: 'Erro ao processar arquivos Excel',
      detalhes: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 });
  }
}
