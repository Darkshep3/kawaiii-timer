const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const outDir = path.resolve(__dirname, '..', 'out');
const x64App = path.join(outDir, 'make', 'x64', 'zip', 'darwin', 'x64', 'Kawaiii Timer.app');
const arm64App = path.join(outDir, 'make', 'arm64', 'zip', 'darwin', 'arm64', 'Kawaiii Timer.app');
const universalApp = path.join(outDir, 'Kawaiii Timer.app');

// Copy x64 as base
execSync(`cp -R "${x64App}" "${universalApp}"`);
console.log('📦 Copied x64 .app as base for universal');

// Replace binary with universal binary
const binPath = 'Contents/MacOS/Kawaiii Timer';
const x64Bin = path.join(x64App, binPath);
const arm64Bin = path.join(arm64App, binPath);
const universalBin = path.join(universalApp, binPath);

execSync(`lipo -create -output "${universalBin}" "${x64Bin}" "${arm64Bin}"`);
console.log('✅ Created universal binary using lipo');

// Ad-hoc sign + remove quarantine
execSync(`codesign --force --deep --sign - "${universalApp}"`);
execSync(`xattr -cr "${universalApp}"`);
console.log('🔏 Signed and cleaned quarantine');

// Zip it
const zipOut = path.join(outDir, 'Kawaiii-Timer-universal.zip');
execSync(`cd "${outDir}" && zip -r "${zipOut}" "Kawaiii Timer.app"`);
console.log(`📦 Universal app zipped at: ${zipOut}`);
