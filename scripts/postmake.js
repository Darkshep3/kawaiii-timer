const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const makeDir = path.resolve(__dirname, '..', 'out', 'make');

const buildFolders = fs.readdirSync(makeDir).filter(f => f.toLowerCase().includes('darwin'));
if (buildFolders.length === 0) {
  console.error('No darwin build folder found!');
  process.exit(1);
}

// Assuming only one build folder, take the first
const buildFolder = buildFolders[0];
const buildFolderPath = path.join(makeDir, buildFolder);

const appBundles = fs.readdirSync(buildFolderPath).filter(f => f.endsWith('.app'));
if (appBundles.length === 0) {
  console.error('No .app bundle found in:', buildFolderPath);
  process.exit(1);
}

// Take first .app found
const appPath = path.join(buildFolderPath, appBundles[0]);

console.log(`Found app at: ${appPath}`);
console.log('Running xattr -cr to clear quarantine attribute...');

try {
  execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });
  console.log('Successfully cleared quarantine attributes.');
} catch (error) {
  console.error('Failed to clear xattr:', error);
  process.exit(1);
}
