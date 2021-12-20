<template>
  <div class="d-flex flex-column flex-lg-row wrapper" style="flex: 1">
    <div class="flex-column m-3">
      <h2 id="job_number">Job xy</h2>

      <div class="col-lg">
        <v-simple-table fixed-header height="600px">
          <template v-slot:default>
            <thead>
              <tr>
                <th id="layer_name" class="text-center"></th>
                <th id="title_show_hide" class="text-center">Show/ Hide</th>
                <th id="title_download" class="text-center">Download</th>
                <th id="title" class="text-center">Zoom to layer</th>
              </tr>
            </thead>
            <tbody>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Area of Interest (AOI)
                  <vue-slider
                    v-model="aoiTransparency"
                    v-on:change="changeOpacity('aoi')"
                    :minRange="0"
                    :maxRange="10"
                  />
                  <p style="font-size: 10px">Transparency</p>
                  <vue-slider
                    v-model="aoiLineThickness"
                    v-on:change="changeLineThickness('aoi')"
                    :data="[0, 1, 2, 3, 4, 5]"
                    :marks="true"
                    :hide-label="true"
                  />
                  <p style="font-size: 10px">Line thickness</p>
                </td>
                <td class="check justify-center align-start">
                  <v-checkbox
                    id="aoi"
                    v-on:click="switchLayer('aoi')"
                    color="primary"
                  ></v-checkbox>
                </td>
                <td class="download_button"></td>
                <td id="zoom_button">
                  <v-btn icon v-on:click="zoomToLayer('aoi')">
                    <MagnifierIcon width="20" />
                  </v-btn>
                </td>
              </tr>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Dissimilarity Index
                  <vue-slider
                    v-model="diTransparency"
                    v-on:change="changeOpacity('di')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>
                </td>
                <td class="check">
                  <v-checkbox
                    id="di"
                    v-on:click="switchLayer('di')"
                    color="primary"
                  ></v-checkbox>
                </td>
                <td class="download_button">
                  <v-btn
                    icon
                    v-on:click="
                      downloadItem('geotiffs_test/aoa_di.tif', 'aoa_di')
                    "
                  >
                    <DownloadIcon width="16" />
                  </v-btn>
                </td>
                <td id="zoom_button">
                  <v-btn icon v-on:click="zoomToLayer('di')">
                    <MagnifierIcon width="20" />
                  </v-btn>
                </td>
              </tr>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Prediciton / Classification
                  <vue-slider
                    v-model="predTransparency"
                    v-on:change="changeOpacity('pred')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>
                </td>
                <td class="check">
                  <v-checkbox
                    id="pred"
                    v-on:click="switchLayer('pred')"
                    color="primary"
                  ></v-checkbox>
                </td>
                <td class="download_button">
                  <v-btn
                    icon
                    v-on:click="downloadItem('geotiffs_test/pred.tif', 'pred')"
                  >
                    <DownloadIcon width="16" />
                  </v-btn>
                </td>
                <td id="zoom_button">
                  <v-btn icon v-on:click="zoomToLayer('pred')">
                    <MagnifierIcon width="20" />
                  </v-btn>
                </td>
              </tr>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Area of Applicability (AOA)
                  <vue-slider
                    v-model="aoaTransparency"
                    v-on:change="changeOpacity('aoa')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>
                </td>
                <td class="check">
                  <v-checkbox
                    id="aoa"
                    v-on:click="switchLayer('aoa')"
                    color="primary"
                  ></v-checkbox>
                </td>
                <td class="download_button">
                  <v-btn
                    icon
                    v-on:click="
                      downloadItem('geotiffs_test/aoa_aoa.tif', 'aoa_aoa')
                    "
                  >
                    <DownloadIcon width="16" />
                  </v-btn>
                </td>
                <td id="zoom_button">
                  <v-btn icon v-on:click="zoomToLayer('aoa')">
                    <MagnifierIcon width="20" />
                  </v-btn>
                </td>
              </tr>
              <tr id="last_td">
                <td id="td_elements_with_slider">
                  Sample Polygons
                  <vue-slider
                    v-model="samplePolygonsTransparency"
                    v-on:change="changeOpacity('samplePolygons')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>
                  <vue-slider
                    v-model="samplePolygonsLineThickness"
                    v-on:change="changeLineThickness('samplePolygons')"
                    :data="[0, 1, 2, 3, 4, 5]"
                    :marks="true"
                    :hide-label="true"
                  />
                  <p style="font-size: 10px">Line thickness</p>
                </td>
                <td class="check">
                  <v-checkbox
                    id="samplePolygons"
                    v-on:click="switchLayer('samplePolygons')"
                    color="primary"
                  ></v-checkbox>
                </td>
                <td class="download_button"></td>
                <td id="zoom_button">
                  <v-btn icon v-on:click="zoomToLayer('samplePolygons')">
                    <MagnifierIcon width="20" />
                  </v-btn>
                </td>
              </tr>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Suggested locations for training polygons
                </td>
                <td class="check">
                  <v-checkbox
                    id="suggestion"
                    v-on:click="switchLayer('suggestion')"
                    color="primary"
                  ></v-checkbox>
                </td>
                <td class="download_button">
                  <v-btn
                    icon
                    v-on:click="
                      downloadItem(
                        'geotiffs_test/suggestion.geojson',
                        'suggestion'
                      )
                    "
                  >
                    <DownloadIcon width="16" />
                  </v-btn>
                </td>
                <td id="zoom_button">
                  <v-btn icon v-on:click="zoomToLayer('suggestion')">
                    <MagnifierIcon width="20" />
                  </v-btn>
                </td>
              </tr>
            </tbody>

            <tbody></tbody
          ></template>
        </v-simple-table>
      </div>
    </div>
    <div class="d-flex align-stretch bg-light" style="flex: 1">
      <div id="map-container"></div>
    </div>
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
import MagnifierIcon from "@/components/MagnifierIcon.vue";

