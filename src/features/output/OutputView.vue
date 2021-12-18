<template>
  <div class="d-flex flex-column flex-lg-row" style="flex: 1">
    <div class="flex-column m-3">
      <h2 id="job_number">Job xy</h2>

      <div class="col-lg">
        <table class="table" id="control">
          <thead>
            <tr>
              <th id="layer_name" scope="col"></th>
              <th id="title" scope="col">Show/Hide</th>
              <th id="title" scope="col">Download</th>
              <th id="title" scope="col">Zoom To Layer</th>
            </tr>
          </thead>
          <tbody>
            <tr id="not_last_td">
              <td id="td_elements_without_slider">Area of Interest (AOI)</td>
              <td class="check">
                <label class="checkbox">
                  <input
                    class="checkbox"
                    type="checkbox"
                    id="aoi"
                    v-on:click="switchLayer('aoi')"
                  />
                  <span class="default"></span>
                </label>
              </td>
              <td class="download_button"></td>
              <td>
                <!--<button color="primary" v-on:click="zoomToLayer('aoi')">
                  Zoom
                </button>-->
                <v-btn
                  color="primary"
                  elevation="2"
                  outlined
                  rounded
                  text
                  x-small
                  >Zoom</v-btn
                >
              </td>
            </tr>
            <tr id="not_last_td">
              <td>
                Dissimilarity Index
                <vue-slider
                  v-model="diTransparency"
                  v-on:change="changeOpacity('di')"
                  :tooltip-formatter="sliderPercentage"
                />
                <p style="font-size: 10px">Transparency</p>
              </td>
              <td class="check">
                <label class="checkbox">
                  <input
                    class="checkbox"
                    type="checkbox"
                    id="di"
                    v-on:click="switchLayer('di')"
                  />
                  <span class="default"></span>
                </label>
              </td>
              <td class="download_button">
                <button
                  id="download_b"
                  v-on:click="
                    downloadItem('geotiffs_test/aoa_di.tif', 'aoa_di')
                  "
                >
                  <DownloadIcon width="16" />
                </button>
              </td>
              <td>
                <button color="primary" v-on:click="zoomToLayer('di')">
                  Zoom
                </button>
              </td>
            </tr>
            <tr id="not_last_td">
              <td>
                Prediciton / Classification
                <vue-slider
                  v-model="predTransparency"
                  v-on:change="changeOpacity('pred')"
                  :tooltip-formatter="sliderPercentage"
                />
                <p style="font-size: 10px">Transparency</p>
              </td>
              <td class="check">
                <label class="checkbox">
                  <input
                    class="checkbox"
                    type="checkbox"
                    id="pred"
                    v-on:click="switchLayer('pred')"
                  />
                  <span class="default"></span>
                </label>
              </td>
              <td class="download_button">
                <button
                  id="download_b"
                  v-on:click="downloadItem('geotiffs_test/pred.tif', 'pred')"
                >
                  <DownloadIcon width="16" />
                </button>
              </td>
              <td>
                <button color="primary" v-on:click="zoomToLayer('pred')">
                  Zoom
                </button>
              </td>
            </tr>
            <tr id="not_last_td">
              <td>
                Area of Applicability (AOA)
                <vue-slider
                  v-model="aoaTransparency"
                  v-on:change="changeOpacity('aoa')"
                  :tooltip-formatter="sliderPercentage"
                />
                <p style="font-size: 10px">Transparency</p>
              </td>
              <td class="check">
                <label class="checkbox">
                  <input
                    class="checkbox"
                    type="checkbox"
                    id="aoa"
                    v-on:click="switchLayer('aoa')"
                  />
                  <span class="default"></span>
                </label>
              </td>
              <td class="download_button">
                <button
                  id="download_b"
                  v-on:click="
                    downloadItem('geotiffs_test/aoa_aoa.tif', 'aoa_aoa')
                  "
                >
                  <DownloadIcon width="16" />
                </button>
              </td>
              <td>
                <button color="primary" v-on:click="zoomToLayer('aoa')">
                  Zoom
                </button>
              </td>
            </tr>
            <tr id="last_td">
              <td id="td_elements_without_slider">Sample Polygons</td>
              <td class="check">
                <label class="checkbox">
                  <input
                    class="checkbox"
                    type="checkbox"
                    id="samplePolygons"
                    v-on:click="switchLayer('samplePolygons')"
                  />
                  <span class="default"></span>
                </label>
              </td>
              <td class="download_button"></td>
              <td>
                <button
                  color="primary"
                  v-on:click="zoomToLayer('samplePolygons')"
                >
                  Zoom
                </button>
              </td>
            </tr>
            <tr id="not_last_td">
              <td id="td_elements_without_slider">
                Suggested locations for training polygons
              </td>
              <td class="check">
                <label class="checkbox">
                  <input
                    class="checkbox"
                    type="checkbox"
                    id="suggestion"
                    v-on:click="switchLayer('suggestion')"
                  />
                  <span class="default"></span>
                </label>
              </td>
              <td class="download_button">
                <button
                  id="download_b"
                  v-on:click="
                    downloadItem(
                      'geotiffs_test/suggestion.geojson',
                      'suggestion'
                    )
                  "
                >
                  <DownloadIcon width="16" />
                </button>
              </td>
              <td>
                <button color="primary" v-on:click="zoomToLayer('suggestion')">
                  Zoom
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="bg-light map-column" id="map-container"></div>
  </div>
