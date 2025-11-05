const fs = require('fs').promises;
const path = require('path');

async function checkStructure() {
  console.log('=== VERIFICANDO ESTRUTURA DE ARQUIVOS ===\n');
  
  const baseDir = __dirname;
  console.log('Diretório base:', baseDir);
  
  async function listDir(dirPath, indent = '') {
    try {
      const items = await fs.readdir(dirPath, { withFileTypes: true });
      for (const item of items) {
        console.log(`${indent}${item.name} (${item.isDirectory() ? '📁' : '📄'})`);
        if (item.isDirectory()) {
          await listDir(path.join(dirPath, item.name), indent + '  ');
        }
      }
    } catch (error) {
      console.log(`${indent}❌ Não pude acessar: ${error.message}`);
    }
  }
  
  await listDir(baseDir);
}

checkStructure();