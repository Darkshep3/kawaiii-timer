const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const outDir = path.resolve(__dirname, '..', 'out');

console.log('🔍 Looking for .app folders inside:', outDir);

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
  console.log('🚫 No .app bundles found.');
  process.exit(0); // Exit silently, no error
}

for (const appPath of appDirs) {
  try {
    console.log(`🔏 Ad-hoc signing app: ${appPath}`);
    execSync(`codesign --force --deep --sign - "${appPath}"`, { stdio: 'inherit' });

    console.log(`🧼 Removing quarantine: ${appPath}`);
    execSync(`xattr -cr "${appPath}"`, { stdio: 'inherit' });

    console.log(`✅ Successfully processed: ${appPath}`);
  } catch (e) {
    console.warn(`❌ Failed to process app at: ${appPath}`);
    console.warn(e.message);
    process.exit(1);
  }
}
