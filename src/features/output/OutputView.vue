<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <div class="form-column"></div>
    <div class="bg-light map-column" id="map-container"></div>
  </div>
</template>

<script>
// Import that are required for the following functionalities
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "georaster";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export default {
  name: "Output",
  data: () => ({
    map: null,
    tileLayer: null,
    // In most cases it's just "/aoa_example.tif"
    // See: https://cli.vuejs.org/config/#baseurl
    // Here you have to link the .tif-folder given from the r-script
    // The results from the calculations have to be sotred in the public-path
    geoTiffUrl: `${process.env.BASE_URL}geotiffs_test/aoa_aoa.tif`,
  }),
  methods: {
    // This method initializes the map
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
    // This function needs the input of the geoTiffUrl variable to take a tf and visualize it on the map
    showTif1Band: async function () {
      const response = await fetch(this.geoTiffUrl);
      // Make sure you get what you expect!
      // Should be an "image/tiff"
      // console.log("Content-Type:", response.headers.get("Content-Type"));

      // These steps have to be done to read the image
      const arrayBuffer = await response.arrayBuffer();
      const georaster = await parseGeoraster(arrayBuffer);

      // Now a new layer gets initialized:
      let layer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 1,
        resolution: 256,
      });
      layer.addTo(this.map);
      this.map.fitBounds(layer.getBounds());
    },
  },
  mounted() {
    this.initMap();
    this.showTif1Band();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>
<style scoped>
.form-column {
  flex: auto;
}
.map-column {
  flex: auto;
  min-height: 500px;
  height: 50%;
}
@media (min-width: 992px) {
  /* WHY THIS WONT BE RECOGNIZED? */
  .form-column {
    flex: 1;
    height: 100%;
    position: relative;
    overflow-y: auto;
    min-height: 0;
  }
  .map-column {
    flex: 1;
    /*position: relative;*/
    min-height: 500;
    height: 100%;
  }
}
</style>
