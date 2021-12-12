<template>
  <div class="container">
    <div
      class="
        d-flex
        w-100
        mt-3
        mb-3
        d-flex
        justify-content-between
        align-items-end
      "
    >
      <h4 class="mb-0">Meine Jobs</h4>
      <div>
        <router-link to="/input">
          <button type="button" class="btn btn-primary">
            Neuen Job erstellen
          </button></router-link
        >
      </div>
    </div>
    <div v-if="!loading" class="list-group">
      <router-link
        v-for="job in jobs"
        :key="job.id"
        :to="'/output/' + job.id"
        class="list-group-item list-group-item-action"
      >
        <div class="d-flex w-100 justify-content-between align-items-center">
          <div class="me-2 d-flex flex-fill flex-column flex-md-row">
            <div class="flex-fill">{{ job.name }}</div>
            <small class="text-muted"><time-ago :date="job.created" /></small>
          </div>
          <div class="mx-2">
            <div
              class="status-indicator"
              v-bind:class="{
                error: false,
                loading: false,
              }"
            ></div>
          </div>
          <div class="ms-2">
            <button
              id="jobMenu"
              class="btn btn-outline-secondary btn-sm"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-three-dots-vertical"
                viewBox="0 0 16 16"
              >
                <path
                  d="M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0zm0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"
                />
              </svg>
            </button>
            <ul class="dropdown-menu" aria-labelledby="jobMenu">
              <li><a class="dropdown-item" href="#">Logs einsehen</a></li>
            </ul>
          </div>
        </div>
      </router-link>
    </div>

    <div
      v-if="Object.keys(jobs).length === 0 && jobsState === 'loaded'"
      class="text-center m-3"
    >
      Keine Jobs vorhanden.
    </div>
    <div v-if="jobsState === 'error'" class="text-center m-3">
      Es ist ein Fehler aufgetreten. Bitte versuche es später erneut.
    </div>
  </div>
</template>

<script>
import TimeAgo from "@/components/TimeAgo";
import { mapState } from "vuex";

export default {
  name: "JobsView",
  components: {
    TimeAgo,
  },
  computed: mapState(["jobs", "jobsState"]),
  mounted() {
    this.$store.dispatch("getJobs");
  },
};
</script>

<style scoped>
.status-indicator {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: #12b886;
}

/* Source: https://www.florin-pop.com/blog/2019/03/css-pulse-effect/ */
@keyframes pulse {
  0% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgb(21, 170, 191, 0.8);
  }
  70% {
    transform: scale(1);
    box-shadow: 0 0 0 6px rgb(21, 170, 191, 0);
  }
  100% {
    transform: scale(0.9);
    box-shadow: 0 0 0 0 rgb(21, 170, 191, 0);
  }
}

.status-indicator.loading {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: pulse 2s infinite;
  background-color: #15aabf;
}

.status-indicator.error {
  background-color: #e64980;
}
</style>
