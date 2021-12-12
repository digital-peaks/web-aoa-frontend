import axios from "axios";
import config from "@/common/config";

// Axios instance
const api = axios.create({
  baseURL: config.apiURL,
});

export const getJobs = () => api.get("/jobs");
