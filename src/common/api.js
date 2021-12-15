import axios from "axios";
import config from "@/common/config";

// Axios instance
const api = axios.create({
  baseURL: config.apiURL,
});

export const getJobs = () => api.get("/jobs");

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
  form.append("samples", samples);
  if (model) {
    form.append("model", model);
  }
  form.append("job", JSON.stringify(job));

  return api.post("/jobs", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};
