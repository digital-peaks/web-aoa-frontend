const DEFAULT_CONFIG = {
  API_URL: "http://localhost/api",
};

/**
 * Load API configuration from multiple sources:
 *
 * 1. **PROD**: Read from `index.html`:
 *
 *    In deployed applications, the index.html assigns the configuration to
 *    `window.ENV`.
 *    These values can be set through the env variables of the Docker images.
 *
 * 2. **LOCAL**: Read from `process.env`:
 *
 *    During local development, one can use the `VUE_APP_xxx` env variables
 *    to set the config values.
 *
 * 3. **DEFAULT**: Read from defaults:
 *
 *    This file contains default configuration pointing to `dev` that is used
 *    if no other config was set.
 *
 * @param {string} key
 * @returns {string}
 */
function readConfigValue(key) {
  // Step 1, read from window.ENV
  const windowValue = window.ENV && window.ENV[key];

  if (windowValue && windowValue !== "" && windowValue !== `{{${key}}}`) {
    return windowValue;
  }

  // Step 2, read from process.env
  const processValue = process.env[`VUE_APP_${key}`];

  if (processValue && processValue !== "") {
    return processValue;
  }

  // Step 3, return default value
  return DEFAULT_CONFIG[key];
}

export default {
  apiURL: readConfigValue("API_URL"),
};
