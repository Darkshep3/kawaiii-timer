// scripts/postmake.js
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve(__dirname, '..', 'out');

console.log('Looking for .app folders to fix xattr in:', outDir);

function findAppDirs(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let apps = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.endsWith('.app')) {
        apps.push(fullPath);
      } else {
        apps = apps.concat(findAppDirs(fullPath));
      }
    }
  }

  return apps;
}

const appDirs = findAppDirs(outDir);

if (appDirs.length === 0) {
  console.log('No .app bundles found.');
  process.exit(0); // Exit silently
}

for (const appPath of appDirs) {
  console.log(`Clearing quarantine attributes: ${appPath}`);
  try {
    execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });
  } catch (e) {
    console.warn('Failed to clear quarantine for:', appPath);
  }
}
