// Copia os arquivos do app web (na raiz) para a pasta www/, que é o webDir do
// Capacitor. Assim a raiz continua servindo o GitHub Pages e o build nativo usa
// uma cópia limpa (sem node_modules/android). Rode antes de `npx cap sync`.
import { mkdirSync, copyFileSync, rmSync, existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');

const FILES = ['index.html', 'manifest.json', 'icon-192.png', 'icon-512.png'];

if (existsSync(www)) rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

for (const f of FILES) {
  const src = join(root, f);
  if (!existsSync(src)) {
    console.error(`Aviso: ${f} não encontrado, pulando.`);
    continue;
  }
  copyFileSync(src, join(www, f));
  console.log(`copiado: ${f}`);
}

console.log('www/ pronto para o Capacitor.');
