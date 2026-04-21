const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Some packages publish .mjs builds with import.meta that break Expo web's classic script runtime.
// Disabling package exports makes Metro resolve CommonJS entry points instead.
config.resolver.unstable_enablePackageExports = false;

module.exports = config;
