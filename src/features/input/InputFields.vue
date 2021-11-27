<template>
Job Name: <input v-model="job_name" placeholder="Job Name"><br>
Resolution: <input v-model="resolution" placeholder="Resolution"><br>
Cloud Cover: <input v-model="cloud_cover" placeholder="Cloud Cover"><br>
Start Timestamp: <input v-model="start_timestamp" placeholder="Start timestamp"><br>
End Timestamp: <input v-model="end_timestamp" placeholder="End timestamp"><br>
Response: <input v-model="response" placeholder="response"><br>
Samples: <input v-model="samples" placeholder="samples"><br>
Area of Interest: <input v-model="aoi" placeholder="Area of Interest"><br>

</template>

<script>
export default {
  name: "InputFields",
  props: {
    msg: String,
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
