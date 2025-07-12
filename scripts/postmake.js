const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve(__dirname, '..', 'out');
console.log('Looking for build folders inside:', outDir);

const entries = fs.readdirSync(outDir);
console.log('Entries found:', entries);

// Find unpacked app folders (which end with .app)
const appFolders = entries.filter(f => f.endsWith('.app'));

if (appFolders.length === 0) {
  console.error('No .app folder found in out directory');
  process.exit(1);
}

const appPath = path.join(outDir, appFolders[0]);
console.log(`Found app bundle at: ${appPath}`);

console.log('Running xattr -cr to clear quarantine attribute...');
try {
  execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });
  console.log('Successfully cleared quarantine attributes.');
} catch (error) {
  console.error('Failed to clear xattr:', error);
  process.exit(1);
}
