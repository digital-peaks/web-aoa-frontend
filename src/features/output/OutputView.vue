<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <div class="bg-light map-column" id="map-container"></div>
    <input type="file" @change="testFunction" />
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
<<<<<<< Updated upstream
import "leaflet/dist/leaflet.css";
import "geotiff"; // Only EPSG:4326 is supported!!!
=======
//import "geotiff/src/geotiff.js"; // Only EPSG:4326 is supported!!!
>>>>>>> Stashed changes
//import "plotty/dist/plotty.js";
import "georaster";
//import "georaster-layer-for-leaflet";
import "leaflet-geotiff-2/dist/leaflet-geotiff.js";
import "leaflet-geotiff-2/dist/leaflet-geotiff-rgb";
import "leaflet-geotiff-2/dist/leaflet-geotiff-vector-arrows";
import "leaflet-geotiff-2/dist/leaflet-geotiff-plotty";

import test from "geotiffs_test/aoa_aoa.tif";

import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

export default {
  name: "Output",
  data: () => ({
    map: null,
    tileLayer: null,
    geoTiffUrl: "../../../geotiff_test/aoa_aoa.tif",
    options: null,
    geotiffLayer: null,
  }),
  chainWebpack: (config) => {
    config.module
      .rule("raw")
      .test(/\.tif$/)
      .use("raw-loader")
      .loader("raw-loader")
      .end();
  },
  methods: {
    parseGeoraster,
    getGeoTiff() {
      console.log({ test });
    },
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
      var txt = "";
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
        if (xmlhttp.status == 200 && xmlhttp.readyState == 4) {
          txt = xmlhttp.responseText;
        }
      };
      xmlhttp.open("GET", "\test.txt", true);
      xmlhttp.send();

      console.log(txt);

      /*

      const response = await fetch(this.geoTiffUrl);
      const blobber = response.blob();
      console.log(blobber);
      debugger;
      const arrayBuffer = await response.arrayBuffer();
      console.log(arrayBuffer);
      const parsedGeoraster = await parseGeoraster(arrayBuffer);
      console.log(parsedGeoraster);*/
      /*
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          parseGeoraster(arrayBuffer).then((georaster) => {
            consol.log("georaster. " + "ABS");
          });
        });
      console.log("res: " + res);

      fetch(this.geoTiffUrl)
        .then((response) => response.arrayBuffer())
        .then((arrayBuffer) => {
          parseGeoraster(arrayBuffer).then((georaster) => {
            // var parse_georaster = require("georaster");
            //console.log(response);
            console.log("georaster:", georaster);
          });
        });

      const response = await fetch(this.geoTiffUrl);
      console.log(response);
      const arrayBuffer = await response.arrayBuffer();
      console.log("buffer:", arrayBuffer);

      const tiff = await fromArrayBuffer(arrayBuffer);
      console.log(tiff);*/
      /*const georaster = await parseGeoraster(arrayBuffer);
      console.log("georaster:", georaster);

      let layer = new GeoRasterLayer({
        georaster: georaster,
        opacity: 0.7,
        resolution: 256,
      });
      console.log("layer:", layer);
      layer.addTo(this.map);

      this.map.fitBounds(layer.getBounds());*/
    },
<<<<<<< Updated upstream
    testFunction: function (event) {
      // debugger;
      const file = event.target.files[0];
      console.log("file:", file);

      let reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        const arrayBuffer = reader.result;
        console.log("buffer: ", arrayBuffer);
        const georaster = await parseGeoraster(arrayBuffer);
        console.log("georaster:", georaster);

        let layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          resolution: 256,
=======
    testFunction: function () {
      document
        .getElementById("fileInput")
        .addEventListener("change", function (event) {
          var file = event.target.files[0];
          console.log("file:", file);

          this.geotiffLayer = new window.L.FeatureGroup().addTo(this.map); ////

          var reader = new FileReader();
          console.log(reader);
          reader.readAsArrayBuffer(file);
          reader.onloadend = function () {
            var arrayBuffer = reader.result;
            parseGeoraster(arrayBuffer).then((georaster) => {
              console.log("georaster:", georaster);
              /*
                GeoRasterLayer is an extension of GridLayer,
                which means can use GridLayer options like opacity.

                Just make sure to include the georaster option!

                http://leafletjs.com/reference-1.2.0.html#gridlayer
            */
              var layer = new GeoRasterLayer({
                georaster: georaster,
                opacity: 0.7,
                resolution: 256,
              });
              console.log("layer:", layer);
              console.log("geotifflayer before: " + this.geotiffLayer);
              this.geotiffLayer.addLayer(this.geotiffLayer);
              console.log("geotifflayer after: " + this.geotiffLayer);
              //layer.addTo(this.map);

              this.map.fitBounds(layer.getBounds());
              document.getElementById("overlay").style.display = "none";
            });
          };
>>>>>>> Stashed changes
        });
        console.log("layer:", layer);
        layer.addTo(this.map);

        this.map.fitBounds(layer.getBounds());
        // document.getElementById("overlay").style.display = "none";
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
