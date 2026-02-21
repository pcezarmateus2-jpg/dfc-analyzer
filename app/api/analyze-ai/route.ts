import { NextRequest, NextResponse } from 'next/server';

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
  }).format(value);
}

function analisarFluxoCaixa(data: any): string {
  const { receitas, despesas, saldo } = data;
  
  // Cálculos
  const margemLucro = ((saldo / receitas.total) * 100).toFixed(1);
  const percentualDespesas = ((despesas.total / receitas.total) * 100).toFixed(1);
  const saldoPositivo = saldo >= 0;
  
  // Encontrar maior receita e despesa
  const maiorReceita = Object.entries(receitas.porCategoria || {})
    .sort((a: any, b: any) => b[1] - a[1])[0];
  const maiorDespesa = Object.entries(despesas.porCategoria || {})
    .sort((a: any, b: any) => b[1] - a[1])[0];
  
  // Análise de saúde financeira
  let saudeFinanceira = '';
  if (margemLucro > 20) {
    saudeFinanceira = 'EXCELENTE - Margem de lucro muito saudável';
  } else if (margemLucro > 10) {
    saudeFinanceira = 'BOA - Margem de lucro adequada';
  } else if (margemLucro > 0) {
    saudeFinanceira = 'REGULAR - Margem de lucro baixa, atenção necessária';
  } else {
    saudeFinanceira = 'CRÍTICA - Despesas superiores às receitas';
  }
  
  // Gerar análise
  let analise = `📊 ANÁLISE FINANCEIRA INTELIGENTE

═══════════════════════════════════════════════════════════

1️⃣ SITUAÇÃO GERAL
${saudeFinanceira}

• Saldo Final: ${formatCurrency(saldo)} ${saldoPositivo ? '✅' : '⚠️'}
• Margem de Lucro: ${margemLucro}%
• Despesas representam ${percentualDespesas}% das receitas

═══════════════════════════════════════════════════════════

2️⃣ ANÁLISE DE RECEITAS
Total: ${formatCurrency(receitas.total)}

`;

  // Análise de receitas
  if (maiorReceita) {
    const percentual = ((maiorReceita[1] as number / receitas.total) * 100).toFixed(1);
    analise += `• Maior fonte: ${maiorReceita[0]} (${percentual}% do total)\n`;
    analise += `  Valor: ${formatCurrency(maiorReceita[1] as number)}\n\n`;
  }

  const numFontesReceita = Object.keys(receitas.porCategoria || {}).length;
  if (numFontesReceita <= 2) {
    analise += `⚠️ ALERTA: Apenas ${numFontesReceita} fonte(s) de receita identificada(s)\n`;
    analise += `   Recomendação: Diversificar fontes de receita para reduzir riscos\n\n`;
  } else {
    analise += `✅ Boa diversificação: ${numFontesReceita} fontes de receita\n\n`;
  }

  analise += `═══════════════════════════════════════════════════════════

3️⃣ ANÁLISE DE DESPESAS
Total: ${formatCurrency(despesas.total)}

`;

  // Análise de despesas
  if (maiorDespesa) {
    const percentual = ((maiorDespesa[1] as number / despesas.total) * 100).toFixed(1);
    analise += `• Maior despesa: ${maiorDespesa[0]} (${percentual}% do total)\n`;
    analise += `  Valor: ${formatCurrency(maiorDespesa[1] as number)}\n\n`;
    
    if (percentual > 40) {
      analise += `⚠️ ATENÇÃO: Esta categoria representa mais de 40% das despesas\n`;
      analise += `   Avalie possibilidades de otimização\n\n`;
    }
  }

  if (percentualDespesas > 90) {
    analise += `🔴 CRÍTICO: Despesas muito altas (${percentualDespesas}% das receitas)\n`;
    analise += `   Ação urgente necessária para reduzir custos\n\n`;
  } else if (percentualDespesas > 80) {
    analise += `⚠️ ATENÇÃO: Despesas elevadas (${percentualDespesas}% das receitas)\n`;
    analise += `   Recomenda-se revisar e otimizar custos\n\n`;
  } else {
    analise += `✅ Despesas controladas (${percentualDespesas}% das receitas)\n\n`;
  }

  analise += `═══════════════════════════════════════════════════════════

4️⃣ RECOMENDAÇÕES ESTRATÉGICAS

`;

  // Recomendações personalizadas
  const recomendacoes = [];
  
  if (saldo < receitas.total * 0.1) {
    recomendacoes.push('💰 Criar reserva de emergência de 3-6 meses de despesas');
  }
  
  if (numFontesReceita <= 2) {
    recomendacoes.push('📈 Diversificar fontes de receita para reduzir dependência');
  }
  
  if (percentualDespesas > 80) {
    recomendacoes.push('✂️ Revisar e reduzir despesas operacionais em 10-15%');
  }
  
  if (maiorDespesa && (maiorDespesa[1] as number / despesas.total) > 0.4) {
    recomendacoes.push(`🔍 Analisar detalhadamente a categoria "${maiorDespesa[0]}"`);
  }
  
  recomendacoes.push('📊 Implementar controle mensal de fluxo de caixa');
  recomendacoes.push('🎯 Estabelecer metas de redução de custos');
  recomendacoes.push('💡 Buscar oportunidades de aumento de receita');
  
  recomendacoes.forEach((rec, i) => {
    analise += `${i + 1}. ${rec}\n`;
  });

  analise += `\n═══════════════════════════════════════════════════════════

5️⃣ PROJEÇÃO E TENDÊNCIAS

`;

  // Projeção simples
  const projecaoReceita = receitas.total * 1.05; // 5% crescimento
  const projecaoDespesa = despesas.total * 1.03; // 3% aumento
  const projecaoSaldo = projecaoReceita - projecaoDespesa;
  
  analise += `Projeção para próximo período (cenário conservador):
• Receitas: ${formatCurrency(projecaoReceita)} (+5%)
• Despesas: ${formatCurrency(projecaoDespesa)} (+3%)
• Saldo Projetado: ${formatCurrency(projecaoSaldo)}

`;

  if (projecaoSaldo > saldo) {
    analise += `✅ Tendência positiva: Saldo deve aumentar\n`;
  } else {
    analise += `⚠️ Tendência de redução do saldo\n`;
  }

  analise += `\n═══════════════════════════════════════════════════════════

6️⃣ INDICADORES-CHAVE

• Liquidez: ${(receitas.total / despesas.total).toFixed(2)}x
• ROI Operacional: ${margemLucro}%
• Eficiência: ${(100 - parseFloat(percentualDespesas)).toFixed(1)}%
• Saúde Financeira: ${saldoPositivo ? '✅ Positiva' : '⚠️ Atenção Necessária'}

═══════════════════════════════════════════════════════════

📌 CONCLUSÃO

`;

  if (saldo > 0 && parseFloat(margemLucro) > 15) {
    analise += `Situação financeira SAUDÁVEL. Continue monitorando e busque
oportunidades de crescimento mantendo o controle de custos.`;
  } else if (saldo > 0) {
    analise += `Situação financeira ESTÁVEL, mas com margem de melhoria.
Foque em otimizar despesas e aumentar receitas.`;
  } else {
    analise += `Situação requer ATENÇÃO IMEDIATA. Priorize redução de custos
e busque aumentar receitas urgentemente.`;
  }

  analise += `\n\n💡 Esta análise foi gerada automaticamente com base nos dados fornecidos.
   Recomenda-se revisão por profissional contábil para decisões estratégicas.`;

  return analise;
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const analysis = analisarFluxoCaixa(data);
    
    return NextResponse.json({ analysis });
  } catch (error) {
    console.error('Erro na análise:', error);
    return NextResponse.json({
      analysis: 'Erro ao gerar análise. Por favor, tente novamente.'
    }, { status: 500 });
  }
}
