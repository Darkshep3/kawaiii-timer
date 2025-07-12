const { FusesPlugin } = require('@electron-forge/plugin-fuses');
const { FuseV1Options, FuseVersion } = require('@electron/fuses');
const path = require('path');

module.exports = {
  packagerConfig: {
    asar: true, // bundle into one archive
    icon: path.resolve(__dirname, 'assets/icon'), // no file extension
    ignore: [
      'docs',
      'tests',
      'forge.config.js',
      'README.md',
      'package-lock.json',
      '\\.gitignore',
      '\\.DS_Store',
      '.*\\.map',
      '.*\\.md',
      'node_modules/\\.cache',
      'src/debug-tools',
    ]
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {
        name: 'KawaiiiTimer',
        setupIcon: path.resolve(__dirname, 'assets/icon.ico'), // Optional: your .ico icon for the installer
        shortcutName: 'Kawaiii Timer',
        loadingGif: path.resolve(__dirname, 'assets/loading.gif'), // Optional: cute loading screen!
      }
    }
  ],
  plugins: [
    {
      name: '@electron-forge/plugin-auto-unpack-natives',
      config: {}
    },
    new FusesPlugin({
      version: FuseVersion.V1,
      [FuseV1Options.RunAsNode]: false,
      [FuseV1Options.EnableCookieEncryption]: true,
      [FuseV1Options.EnableNodeOptionsEnvironmentVariable]: false,
      [FuseV1Options.EnableNodeCliInspectArguments]: false,
      [FuseV1Options.EnableEmbeddedAsarIntegrityValidation]: true,
      [FuseV1Options.OnlyLoadAppFromAsar]: true
    })
  ]
};
