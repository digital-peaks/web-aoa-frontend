<template>
  <div class="d-flex flex-column flex-lg-row wrapper" style="flex: 1">
    <div class="flex-column layer-column">
      <div id="job_number" class="m-3 text-h5">{{ job.name || "-" }}</div>

      <v-simple-table class="mb-6">
        <template v-slot:default>
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
                <div class="d-flex align-items-center">
                  <v-checkbox
                    id="aoi"
                    v-on:click="switchLayer('aoi')"
                    color="primary"
                  ></v-checkbox>

                  <v-btn class="ms-2" icon v-on:click="zoomToLayer('aoi')">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </div>
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

                <ColorLegend scale="Viridis" :steps="6" :fixed="1" />
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <v-checkbox
                    id="di"
                    v-on:click="switchLayer('di')"
                    color="primary"
                  ></v-checkbox>
                  <v-btn class="ms-2" icon v-on:click="zoomToLayer('di')">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn
                    class="ms-2"
                    icon
                    v-on:click="
                      downloadItem('geotiffs_test/aoa_di.tif', 'aoa_di')
                    "
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
            <tr id="not_last_td">
              <td id="td_elements_with_slider">
                Prediction / Classification
                <vue-slider
                  v-model="predTransparency"
                  v-on:change="changeOpacity('pred')"
                  :tooltip-formatter="sliderPercentage"
                />
                <p style="font-size: 10px">Transparency</p>
              </td>
              <td>
                <div class="d-flex align-items-center">
                  <v-checkbox
                    id="pred"
                    v-on:click="switchLayer('pred')"
                    color="primary"
                  ></v-checkbox>
                  <v-btn class="ms-2" icon v-on:click="zoomToLayer('pred')">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn
                    class="ms-2"
                    icon
                    v-on:click="downloadItem('geotiffs_test/pred.tif', 'pred')"
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </div>
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

                <ColorLegend
                  :scale="['#cf1f8f', '#ffffff']"
                  :steps="2"
                  :fixed="0"
                />
              </td>

              <td>
                <div class="d-flex align-items-center">
                  <v-checkbox
                    id="aoa"
                    v-on:click="switchLayer('aoa')"
                    color="primary"
                  ></v-checkbox>
                  <v-btn class="ms-2" icon v-on:click="zoomToLayer('aoa')">
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn
                    class="ms-2"
                    icon
                    v-on:click="
                      downloadItem('geotiffs_test/aoa_aoa.tif', 'aoa_aoa')
                    "
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </div>
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
              <td>
                <div class="d-flex align-items-center">
                  <v-checkbox
                    id="samplePolygons"
                    v-on:click="switchLayer('samplePolygons')"
                    color="primary"
                  ></v-checkbox>
                  <v-btn
                    class="ms-2"
                    icon
                    v-on:click="zoomToLayer('samplePolygons')"
                  >
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
            <tr id="not_last_td">
              <td id="td_elements_with_slider">
                Suggested locations for training polygons
              </td>

              <td>
                <div class="d-flex align-items-center">
                  <v-checkbox
                    id="suggestion"
                    v-on:click="switchLayer('suggestion')"
                    color="primary"
                  ></v-checkbox>
                  <v-btn
                    class="ms-2"
                    icon
                    v-on:click="zoomToLayer('suggestion')"
                  >
                    <v-icon>mdi-magnify</v-icon>
                  </v-btn>
                  <v-btn
                    class="ms-2"
                    icon
                    v-on:click="
                      downloadItem(
                        'geotiffs_test/suggestion.geojson',
                        'suggestion'
                      )
                    "
                  >
                    <v-icon>mdi-download</v-icon>
                  </v-btn>
                </div>
              </td>
            </tr>
          </tbody>

          <tbody></tbody
        ></template>
      </v-simple-table>
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

import ColorLegend from "@/components/ColorLegend";

import { mapState } from "vuex";
import axios from "axios";
import * as API from "@/common/api";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

