import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const contasPagar = formData.get('contasPagar') as File;
    const contasReceber = formData.get('contasReceber') as File;

    if (!contasPagar || !contasReceber) {
      return NextResponse.json({ error: 'Arquivos não enviados' }, { status: 400 });
    }

    // Simulação de extração de PDF (em produção, use pdf-parse ou similar)
    // Por enquanto, vamos retornar dados de exemplo
    const dadosExemplo = {
      receitas: {
        total: 95000,
        porCategoria: {
          'Vendas': 50000,
          'Serviços': 30000,
          'Outras Receitas': 15000
        }
      },
      despesas: {
        total: 73500,
        porCategoria: {
          'Salários': 35000,
          'Aluguel': 8000,
          'Energia': 2500,
          'Marketing': 5000,
          'Outras Despesas': 23000
        }
      },
      saldo: 21500
    };

    return NextResponse.json(dadosExemplo);
  } catch (error) {
    console.error('Erro ao processar:', error);
    return NextResponse.json({ error: 'Erro ao processar arquivos' }, { status: 500 });
  }
}
