const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const makeDir = path.join(__dirname, '..', 'out', 'make');

// Find the macOS build folder dynamically, e.g., "Kawaiii Timer-darwin-arm64" or "Kawaiii Timer-darwin-x64"
const darwinFolder = fs.readdirSync(makeDir).find(name => name.startsWith('Kawaiii Timer-darwin'));

if (!darwinFolder) {
  console.error('No darwin build folder found!');
  process.exit(1);
}

const appPath = path.join(makeDir, darwinFolder, 'Kawaiii Timer.app');

console.log('Running xattr -cr on', appPath);

try {
  execSync(`xattr -cr "${appPath}"`);
  console.log('Successfully cleared quarantine attributes.');
} catch (error) {
  console.error('Failed to clear xattr:', error);
  process.exit(1);
}
