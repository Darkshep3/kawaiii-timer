const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve(__dirname, '..', 'out');
console.log('Looking for build folders inside:', outDir);

function findApps(dir) {
  let results = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      if (entry.name.endsWith('.app')) {
        results.push(fullPath);
      } else {
        // Recurse into subdirectories
        results = results.concat(findApps(fullPath));
      }
    }
  }

  return results;
}

const apps = findApps(outDir);

if (apps.length === 0) {
  console.log('No .app folder found in out directory or its subfolders.');
  process.exit(0); // Exit gracefully, no error
}

console.log('Found .app bundles:', apps);

for (const appPath of apps) {
  console.log(`Running xattr -cr on: ${appPath}`);
  try {
    execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to clear xattr on ${appPath}`, error);
    process.exit(1);
  }
}

console.log('Successfully cleared quarantine attributes on all .app bundles.');