import axios from "axios";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

import chroma from "chroma-js";

export default {
  name: "Output",
  data: () => ({
    map: null,
    tileLayer: null,
    // Everything needed to visualize the aoi.geojson.
    aoiJson: `${process.env.BASE_URL}geotiffs_test/aoi.geojson`,
    aoiLayer: null,
    aoiTransparency: 50,
    aoiLineThickness: 1,
    // Everything needed to visualize the aoi_di.tif.
    diUrl: `${process.env.BASE_URL}geotiffs_test/aoa_di.tif`,
    diLayer: null,
    diTransparency: 100,
    // Everything needed to visualize the pred.tif.
    predUrl: `${process.env.BASE_URL}geotiffs_test/pred.tif`,
    predLayer: null,
    predTransparency: 100,
    // Everything needed to visualize the aoi_aoa.tif.
    aoaUrl: `${process.env.BASE_URL}geotiffs_test/aoa_aoa.tif`,
    aoaLayer: null,
    aoaTransparency: 100,
    // Everything needed to visualize the samplePolygons.geojson.
    samplePolygonsJson: `${process.env.BASE_URL}geotiffs_test/samplePolygons.geojson`,
    samplePolygonsLayer: null,
    samplePolygonsTransparency: 50,
    samplePolygonsLineThickness: 1,
    // Everything needed to visualize the suggestion.geojson.
    suggestionJson: `${process.env.BASE_URL}geotiffs_test/suggestion.geojson`,
    suggestionLayer: null,
    // Causes the percentage scale of the slider component.
    sliderPercentage: "{value} %",
  }),
  components: {
    DownloadIcon,
    MagnifierIcon,
    VueSlider,
  },
  methods: {
    /**
     * This function initializes the leaflet map with an osm tile layer and focused on Münster.
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
    /**
     * this function triggers the downlad process of the result of the calculations.
     * @param {string} urlLink -  Contains the internal URL to the file.
     * @param {string} label - Contains the label the downloaded file should get.
     */
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
    /**
     * This function checks whether a requested layer exists or not
     * @param {GeoRasterLayer / GeoJson} layer - This parameter contains the requested layer.
     * @return {Boolean} - It returns true, if the layer eists and false if not.
     */
    checkLayerGetsFoundWithMessage: function (layer) {
      if (layer == null) {
        console.log("Dieser Layer existiert nicht");
        return false;
      } else return true;
    },
    /**
     * This function changes the opacity when triggered through a button.
     * @param {string} layerId - The layerId must be given to change the opacity for the right layer.
     */
    changeOpacity: function (layerId) {
      if (layerId == "aoi") {
        this.aoiLayer.setStyle({
          fillOpacity: this.aoiTransparency / 100,
        });
      } else if (layerId == "aoa") {
        this.aoaLayer.setOpacity(this.aoaTransparency / 100);
      } else if (layerId == "di") {
        this.diLayer.setOpacity(this.diTransparency / 100);
      } else if (layerId == "pred") {
        this.predLayer.setOpacity(this.predTransparency / 100);
      } else if (layerId == "samplePolygons") {
        this.samplePolygonsLayer.setStyle({
          fillOpacity: this.samplePolygonsTransparency / 100,
        });
      }
    },
    /**
     * This function changes the line thickness of the polygons in a GeoJson layer.
     * @param {string} layerId - The layerId must be given to change the line thickness for the right layer.
     */
    changeLineThickness: function (layerId) {
      if (layerId == "aoi") {
        this.aoiLayer.setStyle({
          weight: this.aoiLineThickness,
        });
      } else if (layerId == "samplePolygons") {
        this.samplePolygonsLayer.setStyle({
          weight: this.samplePolygonsLineThickness,
        });
      }
    },
    /**
     * This function (de-)activates the layer when it gets triffered by the Show/Hide checkbox.
     * @param {string} id - The id is needed to know which layer got triggered.
     */
    switchLayer: function (id) {
      let tempLayer = null;
      let checked = document.getElementById(id).checked;
      if (!checked) checked = true;
      // This line and the following one convert the value because vuetify uses switched values.
      else checked = false;
      if (checked) {
        // In case the checkbox is after clicking it checked the layer gets activated.
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
          tempLayer = this.suggestionLayer;
          if (!this.checkLayerGetsFoundWithMessage(tempLayer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        }
        tempLayer.addTo(this.map);
        this.map.fitBounds(tempLayer.getBounds());
      } else if (!checked) {
        // In case the checkbox is after clicking it unchecked the layer gets deactivated.
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
    /**
     * This function focuses the map to the layer where the button gets triggered. It's comparable to the "zoom to layer" function known from common GIS.
     * @param {string} layerId - The layer id is needed to kn ow which layer got triggered.
     */
    zoomToLayer: function (layerId) {
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
    /**
     * This function builds layers for all .geojson files.
     */
    showGeoJson: async function () {
      const responseAoi = await fetch(this.aoiJson);
      const responseSamplePolygons = await fetch(this.samplePolygonsJson);
      const responseSuggestion = await fetch(this.suggestionJson);

      const aoi = await responseAoi.json();
      const samplePolygons = await responseSamplePolygons.json();
      const suggestion = await responseSuggestion.json();

      this.aoiLayer = L.geoJson().addData(aoi);
      this.samplePolygonsLayer = L.geoJson(samplePolygons);
      this.suggestionLayer = L.geoJson(suggestion);
    },
    /**
     * This function builds layers for all .tif files.
     */
    showTif1Band: async function () {
      const responseDi = await fetch(this.diUrl);
      const responseAoa = await fetch(this.aoaUrl);
      const responsePred = await fetch(this.predUrl);

      // Make sure you get what you expect!
      // Should be an "image/tiff"  THESE TESTS MIGHT BE USEFULL WHEN THE TRUE DATA HAS TO BE LINKED
      // THE FOLLOWING LINES OF CODE ARE JUST INCLUDES FOR INTERNAL CHECKS IF THEY ARE NECESSARY

      //console.log("Content-Type Di:", responseDi.headers.get("Content-Type"));
      //console.log("Content-Type Aoa:", responseAoa.headers.get("Content-Type"));
      //console.log("Content-Type Pred:", responsePred.headers.get("Content-Type"));

      const arrayBufferDi = await responseDi.arrayBuffer();
      const arrayBufferAoa = await responseAoa.arrayBuffer();
      const arrayBufferPred = await responsePred.arrayBuffer();

      const georasterDi = await parseGeoraster(arrayBufferDi);
      const georasterAoa = await parseGeoraster(arrayBufferAoa);
      console.log("georasterAoa.mins[0]: ", georasterAoa.mins[0]);
      console.log("georasterAoa.maxs[0]: ", georasterAoa.maxs[0]);
      console.log("georasterAoa.ranges[0]: ", georasterAoa.ranges[0]);
      console.log(chroma.brewer);
      const scale = chroma.scale("Viridis");

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
#td_elements_with_slider {
  padding-top: 15px;
  padding-bottom: 5px;
}
tr#not_last_td {
  border-bottom: white;
}
tr#last_td {
  border-bottom: grey;
  border-bottom-style: double;
}
th#title {
  /*-webkit-transform: rotate(90deg); ROTATION REMOVED NOT SURE WHETHER TO KEEP IT THAT WAY OR NOT 
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);*/
  width: 20px;
  height: 100px;
  text-align: center;
}
th#title_show_hide {
  /*-webkit-transform: rotate(90deg); ROTATION REMOVED NOT SURE WHETHER TO KEEP IT THAT WAY OR NOT 
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);*/
  width: 20px;
  height: 100px;
  text-align: center;
}
th#title_download {
  /*-webkit-transform: rotate(90deg); ROTATION REMOVED NOT SURE WHETHER TO KEEP IT THAT WAY OR NOT 
  -moz-transform: rotate(90deg);
  -o-transform: rotate(90deg);*/
  width: 20px;
  height: 100px;
  text-align: center;
}
th#layer_name {
  width: 210px;
}
#download_b {
  padding-top: 17px;
}
.download_button {
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
}
#zoom_button {
}
td.check {
  margin: auto;
  text-align: center;
  align-items: center;
  justify-content: center;
  padding-bottom: 20px;
  padding-left: 20px;
}
#job_number {
  padding-left: 20px;
  padding-top: 20px;
}

#control.table {
  display: block;
  /* DOENST WORK BUT THE TARGET WAS A CENTER ALIGNED LAYER CONTROL FOR THE RESPONSIVE DESIGN */
  margin-left: auto;
  margin-right: auto;
}
.form-column {
  flex: auto;
}
#map-container {
  width: 100%;
  height: 500px;
}
@media (min-width: 992px) {
  .wrapper {
    flex: 1;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .form-column {
    flex: 1;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    max-width: 210px;
  }
  #map-container {
    width: 100%;
    height: 100%;
  }
}
</style>
