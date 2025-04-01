const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

module.exports = {
    ...defaultConfig,
    server: {
        ...defaultConfig.server,
        host: '0.0.0.0', // Asegura que se acepten conexiones desde la red local
    },
};
