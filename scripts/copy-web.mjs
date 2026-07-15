// Copia os arquivos do app web (na raiz) para a pasta www/, que é o webDir do
// Capacitor. Assim a raiz continua servindo o GitHub Pages e o build nativo usa
// uma cópia limpa (sem node_modules/android). Rode antes de `npx cap sync`.
import { mkdirSync, copyFileSync, rmSync, existsSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const www = join(root, 'www');

const FILES = ['index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'geomag.bundle.js'];

if (existsSync(www)) rmSync(www, { recursive: true, force: true });
mkdirSync(www, { recursive: true });

// hash curto do commit + data, para identificar exatamente de qual build veio o APK
let buildInfo = '';
try {
  const sha = execSync('git rev-parse --short HEAD', { cwd: root }).toString().trim();
  const date = new Date().toISOString().slice(0, 10);
  buildInfo = `${sha} (${date})`;
} catch (e) { /* sem git: deixa só a versão */ }

for (const f of FILES) {
  const src = join(root, f);
  if (!existsSync(src)) {
    console.error(`Aviso: ${f} não encontrado, pulando.`);
    continue;
  }
  const dest = join(www, f);
  if (f === 'index.html' && buildInfo) {
    const html = readFileSync(src, 'utf8').replace('__BUILD__', buildInfo);
    writeFileSync(dest, html);
    console.log(`copiado: ${f} (build ${buildInfo})`);
  } else {
    copyFileSync(src, dest);
    console.log(`copiado: ${f}`);
  }
}

console.log('www/ pronto para o Capacitor.');
