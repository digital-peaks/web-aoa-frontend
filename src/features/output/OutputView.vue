<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <div class="bg-light map-column" id="map-container"></div>
    <input type="file" @change="testFunction" />
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "geotiff"; // Only EPSG:4326 is supported!!!

//import "plotty/dist/plotty.js";
import "georaster";
//import "georaster-layer-for-leaflet";
import "leaflet-geotiff-2/dist/leaflet-geotiff.js";
import "leaflet-geotiff-2/dist/leaflet-geotiff-rgb";
import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty";

import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export default {
  name: "Output",
  data: () => ({
    map: null,
    tileLayer: null,
    // In most cases it's just "/aoa_example.tif"
    // See: https://cli.vuejs.org/config/#baseurl
    geoTiffUrl: `${process.env.BASE_URL}geotiffs_test/test_training_image_2020-01-01.tif`, // Here you have to link the .tif-folder given from the r-script
    //geoTiffUrl: `aoa_di.tif`,
    options: null,
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
    testFunction2: async function () {
      console.log(this.geoTiffUrl);

      const response = await fetch(this.geoTiffUrl);

      // Make sure you get what you expect!
      // Should be an "image/tiff"
      console.log("Content-Type:", response.headers.get("Content-Type"));

      const arrayBuffer = await response.arrayBuffer();
      console.log(arrayBuffer);

      const georaster = await parseGeoraster(arrayBuffer);
      console.log(georaster);

      let layer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 1,
        resolution: 256,
      });
      console.log("layer:", layer);
      layer.addTo(this.map);
      this.map.fitBounds(layer.getBounds());
    },
    testFunction: function (event) {
      // Function no longer required
      // debugger;
      const file = event.target.files[0];
      console.log("file:", file);

      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      console.log(reader);
      reader.onloadend = async () => {
        const arrayBuffer = reader.result;
        console.log("buffer: ", arrayBuffer);
        const georaster = await parseGeoraster(arrayBuffer);
        console.log("georaster:", georaster);
        var layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          resolution: 256,
        });
        console.log("layer:", layer);
        layer.addTo(this.map);
        this.map.fitBounds(layer.getBounds());
      };
    },
  },
  mounted() {
    this.initMap();
    this.testFunction2();
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
