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
    <div class="bg-light map-column" id="map-container">
      <l-map
        ref="map"
        style="width: 100%; height: 450px"
        :zoom="zoom"
        :center="center"
      >
        <!--<l-draw-toolbar position="topleft" />-->
        <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
        <l-marker :lat-lng="markerLatLng"></l-marker>
      </l-map>
    </div>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
//import LDrawToolbar from "vue2-leaflet-draw-toolbar";
//import LDraw from "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";

export default {
  name: "InputView",
  data: () => ({
    map: null,
    drawControl: null,
    rectangleLayer: null,
    aoiFile: undefined,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 10,
    center: [51.966, 7.633],
    markerLatLng: [51.966, 7.633],
  }),
  components: {
    //LDrawToolbar,
    LMap,
    LTileLayer,
    LMarker,
  },
  mounted() {
    this.$nextTick(() => {
      // eslint-disable-next-line
      this.map = this.$refs.map.mapObject;

      this.rectangleLayer = new window.L.FeatureGroup().addTo(this.map);

      this.drawControl = new window.L.Control.Draw({
        position: "topleft",
        draw: {
          polyline: false,
          polygon: false,
          rectangle: true,
          circle: false,
          marker: false,
          circlemarker: false,
        } /*
        edit: {
          featureGroup: this.rectangleLayer,
          remove: true,
          edit: false,
        },*/,
      });
    });

    this.map.addControl(this.drawControl);

    this.rectangleLayer = new window.L.FeatureGroup().addTo(this.map);
    this.map.on(window.L.Draw.Event.CREATED, (e) => {
      const layer = e.layer;

      this.rectangleLayer.addLayer(layer);
    });
  },
  methods: {
    selectAOIFile() {
      this.aoiInput.click();
    },
    onChangeAOIInput(event) {
      const [file] = event.target.files;
      this.aoiFile = file;
    },
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
    position: relative;
    min-height: auto;
    height: 100%;
  }
}
</style>
