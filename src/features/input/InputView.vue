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
            ref="aoiInput"
            @change="onChangeAOIInput"
            accept="application/JSON"
            class="d-none"
          />
          <div v-if="aoiFile">
            {{ aoiFile.name }}
          </div>
          <button
            type="button"
            @click="selectAOIFile"
            class="btn btn-secondary"
          >
            Area of Interest hochladen (*.json)
          </button>
        </div>
        <div class="d-flex justify-content-end">
          <button type="button" class="btn btn-light">Abbrechen</button>
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
    selectAOIFile() {
      this.aoiInput.click();
    },
    onChangeAOIInput(event) {
      const [file] = event.target.files;
      this.aoiFile = file;
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
        if (this.drawnItem != null)
          this.rectangleLayer.removeLayer(this.drawnItem);
        // const type = e.layerType;
        this.drawnItem = e.layer;
        for (var i = 0; i < 4; ++i) {
          this.aoiJson.geometry.coordinates[i] = [
            this.drawnItem._latlngs[0][i].lat,
            this.drawnItem._latlngs[0][i].lng,
          ];
        }
        // Do whatever else you need to. (save to db, add to map etc)
        // this.map.addLayer(layer);
        this.rectangleLayer.addLayer(this.drawnItem);
        console.log(this.aoiJson.geometry);
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
