import Vue from "vue";
import Vuex from "vuex";
import * as API from "@/common/api";

Vue.use(Vuex);

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
    /** "loading", "loaded", "error"  */
    jobsState: "loading",
    jobs: [],
  },
  mutations: {
    setJobsState(state, value) {
      state.jobsState = value;
    },
    getJobs(state, data = []) {
      state.jobs = arrayToMap(data);
      state.jobsState = "loaded";
    },
  },
  actions: {
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
  },
  modules: {},
});
