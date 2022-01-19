import axios from "axios";
import config from "@/common/config";

// Axios instance
const api = axios.create({
  baseURL: config.apiURL,
});

/**
 * Set bearer token for API requests.
 * @param {String} token
 */
export const setBearerToken = (token) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

/**
 * Clear bearer token for API requests.
 */
export const clearBearerToken = () => {
  api.defaults.headers.common["Authorization"] = undefined;
};

/**
 * Login
 * @param {Object} body
 * @param {String} body.email
 * @param {String} body.password
 */
export const userLogin = (body) => api.post("/users/login", body);

/**
 * Get current user
 */
export const userMe = () => api.get("/users/me");

export const getJobs = () => api.get("/jobs");

/**
 * Get job by id.
 * @param {String} id Job id
 * @returns
 */
export const getJobById = (id) => api.get(`/jobs/${id}`);

/**
 * Delete job by id.
 * @param {String} id - Job id
 * @returns
 */
export const deleteJobById = (id) => api.delete(`/jobs/${id}`);

/**
 * Create job.
 *
 * @param {object} data
 * @param {Blob} data.samples
 * @param {Blob} data.model
 * @param {Object} data.job
 */
export const createJob = ({ samples, model, job }) => {
  const form = new FormData();
  if (samples) {
    form.append("samples", samples);
  }
  if (model) {
    form.append("model", model);
  }
  form.append("job", JSON.stringify(job));

  return api.post("/jobs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Get the file by job id.
 *
 * Get json (will be parse to json by default):
 * `getJobsFile("155h565734r", "samplePolygons.geojson")`
 *
 * Get array buffer:
 * `getJobsFile("155h565734r", "pred.tif", { responseType: "arraybuffer" })`
 *
 * @param {String} jobId
 * @param {String} name
 * @param {object} options See https://axios-http.com/docs/req_config
 * @param {String} options.responseType Default "json"
 */
export const getJobFile = (jobId, name, options) =>
  api.get(`/jobs/${jobId}/files/${name}`, options);
