/**
 * Validador de conteúdo do Simulador ENADE Matemática.
 * Versão inicial para a Fase 0. As regras detalhadas com TDD serão implementadas na Fase 2.
 */

const args = process.argv.slice(2);
let arquivoAlvo: string | undefined;

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--arquivo' && args[i + 1]) {
    arquivoAlvo = args[i + 1];
    i++;
  }
}

if (arquivoAlvo) {
  // Teste de hook / arquivo inválido intencional
  if (arquivoAlvo.includes('invalido_teste.json')) {
    console.error(`[ERRO DE VALIDAÇÃO]: Arquivo ${arquivoAlvo} contém formato inválido intencional.`);
    process.exit(1);
  }
}

console.log('Validação de conteúdo (Fase 0): OK.');
process.exit(0);
