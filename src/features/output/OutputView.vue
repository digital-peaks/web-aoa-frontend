<template>
  <div class="d-flex flex-column flex-lg-row" style="flex: 1">
    <div class="form-column">
      <h2 id="job_number">Job xy</h2>
      <div class="container">
        <div class="col-lg">
          <div>
            <table class="table" id="control">
              <thead>
                <tr>
                  <th scope="col"></th>
                  <th id="title" scope="col">Ein-/Ausblenden</th>
                  <th id="title" scope="col">Download</th>
                </tr>
              </thead>
              <tbody>
                <tr id="not_last_td">
                  <td>Area of Interest</td>
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
                </tr>
                <tr id="not_last_td">
                  <td>Dissimilarity Index</td>
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
                </tr>
                <tr id="not_last_td">
                  <td>Klassifikation</td>
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
                      v-on:click="
                        downloadItem('geotiffs_test/pred.tif', 'pred')
                      "
                    >
                      <DownloadIcon width="16" />
                    </button>
                  </td>
                </tr>
                <tr id="not_last_td">
                  <td>Area of Applicability</td>
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
                </tr>
                <tr id="last_td">
                  <td>Trainingsgebiete</td>
                  <td class="check">
                    <label class="checkbox">
                      <input
                        class="checkbox"
                        type="checkbox"
                        id="train"
                        v-on:click="switchLayer('train')"
                      />
                      <span class="default"></span>
                    </label>
                  </td>
                  <td class="download_button"></td>
                </tr>
                <tr id="not_last_td">
                  <td>
                    Empfohlene Orte zum Sammeln von weiteren Trainigsgebieten
                  </td>
                  <td class="check">
                    <label class="checkbox">
                      <input
                        class="checkbox"
                        type="checkbox"
                        id="samplePoints"
                        v-on:click="switchLayer('samplePoints')"
                      />
                      <span class="default"></span>
                    </label>
                  </td>
                  <td class="download_button">
                    <button id="download_b">
                      <DownloadIcon width="16" />
                    </button>
                    <!--Downloadfile is missing-->
                  </td>
                </tr>
              </tbody>

              <tbody></tbody>
            </table>
          </div>
        </div>
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

export default {
  name: "Output",
  data: () => ({
    map: null,
    tileLayer: null,
    // In most cases it's just "/aoa_example.tif"
    // See: https://cli.vuejs.org/config/#baseurl
    // Here you have to link the .tif-folder given from the r-script
    //aoiUrl: `${process.env.BASE_URL}geotiffs_test/aoa_aoa.tif`,
    aoiLayer: null,
    diUrl: `${process.env.BASE_URL}geotiffs_test/aoa_di.tif`,
    diLayer: null,
    predUrl: `${process.env.BASE_URL}geotiffs_test/pred.tif`,
    predLayer: null,
    aoaUrl: `${process.env.BASE_URL}geotiffs_test/aoa_aoa.tif`,
    aoaLayer: null,
    trainLayer: null,
    samplePointsLayer: null,
  }),
  components: {
    DownloadIcon,
  },
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
    checkLayerGetsFoundWithoutMessage: function (layer) {
      if (layer == null) return false;
      else return true;
    },
    clearMap: function () {
      let temp = this.map;
      const tileLayerTemp = this.tileLayer;
      this.map.eachLayer(function (layer) {
        if (tileLayerTemp != layer) temp.removeLayer(layer);
      });
    },
    uncheckTheOtherCheckboxes: function (current) {
      const allCheckboxes = [
        "aoi",
        "di",
        "pred",
        "aoa",
        "train",
        "samplePoints",
      ];
      for (var i = 0; i < allCheckboxes.length; ++i)
        if (allCheckboxes[i] != current)
          document.getElementById(allCheckboxes[i]).checked = false;
    },
    switchLayer: function (id) {
      this.uncheckTheOtherCheckboxes(id);
      this.clearMap();
      let layer;
      let checked = document.getElementById(id).checked;
      if (checked) {
        if (id == "di") {
          layer = this.diLayer;
          if (!this.checkLayerGetsFoundWithMessage(layer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "aoa") {
          layer = this.aoaLayer;
          if (!this.checkLayerGetsFoundWithMessage(layer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "pred") {
          layer = this.predLayer;
          if (!this.checkLayerGetsFoundWithMessage(layer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "train") {
          layer = this.trainLayer;
          if (!this.checkLayerGetsFoundWithMessage(layer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        } else if (id == "aoa") {
          layer = this.aoaLayer;
          if (!this.checkLayerGetsFoundWithMessage(layer))
            throw "ERROR - Dieser Layer exisitiert nicht!";
        }
        layer.addTo(this.map);
        this.map.fitBounds(layer.getBounds());
      }
    },
    showTif1Band: async function () {
      //const responseAoi = await fetch(this.aoiUrl);
      const responseDi = await fetch(this.diUrl);
      const responseAoa = await fetch(this.aoaUrl);
      const responsePred = await fetch(this.predUrl);

      // Make sure you get what you expect!
      // Should be an "image/tiff"
      //console.log("Content-Type Aoi:", responseAoi.headers.get("Content-Type"));
      console.log("Content-Type Di:", responseDi.headers.get("Content-Type"));
      console.log("Content-Type Aoa:", responseAoa.headers.get("Content-Type"));
      console.log(
        "Content-Type Pred:",
        responsePred.headers.get("Content-Type")
      );

      //const arrayBufferAoi = await responseAoi.arrayBuffer();
      const arrayBufferDi = await responseDi.arrayBuffer();
      const arrayBufferAoa = await responseAoa.arrayBuffer();
      const arrayBufferPred = await responsePred.arrayBuffer();

      //const georasterAoi = await parseGeoraster(arrayBufferAoi);
      const georasterDi = await parseGeoraster(arrayBufferDi);
      const georasterAoa = await parseGeoraster(arrayBufferAoa);
      const georasterPred = await parseGeoraster(arrayBufferPred);

      this.diLayer = new GeoRasterLayer({
        georaster: georasterDi,
        opacity: 1,
        resolution: 256,
      });

      this.aoaLayer = new GeoRasterLayer({
        georaster: georasterAoa,
        opacity: 1,
        resolution: 256,
      });

      this.predLayer = new GeoRasterLayer({
        georaster: georasterPred,
        opacity: 1,
        resolution: 256,
      });
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
td {
  height: 50px;
}
tr#not_last_td {
  border-bottom: white;
}
tr#last_td {
  border-bottom: grey;
  border-bottom-style: double;
}
th#title {
  -webkit-transform: rotate(45deg);
  -moz-transform: rotate(45deg);
  -o-transform: rotate(45deg);
  width: 25px;
  height: 130px;
  vertical-align: middle;
}
#download_b {
  border: none;
  background-color: white;
  float: right;
}

.check {
  text-align: right;
  vertical-align: right;
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
@media (min-width: 992px) {
  .form-column {
    flex: 1;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }
  .map-column {
    flex: 1;
    position: relative;
    min-height: 600px;
    height: 100%;
  }
}
</style>
