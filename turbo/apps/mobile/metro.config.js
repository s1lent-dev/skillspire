const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);
config.resolver.alias = {
    "@": "./src",
};

module.exports = withNativeWind(config, { input: "./src/gloabl.css" });
