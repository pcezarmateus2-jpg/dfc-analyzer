const fs = require('fs');
const pdf = require('pdf-parse');

async function testPDF(filePath, tipo) {
  console.log(`\n${'='.repeat(80)}`);
  console.log(`📄 Testando: ${filePath}`);
  console.log(`Tipo: ${tipo}`);
  console.log('='.repeat(80));
  
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    
    console.log(`\n📊 Informações do PDF:`);
    console.log(`- Páginas: ${data.numpages}`);
    console.log(`- Texto extraído (primeiros 2000 caracteres):\n`);
    console.log(data.text.substring(0, 2000));
    console.log(`\n... (total de ${data.text.length} caracteres)`);
    
    // Extrair valores
    console.log(`\n💰 Valores encontrados:`);
    const padroes = [
      /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/g,
      /(\d{1,3}(?:\.\d{3})*,\d{2})/g,
    ];
    
    const valores = [];
    for (const padrao of padroes) {
      const matches = data.text.matchAll(padrao);
      for (const match of matches) {
        const valorStr = match[1].replace(/\./g, '').replace(',', '.');
        const valor = parseFloat(valorStr);
        if (!isNaN(valor) && valor > 0) {
          valores.push({ valor, contexto: match[0] });
        }
      }
    }
    
    console.log(`Total de valores encontrados: ${valores.length}`);
    valores.slice(0, 20).forEach((v, i) => {
      console.log(`  ${i + 1}. ${v.contexto} = R$ ${v.valor.toFixed(2)}`);
    });
    
    if (valores.length > 20) {
      console.log(`  ... e mais ${valores.length - 20} valores`);
    }
    
    const total = valores.reduce((sum, v) => sum + v.valor, 0);
    console.log(`\n💵 TOTAL: R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    
  } catch (error) {
    console.error(`❌ Erro ao processar PDF:`, error.message);
  }
}

async function main() {
  await testPDF('./test-pdfs/a pagar.PDF', 'CONTAS A PAGAR (Despesas)');
  await testPDF('./test-pdfs/Relatório de Contas a Receber.PDF', 'CONTAS A RECEBER (Receitas)');
}

main();
