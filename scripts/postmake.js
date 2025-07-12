const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '../out');
const makeDir = path.join(outDir, 'make');

// Find the folder starting with 'Kawaiii Timer-darwin-'
const folders = fs.readdirSync(makeDir).filter(name => name.startsWith('Kawaiii Timer-darwin-'));

if (folders.length === 0) {
  console.error('No darwin build folder found!');
  process.exit(1);
}

const appFolder = path.join(makeDir, folders[0], 'Kawaiii Timer.app');

if (!fs.existsSync(appFolder)) {
  console.error(`App folder not found: ${appFolder}`);
  process.exit(1);
}

console.log(`Running xattr on: ${appFolder}`);

try {
  execSync(`xattr -cr "${appFolder}"`, { stdio: 'inherit' });
} catch (err) {
  console.error('Failed to remove xattr quarantine:', err);
  process.exit(1);
}