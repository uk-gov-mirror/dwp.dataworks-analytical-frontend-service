import getRuntimeConfig from "../server/runtimeConfig";

let appConfig;

function initConfig() {
    if (!appConfig) {
        if (typeof window !== "undefined") {
            appConfig = window.__CONFIG__;
            delete window.__CONFIG__;
        } else {
            appConfig = getRuntimeConfig();
        }

    }
}

export default function getConfig(key) {
    initConfig();
    if(appConfig.hasOwnProperty(key)) return appConfig[key];

    throw new Error(`No value found for config key ${key}`)
};