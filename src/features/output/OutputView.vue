<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <div class="bg-light map-column" id="map-container"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
//import "geotiff/src/geotiff.js"; // Only EPSG:4326 is supported!!!
//import "plotty/dist/plotty.js";
import "georaster";
import "georaster-layer-for-leaflet";

export default {
  name: "Output",
  data: () => ({
    map: null,
    tileLayer: null,
    geoTiffUrl: "../../../geotiff_test/aoa_aoa.tif",
  }),
  methods: {
    initMap: function () {
      this.map = L.map("map-container").setView([51.966, 7.633], 10);
      this.tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(this.map);
    },
  },
  mounted() {
    this.initMap();
    fetch(this.geoTiffUrl)
      .then((response) => response.arrayBuffer())
      .then((arrayBuffer) => {
        parse_georaster(arrayBuffer).then((georaster) => {
          // var parse_georaster = require("georaster");
          console.log("georaster:", georaster);
        });
      });
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>
<style scoped>
.map-column {
  flex: auto;
  min-height: 500px;
  height: 50%;
}
@media (min-width: 992px) {
  /* WHY THIS WONT BE RECOGNIZED? */
  .map-column {
    flex: 1;
    /*position: relative;*/
    min-height: 500;
    height: 100%;
  }
}
</style>
