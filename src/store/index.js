import Vue from "vue";
import Vuex from "vuex";
import * as API from "@/common/api";

const STORAGE_USER_TOKEN_KEY = "user_token";

Vue.use(Vuex);

const restoredToken = window.localStorage.getItem(STORAGE_USER_TOKEN_KEY) || "";

if (restoredToken) {
  API.setBearerToken(restoredToken);
}

/**
 * Helper to transform an array to a map:
 * [{ id: 12, name: "Test" }, ...] -> { 12: { id: 12, name: "Test" }, ...}
 * @param {Array} data
 * @returns
 */
const arrayToMap = (data = []) => {
  const map = {};
  data.forEach((entry) => {
    map[entry.id] = entry;
  });
  return map;
};

export default new Vuex.Store({
  state: {
    token: restoredToken,
    user: {},
    /** "loading", "loaded", "error"  */
    jobsState: "loading",
    jobs: {},
  },
  mutations: {
    setToken(state, value) {
      state.token = value;
    },
    setUser(state, value) {
      state.user = { ...value };
    },
    setJobsState(state, value) {
      state.jobsState = value;
    },
    getJobs(state, data = []) {
      state.jobs = arrayToMap(data);
      state.jobsState = "loaded";
    },
    getJobById(state, data) {
      state.jobs = { ...state.jobs, [data.id]: { ...data } };
      state.jobsState = "loaded";
    },
    deleteJobById(state, jobId) {
      delete state.jobs[jobId];
      state.jobs = { ...state.jobs };
    },
  },
  actions: {
    /**
     * Set user token.
     * @param context
     * @param {string} token
     */
    async setToken(context, token) {
      window.localStorage.setItem(STORAGE_USER_TOKEN_KEY, token);
      API.setBearerToken(token);
      context.commit("setToken", token);
    },
    /**
     * Logout current user.
     * @param context
     */
    async logout(context) {
      window.localStorage.removeItem(STORAGE_USER_TOKEN_KEY);
      API.clearBearerToken();
      context.commit("setToken", "");
    },
    /**
     * Set user.
     * @param context
     * @param {User} user
     */
    async setUser(context, user) {
      context.commit("setUser", user);
    },
    /**
     * Get jobs from API.
     * @param context
     */
    async getJobs(context) {
      context.commit("setJobsState", "loading");
      try {
        const { data } = await API.getJobs();
        context.commit("getJobs", data);
      } catch (err) {
        console.error("Unable to load jobs", err);
        context.commit("setJobsState", "error");
      }
    },
    /**
     * Gets a specific job from API by its id.
     * @param context
     * @param {integer} jobId - Job id
     */
    async getJobById(context, jobId) {
      context.commit("setJobsState", "loaded");
      try {
        const { data } = await API.getJobById(jobId);
        context.commit("getJobById", data);
      } catch (err) {
        console.error("Unable to load job", err);
        context.commit("setJobsState", "error");
      }
    },
    /**
     * Deletes a specific job by its id.
     * @param context
     * @param {integer} jobId - Job id
     */
    async deleteJobById(context, jobId) {
      try {
        await API.deleteJobById(jobId);
        context.commit("deleteJobById", jobId);
        return true;
      } catch (err) {
        console.error("Unable to delete job", err);
      }
      return false;
    },
  },
  modules: {},
});