</template>

<script>
// Import that are required for the following functionalities
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

import DownloadIcon from "@/components/DownloadIcon.vue";

import axios from "axios";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

export default {
  name: "Output",
  data: () => ({
    map: null,
    tileLayer: null,
    // In most cases it's just "/aoa_example.tif"
    // See: https://cli.vuejs.org/config/#baseurl
    // Here you have to link the .tif-folder given from the r-script
    aoiJson: `${process.env.BASE_URL}geotiffs_test/aoi.geojson`,
    aoiLayer: null,
    diUrl: `${process.env.BASE_URL}geotiffs_test/aoa_di.tif`,
    diLayer: null,
    diTransparency: 100,
    predUrl: `${process.env.BASE_URL}geotiffs_test/pred.tif`,
    predLayer: null,
    predTransparency: 100,
    aoaUrl: `${process.env.BASE_URL}geotiffs_test/aoa_aoa.tif`,
    aoaLayer: null,
    aoaTransparency: 100,
    samplePolygonsJson: `${process.env.BASE_URL}geotiffs_test/samplePolygons.geojson`,
    samplePolygonsLayer: null,
    suggestionJson: `${process.env.BASE_URL}geotiffs_test/suggestion.geojson`,
    suggestionLayer: null,
    sliderPercentage: "{value} %",
  }),
  components: {
    DownloadIcon,
    VueSlider,
  },
  methods: {
    /**
     *
     */
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
    downloadItem: async function (urlLink, label) {
      const url = `${process.env.BASE_URL}` + urlLink;
      let response = await axios.get(url, { responseType: "blob" });
      console.log("response: ", response);
      const blob = new Blob([response.data], { type: "image/tiff" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      console.log("link: ", link);
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    checkLayerGetsFoundWithMessage: function (layer) {
      if (layer == null) {
        console.log("Dieser Layer existiert nicht");
        return false;
      } else return true;
    },
    clearMap: function () {
      let temp = this.map;
      const tileLayerTemp = this.tileLayer;
      const samplePolygonsLayerTemp = this.samplePolygonsLayer;

      this.map.eachLayer(function (layer) {
        if (tileLayerTemp != layer && samplePolygonsLayerTemp != layer)
          temp.removeLayer(layer);
      });
    },
    uncheckTheOtherCheckboxes: function (current) {
      const allCheckboxes = [
        "aoi",
        "di",
        "pred",
        "aoa",
        "samplePolygons",
        "suggestion",
      ];
      for (var i = 0; i < allCheckboxes.length; ++i)
        if (
          allCheckboxes[i] != current &&
          allCheckboxes[i] != "aoi" &&
          allCheckboxes[i] != "samplePolygons" &&
          allCheckboxes[i] != "sugestion"
        )
          document.getElementById(allCheckboxes[i]).checked = false;
    },
    changeOpacity: function (layerId) {
      if (layerId == "aoa") {
        this.aoaLayer.setOpacity(this.aoaTransparency / 100);
      } else if (layerId == "di") {
        this.diLayer.setOpacity(this.diTransparency / 100);
      } else if (layerId == "pred") {
        this.predLayer.setOpacity(this.predTransparency / 100);
      }
    },
    switchLayer: function (id) {
      /*this.uncheckTheOtherCheckboxes(id);

      if (id != "aoi" && id != "samplePolygons") {
        this.clearMap();
      } else if (
        id == "aoi" &&
        document.getElementById("aoi").checked == false
      ) {
        this.map.removeLayer("aoiLayer");
      } else if (
        id == "samplePolygons" &&
        document.getElementById("samplePolygons").checked == false
      ) {
        this.map.removeLayer("samplePolygonsLayers");
      } else if (
        id == "suggestion" &&
        document.getElementById("suggestion").checked == false
      ) {
        this.map.removeLayer("suggestionLayer");
      }*/

      let tempLayer = null;
      let checked = document.getElementById(id).checked;
      if (checked) {
        if (id == "aoi") {
          tempLayer = this.aoiLayer;
          if (!this.checkLayerGetsFoundWithMessage(tempLayer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "di") {
          tempLayer = this.diLayer;
          if (!this.checkLayerGetsFoundWithMessage(tempLayer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "pred") {
          tempLayer = this.predLayer;
          if (!this.checkLayerGetsFoundWithMessage(tempLayer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "aoa") {
          tempLayer = this.aoaLayer;
          if (!this.checkLayerGetsFoundWithMessage(tempLayer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "samplePolygons") {
          tempLayer = this.samplePolygonsLayer;
          if (!this.checkLayerGetsFoundWithMessage(tempLayer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "suggestion") {
          tempLayer = this.samplePolygonsLayer;
          if (!this.checkLayerGetsFoundWithMessage(tempLayer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        }
        tempLayer.addTo(this.map);
        this.map.fitBounds(tempLayer.getBounds());
      } else if (!checked) {
        if (id == "aoi") {
          this.map.removeLayer(this.aoiLayer);
        } else if (id == "di") {
          this.map.removeLayer(this.diLayer);
        } else if (id == "pred") {
          this.map.removeLayer(this.predLayer);
        } else if (id == "aoa") {
          this.map.removeLayer(this.aoaLayer);
        } else if (id == "samplePolygons") {
          this.map.removeLayer(this.samplePolygonsLayer);
        } else if (id == "suggestion") {
          this.map.removeLayer(this.suggestionLayer);
        }
      }
    },
    zoomToLayer: function (layerId) {
      // STOPPED
      let tempLayer = null;
      if (layerId == "aoi") tempLayer = this.aoiLayer;
      else if (layerId == "di") tempLayer = this.diLayer;
      else if (layerId == "pred") tempLayer = this.predLayer;
      else if (layerId == "aoa") tempLayer = this.aoaLayer;
      else if (layerId == "samplePolygons")
        tempLayer = this.samplePolygonsLayer;
      else if (layerId == "suggestion") tempLayer = this.suggestionLayer;
      else return;
      this.map.fitBounds(tempLayer.getBounds());
    },
    showGeoJson: async function () {
      const responseAoi = await fetch(this.aoiJson);
      const responseSamplePolygons = await fetch(this.samplePolygonsJson);
      const responseSuggestion = await fetch(this.suggestionJson);

      const aoi = await responseAoi.json();
      const samplePolygons = await responseSamplePolygons.json();
      const suggestion = await responseSuggestion.json();

      this.aoiLayer = L.geoJson().addData(aoi);
      this.samplePolygonsLayer = L.geoJson().addData(samplePolygons);
      this.suggestionLayer = L.geoJson().addData(suggestion);
    },
    showTif1Band: async function () {
      const responseDi = await fetch(this.diUrl);
      const responseAoa = await fetch(this.aoaUrl);
      const responsePred = await fetch(this.predUrl);

      // Make sure you get what you expect!
      // Should be an "image/tiff"  THESE TESTS MIGHT BE USEFULL WHEN THE TRUE DATA HAS TO BE LINKED
      console.log("Content-Type Di:", responseDi.headers.get("Content-Type"));
      console.log("Content-Type Aoa:", responseAoa.headers.get("Content-Type"));
      console.log(
        "Content-Type Pred:",
        responsePred.headers.get("Content-Type")
      );

      const arrayBufferDi = await responseDi.arrayBuffer();
      const arrayBufferAoa = await responseAoa.arrayBuffer();
      const arrayBufferPred = await responsePred.arrayBuffer();

      const georasterDi = await parseGeoraster(arrayBufferDi);
      const georasterAoa = await parseGeoraster(arrayBufferAoa);
      const georasterPred = await parseGeoraster(arrayBufferPred);

      this.diLayer = new GeoRasterLayer({
        georaster: georasterDi,
        opacity: this.diTransparency,
        resolution: 256,
      });

      this.aoaLayer = new GeoRasterLayer({
        georaster: georasterAoa,
        opacity: this.aoaTransparency,
        resolution: 256,
      });

      this.predLayer = new GeoRasterLayer({
        georaster: georasterPred,
        opacity: this.predTransparency,
        resolution: 256,
      });
    },
  },
  mounted() {
    this.initMap();
    this.showTif1Band();
    this.showGeoJson();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>
<style scoped>
body {
  text-align: center;
}
td {
  height: 90px;
}
#td_elements_without_slider {
  padding-top: 25px;
}
tr#not_last_td {
  border-bottom: white;
}
tr#last_td {
  border-bottom: grey;
  border-bottom-style: double;
}
th#title {
  -webkit-transform: rotate(60deg);
  -moz-transform: rotate(60deg);
  -o-transform: rotate(60deg);
  width: 20px;
  height: 100px;
  vertical-align: middle;
}
th#layer_name {
  width: 200px;
}
#download_b {
  border: none;
  background-color: white;
  float: right;
  padding-top: 17px;
}
.check {
  text-align: right;
  vertical-align: right;
  align-items: center;
  padding-top: 25px;
}
#job_number {
  padding-left: 20px;
  padding-top: 20px;
}
.checkbox {
  background-color: #fff;
  display: inline-block;
  height: 28px;
  margin: 0 0.25em;
  width: 28px;
  border-radius: 4px;
  border: 1px solid #ccc;
  /*float: middle;*/
}
.checkbox span {
  display: block;
  height: 28px;
  position: relative;
  width: 28px;
  padding: 0;
  text-align: center;
}
.checkbox span:after {
  -moz-transform: scaleX(-1) rotate(135deg);
  -ms-transform: scaleX(-1) rotate(135deg);
  -webkit-transform: scaleX(-1) rotate(135deg);
  transform: scaleX(-1) rotate(135deg);
  -moz-transform-origin: left top;
  -ms-transform-origin: left top;
  -webkit-transform-origin: left top;
  transform-origin: left top;
  border-right: 4px solid #fff;
  border-top: 4px solid #fff;
  content: "";
  display: block;
  height: 20px;
  left: 3px;
  position: absolute;
  top: 15px;
  width: 10px;
}
.checkbox span:hover:after {
  border-color: #999;
}
.checkbox input {
  display: none;
}
.checkbox input:checked + span:after {
  -webkit-animation: check 0.8s;
  -moz-animation: check 0.8s;
  -o-animation: check 0.8s;
  animation: check 0.8s;
  border-color: #555;
}
.checkbox input:checked + .default:after {
  border-color: #444;
}
.form-column {
  flex: auto;
}
.map-column {
  flex: auto;
  min-height: 500px;
  height: 50%;
}
#control.table {
  display: block;
  margin-left: auto;
  margin-right: auto;
}
@media (min-width: 992px) {
  .form-column {
    flex: 1;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    max-width: 200px;
  }
  .map-column {
    flex: 1;
    position: relative;
    min-height: 600px;
    height: 100%;
  }
}
</style>
