const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const makeDir = path.resolve(__dirname, '..', 'out', 'make');

console.log('Looking for build folders inside:', makeDir);

let dirEntries;
try {
  dirEntries = fs.readdirSync(makeDir);
} catch (err) {
  console.error(`Failed to read directory ${makeDir}:`, err.message);
  process.exit(1);
}

console.log('Found entries:', dirEntries);

const buildFolders = dirEntries.filter(f => f.toLowerCase().includes('darwin'));

if (buildFolders.length === 0) {
  console.error('No darwin build folder found!');
  process.exit(1);
}

console.log('Darwin build folders:', buildFolders);

const buildFolder = buildFolders[0];
const buildFolderPath = path.join(makeDir, buildFolder);

let buildFolderContents;
try {
  buildFolderContents = fs.readdirSync(buildFolderPath);
} catch (err) {
  console.error(`Failed to read build folder ${buildFolderPath}:`, err.message);
  process.exit(1);
}

console.log(`Contents of build folder (${buildFolderPath}):`, buildFolderContents);

const appBundles = buildFolderContents.filter(f => f.endsWith('.app'));
if (appBundles.length === 0) {
  console.error('No .app bundle found in:', buildFolderPath);
  process.exit(1);
}

const appPath = path.join(buildFolderPath, appBundles[0]);

console.log(`Found app bundle: ${appPath}`);
console.log('Running xattr -cr to clear quarantine attribute...');

try {
  execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });
  console.log('Successfully cleared quarantine attributes.');
} catch (error) {
  console.error('Failed to clear xattr:', error);
  process.exit(1);
}
