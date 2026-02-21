import { NextRequest, NextResponse } from 'next/server';

interface LinhaSheet {
  loja: string;
  conta: string;
  valor: number;
}

// Função para extrair ID da planilha do Google Sheets
function extrairSheetId(url: string): string | null {
  // Remover parâmetros da URL
  const urlLimpa = url.split('?')[0].split('#')[0];
  const match = urlLimpa.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : null;
}

// Função para extrair GID (ID da aba) se houver
function extrairGid(url: string): string {
  const match = url.match(/[?&#]gid=([0-9]+)/);
  return match ? match[1] : '0';
}

// Função para buscar dados do Google Sheets via CSV export
async function buscarDadosSheet(url: string): Promise<LinhaSheet[]> {
  const sheetId = extrairSheetId(url);
  
  if (!sheetId) {
    throw new Error('URL inválida do Google Sheets');
  }
  
  const gid = extrairGid(url);
  
  // URL para exportar como CSV (aba específica)
  const csvUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/export?format=csv&gid=${gid}`;
  
  try {
    const response = await fetch(csvUrl);
    
    if (!response.ok) {
      throw new Error('Não foi possível acessar a planilha. Verifique se ela está pública.');
    }
    
    const csvText = await response.text();
    const linhas = csvText.split('\n');
    const dados: LinhaSheet[] = [];
    
    // Pular primeira linha (cabeçalho) e processar o resto
    for (let i = 1; i < linhas.length; i++) {
      const linha = linhas[i].trim();
      if (!linha) continue;
      
      // Parse CSV (considerando valores entre aspas)
      const colunas = linha.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
      
      if (colunas.length >= 3) {
        const loja = (colunas[0] || '').replace(/"/g, '').trim();
        const conta = (colunas[1] || '').replace(/"/g, '').trim();
        const valorStr = (colunas[2] || '').replace(/"/g, '').trim();
        
        // Converter valor para número
        const valorLimpo = valorStr.replace(/R\$\s*/g, '').replace(/\./g, '').replace(',', '.');
        const valor = parseFloat(valorLimpo);
        
        if (loja && conta && !isNaN(valor) && valor > 0) {
          dados.push({ loja, conta, valor });
        }
      }
    }
    
    return dados;
  } catch (error) {
    throw new Error('Erro ao acessar planilha. Certifique-se de que ela está pública (Qualquer pessoa com o link pode visualizar).');
  }
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
function agruparDados(linhas: LinhaSheet[], tipo: 'despesa' | 'receita') {
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
    const { urlPagar, urlReceber } = await request.json();

    if (!urlPagar || !urlReceber) {
      return NextResponse.json({ error: 'URLs não enviadas' }, { status: 400 });
    }

    // Buscar dados das planilhas
    const linhasDespesas = await buscarDadosSheet(urlPagar);
    const linhasReceitas = await buscarDadosSheet(urlReceber);
    
    if (linhasDespesas.length === 0) {
      return NextResponse.json({ 
        error: 'Nenhum dado encontrado na planilha de Contas a Pagar. Verifique o formato.' 
      }, { status: 400 });
    }
    
    if (linhasReceitas.length === 0) {
      return NextResponse.json({ 
        error: 'Nenhum dado encontrado na planilha de Contas a Receber. Verifique o formato.' 
      }, { status: 400 });
    }
    
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
      error: error instanceof Error ? error.message : 'Erro ao processar planilhas do Google'
    }, { status: 500 });
  }
}
