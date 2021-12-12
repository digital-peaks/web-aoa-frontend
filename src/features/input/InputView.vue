<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <div class="form-column">
      <div class="m-3">
        <h3>Job erstellen</h3>

        <div class="form-floating mt-3 mb-3">
          <input type="text" class="form-control" id="name" placeholder="Jo" />
          <label for="name" class="form-label">Name</label>
        </div>

        <div class="form-floating mb-3">
          <select
            id="algorithm"
            class="form-select"
            style="width: auto; min-width: 200px"
            aria-label="Algorithmus auswählen"
          >
            <option selected>Random Forest</option>
            <option>Weitere...</option>
          </select>
          <label for="algorithm" class="form-label">Algorithmus</label>
        </div>

        <div class="mb-3">
          <!-- Hide input file and trigger it via the button -->
          <input
            type="file"
            ref="aoiInputJson"
            @
            v-on:change="onChangeAOIInputJson()"
            accept="application/JSON"
            class="d-none"
          />
          <div v-if="aoiFile">
            {{ aoiFile.name }}
          </div>
          <button
            type="button"
            v-on:click="selectAOIFileJson()"
            class="btn btn-secondary"
          >
            Area of Interest hochladen (*.json)
          </button>
          <input
            type="file"
            ref="aoiInputGpkg"
            @change="loadGeoPackage"
            accept="application/geopackage+sqlite3"
            class="d-none"
          />
          <div v-if="aoiFile">
            {{ aoiFile.name }}
          </div>
          <button
            type="button"
            @click="loadGeoPackage"
            class="btn btn-secondary"
          >
            Area of Interest hochladen (*.gpkg)
          </button>
        </div>
        <div class="d-flex justify-content-end">
          <router-link to="/"
            ><button type="button" class="btn btn-light">
              Abbrechen
            </button></router-link
          >
          <button type="button" class="btn btn-primary ms-2">Erstellen</button>
        </div>
      </div>
    </div>
    <div class="bg-light map-column" id="map-container"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
export default {
  name: "InputView",
  data: () => ({
    map: null,
    aoiFile: undefined,
    tileLayer: null,
    drawControl: null,
    rectangleLayer: null,
    drawnItem: null,
    aoiJson: {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [],
      },
      properties: {
        name: "AOI",
      },
    },
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
    selectAOIFileJson() {
      this.aoiInputJson.click();
    },
    onChangeAOIInputJson(event) {
      //onChangeAOIInputJson() {
      //const [file] = event.target.files;
      var file = event.target.files[0];
      this.aoiFile = file;
    },
    selectAOIFileGpkg() {
      this.aoiInputGpkg.click();
    },
    loadGeoPackage(event) {
      const [file] = event.target.files;
      this.aoiFile = file;
      console.log(this.aoiFile);
    },
  },
  mounted() {
    this.initMap();
    this.$nextTick(() => {
      this.rectangleLayer = new window.L.FeatureGroup().addTo(this.map);

      const drawControl = new window.L.Control.Draw({
        position: "topleft",
        draw: {
          polyline: false,
          polygon: false,
          rectangle: {
            showArea: true,
            metric: ["km"], // SHOULD CONTAIN A LIMIT BUT I DONT KNOW HOW
          },
          circle: false,
          marker: false,
          circlemarker: false,
        },
        edit: {
          featureGroup: this.rectangleLayer,
          remove: true,
          edit: false,
        },
      });

      this.map.addControl(drawControl);

      this.map.on(window.L.Draw.Event.CREATED, (e) => {
        if (this.drawnItem != null) {
          // In case a drawn item on the map already exists, it gets removed and the aoiJson attribute gets overwritten. The result is, that only one aoi can be entered
          this.rectangleLayer.removeLayer(this.drawnItem);
        }
        // const type = e.layerType;
        this.drawnItem = e.layer;
        var aoiSize = window.L.GeometryUtil.geodesicArea(
          this.drawnItem.getLatLngs()
        ); // This variable contains the szie of the entered aoi in m2.
        console.log(aoiSize);
        if (aoiSize <= 3000) {
          // DOENST WORK SO FAR
          for (var i = 0; i < 4; ++i) {
            this.aoiJson.geometry.coordinates[i] = [
              this.drawnItem._latlngs[0][i].lat,
              this.drawnItem._latlngs[0][i].lng,
            ];
          }
          console.log(this.aoiJson);
          // Do whatever else you need to. (save to db, add to map etc)
          this.rectangleLayer.addLayer(this.drawnItem);
        } else {
          console.log("The area has to be smaller than 300 km^2!");
        }
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
.form-column {
  flex: auto;
}
.map-column {
  flex: auto;
  min-height: 350px;
  height: 50%;
}
@media (min-width: 992px) {
  .form-column {
    flex: 1;
    height: 100%;
    position: relative;
    overflow-y: auto;
    min-height: 0;
  }
  .map-column {
    flex: 1;
    min-height: 500px;
    height: 100%;
  }
}
</style>
