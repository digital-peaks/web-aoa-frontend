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
      <div class="mb-0 text-h5">My jobs</div>
      <div>
        <v-btn to="/input" color="primary">Create new job</v-btn>
      </div>
    </div>
    <v-card elevation="3" v-if="!loading && Object.keys(jobs).length > 0">
      <v-list>
        <v-list-item-group
          v-model="selected"
          active-class="pink--text"
          multiple
        >
          <template v-for="(job, index) in Object.values(jobs)">
            <v-list-item link :to="'/output/' + job.id" :key="job.id">
              <v-list-item-content style="flex: 1">{{
                job.name
              }}</v-list-item-content>
              <v-list-item-action class="text-caption text--secondary">
                <time-ago :date="job.created" />
              </v-list-item-action>
              <v-list-item-action>
                <div
                  class="status-indicator"
                  v-bind:class="{
                    running: job.status === 'running',
                    error: job.status === 'error',
                    success: job.status === 'success',
                  }"
                ></div>
              </v-list-item-action>
              <v-list-item-action>
                <v-btn
                  :key="job.id"
                  icon
                  v-on:click.prevent="deleteJob(job.id)"
                >
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </v-list-item-action>
            </v-list-item>
            <!--<v-list-item-icon :key="job.id">
              <div>
                <v-alert :value="alert" type="info">
                  Should this job (namen ergänzen) actually be deleted?
                  <v-row>
                    <v-btn v-on:click="deleteJob(job.id)"> Yes </v-btn>
                    <v-btn> No </v-btn>
                  </v-row>
                </v-alert>
              </div>
            </v-list-item-icon>-->
            <v-divider
              v-if="index < Object.keys(jobs).length - 1"
              :key="job.id"
              class="m-0"
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </v-card>

    <div
      v-if="Object.keys(jobs).length === 0 && jobsState === 'loaded'"
      class="text-center m-3"
    >
      No jobs available.
    </div>
    <div v-if="jobsState === 'error'" class="text-center m-3">
      An error has occurred. Please try again later.
    </div>
  </div>
</template>

<script>
import TimeAgo from "@/components/TimeAgo";
import { mapState } from "vuex";
import * as API from "@/common/api";

export default {
  name: "JobsView",
  components: {
    TimeAgo,
  },
  // Map the state from store/index.js
  computed: mapState(["jobs", "jobsState"]),
  methods: {
    deleteJob(jobId) {
      API.deleteJobById(jobId);
      window.location.reload();
    },
  },
  mounted() {
    this.$store.dispatch("getJobs");
  },
};
</script>

<style scoped>
/* A circle which show the status of the job. */
.status-indicator {
  width: 20px;
  height: 20px;
  border-radius: 20px;
  background-color: #aaaaaa;
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

.status-indicator.running {
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: pulse 2s infinite;
  background-color: #15aabf;
}
.status-indicator.error {
  background-color: #e64980;
}
.status-indicator.success {
  background-color: #12b886;
}
</style>
