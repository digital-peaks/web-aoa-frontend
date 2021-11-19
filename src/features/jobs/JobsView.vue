<template>
  <div class="home">
    <JobsList msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import JobsList from "@/features/jobs/JobsList.vue";

export default {
  name: "JobsView",
  components: {
    JobsList,
  },
};
</script>
