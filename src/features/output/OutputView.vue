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
//import "geotiff/src/geotiff.js"; // Only EPSG:4326 is supported!!!
//import "plotty/dist/plotty.js";
//import "georaster";
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
    geoTiffUrl: "../../../geotiff_test/aoa_aoa.tif",
    options: null,
    geotiffLayer: null,
  }),
  methods: {
    parseGeoraster,
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
    addTiff: function () {
      this.options = {
        renderer: L.LeafletGeotiff.plotty(),
        useWorker: false,
        bounds: [],
      };

      this.geotiffLayer = L.leafletGeotiff(this.geoTiffUrl, this.options).addTo(
        this.map
      );

      console.log("geotifflayer: " + this.geotiffLayer);
    },
    testFunction: function (event) {
      debugger;
      const file = event.target.files[0];
      console.log("file:", file);

      var reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = async () => {
        var arrayBuffer = reader.result;
        const georaster = await parseGeoraster(arrayBuffer);
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
        layer.addTo(this.map);

        this.map.fitBounds(layer.getBounds());
        document.getElementById("overlay").style.display = "none";
      };
    },
  },
  mounted() {
    this.initMap();
    //this.addTiff();

    /*var lay = window.L.leafletGeotiff(
      this.geoTiffUsrl,
      window.L.LeafletGeotiff.plotty()
    ).addTo(this.map);
    console.log(lay);*/

    /*var file = this.geoTiffUrl;
    console.log("file: ", file);
    var reader = new FileReader();
    reader.readAsArrayBuffer(file);
    reader.onloadend = function () {
      var arrayBuffer = reader.result;
      parseGeoraster(arrayBuffer).then((georaster) => {
        console.log("georaster: ", georaster);
      });
    };*/

    /*var res = fetch(this.geoTiffUrl)
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
      });*/
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
