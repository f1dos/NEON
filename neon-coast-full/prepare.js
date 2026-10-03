// Кладёт игру в www/ и заменяет CDN-ссылки на локальные копии three.js,
// чтобы APK работал без интернета.
const fs = require('fs'), path = require('path');
const T = path.join('node_modules', 'three');
if (!fs.existsSync(T)) { console.error('Сначала выполните: npm install'); process.exit(1); }
let html = fs.readFileSync('game.html', 'utf8');
const files = new Map();
html = html.replace(/https:\/\/cdnjs\.cloudflare\.com\/ajax\/libs\/three\.js\/r128\/three\.min\.js/g, () => {
  files.set('three.min.js', path.join(T, 'build', 'three.min.js')); return 'lib/three.min.js';
});
html = html.replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/three@0\.128\.0\/examples\/js\/([\w\/.\-]+)/g, (_, p) => {
  files.set(p, path.join(T, 'examples', 'js', p)); return 'lib/' + p;
});
fs.rmSync('www', { recursive: true, force: true });
for (const [rel, src] of files) {
  if (!fs.existsSync(src)) { console.error('Нет файла', src); process.exit(1); }
  const dst = path.join('www', 'lib', rel);
  fs.mkdirSync(path.dirname(dst), { recursive: true }); fs.copyFileSync(src, dst);
}
fs.writeFileSync(path.join('www', 'index.html'), html);
console.log('Готово. Локальных библиотек:', files.size);