import chroma from "chroma-js";

import markerPng from "@/assets/markerIconRedCrossWithBlackEvenThicker.png";

export default {
  name: "Output",
  computed: mapState({
    jobId() {
      // Getting job based on the router parameter (see vue-router):
      const { jobId = "" } = this.$route.params;
      return jobId;
    },
    job(state) {
      return state.jobs[this.jobId] || {};
    },
  }),
  data: () => ({
    map: null,
    tileLayer: null,
    earthLayer: null,
    // Everything needed to visualize the aoi.geojson.
    aoiJson: "aoi.geojson",
    aoiLayer: null,
    aoiTransparency: 50,
    aoiLineThickness: 1,
    // Everything needed to visualize the aoi_di.tif.
    diUrl: "aoa_di.tif",
    diLayer: null,
    diTransparency: 100,
    // Everything needed to visualize the pred.tif.
    predUrl: "pred.tif",
    predLayer: null,
    predTransparency: 100,
    // Everything needed to visualize the aoi_aoa.tif.
    aoaUrl: "aoa_aoa.tif",
    aoaLayer: null,
    aoaTransparency: 100,
    // Everything needed to visualize the samplePolygons.geojson.
    samplePolygonsJson: "samples.geojson",
    samplePolygonsLayer: null,
    samplePolygonsTransparency: 50,
    samplePolygonsLineThickness: 1,
    // Everything needed to visualize the suggestion.geojson.
    suggestionJson: "suggestion.geojson",
    suggestionLayer: null,
    // Causes the percentage scale of the slider component.
    sliderPercentage: "{value} %",
  }),
  components: {
    VueSlider,
    ColorLegend,
  },
  methods: {
    /**
     * This function initializes the leaflet map with an osm tile layer and focused on Münster.
     */
    initMap: function () {
      this.map = L.map("map-container", {
        layers: this.tileLayer,
      }).setView([51.966, 7.633], 10);

      // To make sure, that the two basement options lie underneath the outputlayers which should be visualized,
      // a Pane with a z-Index gets created, which makes sure they will always lie underneath.
      this.map.createPane("basemap");
      this.map.getPane("basemap").style.zIndex = 10;
      // To keep sure the tiles are not able to grab this line gets added.
      this.map.getPane("basemap").style.pointerEvents = "none";
      // First the osm layer gets initialized.
      const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const osmAttr =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      // Afterwards the world imagery layer gets initialized.
      const earthUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      const earthAttr =
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";

      this.tileLayer = L.tileLayer(osmUrl, {
        attribution: osmAttr,
        pane: "basemap", // Both layers are added to the basemap-pane.
      }).addTo(this.map);

      this.earthLayer = L.tileLayer(earthUrl, {
        attribution: earthAttr,
        pane: "basemap", // Both layers are added to the basemap-pane.
      });

      // At last a layer control must be added to switch between multiple basemaps.
      L.control
        .layers(
          { "Open Street Map": this.tileLayer },
          { "World Imagery": this.earthLayer }
        )
        .addTo(this.map);
    },
    /**
     * this function triggers the downlad process of the result of the calculations.
     * @param {string} urlLink -  Contains the internal URL to the file.
     * @param {string} label - Contains the label the downloaded file should get.
     */
    downloadItem: async function (urlLink, label) {
      const url = `${process.env.BASE_URL}` + urlLink;
      let response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], { type: "image/tiff" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
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
    // eslint-disable-next-line
    createCustomIcon: function (feature, latlng) {
      const customizedIcon = L.icon({
        iconUrl: markerPng,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
      });
      return L.marker(latlng, { icon: customizedIcon });
    },
    /**
     * This function builds layers for all .geojson files.
     */
    showGeoJson: async function () {
      const myLayerOptions = {
        pointToLayer: this.createCustomIcon,
      };

      let responseAoi = null;
      let responseSamplePolygons = null;
      let responseSuggestion = null;

      try {
        responseAoi = await API.getJobFile(this.jobId, this.aoiJson);
      } catch (err) {
        console.warn("Unable to load file:", this.aoiJson);
      }
      try {
        responseSamplePolygons = await API.getJobFile(
          this.jobId,
          this.samplePolygonsJson
        );
      } catch (err) {
        console.warn("Unable to load file:", this.samplePolygonsJson);
      }
      try {
        responseSuggestion = await API.getJobFile(
          this.jobId,
          this.suggestionJson
        );
      } catch (err) {
        console.warn("Unable to load file:", this.suggestionJson);
      }

      if (responseAoi) {
        this.aoiLayer = L.geoJson(responseAoi.data);
      }
      if (responseSamplePolygons) {
        this.samplePolygonsLayer = L.geoJson(responseSamplePolygons.data);
      }
      if (responseSuggestion) {
        this.suggestionLayer = L.geoJson(
          responseSuggestion.data,
          myLayerOptions
        );
      }
    },
    /**
     * This function builds layers for all .tif files.
     */
    showTif1Band: async function () {
      let responseDi = null;
      let responseAoa = null;
      let responsePred = null;

      try {
        responseDi = await API.getJobFile(this.jobId, this.diUrl, {
          responseType: "arraybuffer",
        });
      } catch (err) {
        console.warn("Unable to load file:", this.diUrl);
      }
      try {
        responseAoa = await API.getJobFile(this.jobId, this.aoaUrl, {
          responseType: "arraybuffer",
        });
      } catch (err) {
        console.warn("Unable to load file:", this.aoaUrl);
      }
      try {
        responsePred = await API.getJobFile(this.jobId, this.predUrl, {
          responseType: "arraybuffer",
        });
      } catch (err) {
        console.warn("Unable to load file:", this.predUrl);
      }

      if (responseDi) {
        const georasterDi = await parseGeoraster(responseDi.data);

        const minDi = georasterDi.mins[0];
        const rangeDi = georasterDi.ranges[0];

        const scaleViridis = chroma.scale("Viridis");

        this.diLayer = new GeoRasterLayer({
          georaster: georasterDi,
          opacity: this.diTransparency,
          pixelValuesToColorFn: function (pixelValues) {
            const [pixelValue] = pixelValues; // there's just one band in this raster
            // if there's zero wind, don't return a color
            if (pixelValue === 0) return null;
            // scale to 0 - 1 used by chroma
            const scaledPixelValue = (pixelValue - minDi) / rangeDi;

            const color = scaleViridis(scaledPixelValue).hex();

            return color;
          },
          resolution: 256,
        });
      }

      if (responseAoa) {
        const georasterAoa = await parseGeoraster(responseAoa.data);

        this.aoaLayer = new GeoRasterLayer({
          georaster: georasterAoa,
          opacity: this.aoaTransparency,
          pixelValuesToColorFn: function (pixelValues) {
            const pixelValue = pixelValues[0];
            // if there's zero wind, don't return a color
            if (pixelValue === 1) {
              return null;
            }
            return "#cf1f8f";
          },
          resolution: 256,
        });
      }

      if (responsePred) {
        const georasterPred = await parseGeoraster(responsePred.data);

        this.predLayer = new GeoRasterLayer({
          georaster: georasterPred,
          opacity: this.predTransparency,
          resolution: 256,
        });
      }
    },
  },
  mounted() {
    this.$store.dispatch("getJobById", this.jobId);

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

#control.table {
  display: block;
  /* DOENST WORK BUT THE TARGET WAS A CENTER ALIGNED LAYER CONTROL FOR THE RESPONSIVE DESIGN */
  margin-left: auto;
  margin-right: auto;
}
.layer-column {
  flex: auto;
}
#map-container {
  width: 100%;
  height: 500px;
}
@media (min-width: 1264px) {
  .wrapper {
    flex: 1;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .layer-column {
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    min-width: 410px;
    max-width: 410px;
  }
  #map-container {
    width: 100%;
    height: 100%;
  }
}
</style>
