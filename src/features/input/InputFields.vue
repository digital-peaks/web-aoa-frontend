<template>
  <!-- Textfields-->
  Job Name: <input v-model="job_name" placeholder="Job Name" /><br />
  Resolution: <input v-model="resolution" placeholder="Resolution" /><br />
  Cloud Cover: <input v-model="cloud_cover" placeholder="Cloud Cover" /><br />
  Start Timestamp:
  <input v-model="start_timestamp" placeholder="Start timestamp" /><br />
  End Timestamp:
  <input v-model="end_timestamp" placeholder="End timestamp" /><br />
  Response: <input v-model="response" placeholder="response" /><br />
  Samples: <input v-model="samples" placeholder="samples" /><br />
  Area of Interest: <input v-model="aoi" placeholder="Area of Interest" /><br />

  <!-- File Upload Fields-->
  <br /><br />
  File Upload for GeoJSON Data: <br /><br />
  <label>
    Sample GeoJSON <br />
    <input
      type="file"
      id="sample_GJSON_File"
      ref="file"
      v-on:change="handleFileUpload()"
    />
    <br />
    <br />
    Area of Interest GeoJSON <br />
    <input
      type="file"
      id="AOI_GJSON_File"
      ref="file"
      v-on:change="handleFileUpload()"
    />
    <br />
  </label>
  <button v-on:click="submitFile()">Submit File</button>
  <button v-on:click="calculateAOI()">Calculate Area of Interest</button>

  <!--Leaflet -->
<l-map style="height: 300px" :zoom="zoom" :center="center">
    <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
    <l-marker :lat-lng="markerLatLng"></l-marker>
  </l-map>
  
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
