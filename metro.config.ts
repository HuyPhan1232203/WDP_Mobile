const { getDefaultConfig } = require("expo/metro-config");

module.exports = (() => {
  const config = getDefaultConfig(__dirname);
  const { transformer, resolver } = config;

  config.transformer = {
    ...transformer,
  };

  config.resolver = {
    ...resolver,
    sourceExts: [...resolver.sourceExts, "cjs"],
  };

  return config;
})();
