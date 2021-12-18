<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <form class="d-flex flex-column form-column m-3" v-on:submit="onSubmitForm">
      <h3>Create job</h3>

      <div class="mt-2 mb-3">
        <v-text-field type="text" label="Name" filled v-model="formData.name" />
      </div>

      <div class="mt-3 mb-2"><h6>Sentinel-2</h6></div>

      <div class="row mb-3">
        <div class="col">
          <v-text-field
            type="date"
            label="From"
            filled
            v-model="formData.start_timestamp"
            :min="minTimestamp"
            :max="maxTimestamp"
          />
        </div>
        <div class="col">
          <v-text-field
            type="date"
            label="To"
            filled
            v-model="formData.end_timestamp"
            :min="minTimestamp"
            :max="maxTimestamp"
          />
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <v-select
            filled
            :items="['10', '20', '60']"
            label="Resolution"
            v-model="formData.resolution"
            suffix="meter"
          ></v-select>
        </div>
        <div class="col">
          <v-text-field
            type="number"
            filled
            label="Cloud Cover"
            v-model="formData.cloud_cover"
            min="0"
            max="100"
            suffix="%"
          />
        </div>
      </div>

      <div class="mt-3 mb-2"><h6>Samples</h6></div>

      <div class="row mb-3">
        <div class="col-6">
          <v-file-input
            filled
            label="Sample Polygons"
            accept=".json,.geojson,.gpkg"
            persistent-hint
            hint=".json,.geojson,.gpkg (max. 10 MB)"
            show-size
            truncate-length="25"
            v-model="samplesFile"
          ></v-file-input>
        </div>
        <div class="col-6">
          <v-text-field
            filled
            type="string"
            label="Class field"
            persistent-hint
            hint="Field which classifies the polygons."
            v-model="formData.samples_class"
          />
        </div>
      </div>

      <div class="mt-3 mb-2"><h6>Algorithm</h6></div>

      <div class="row mb-3">
        <div class="col-6">
          <v-select
            filled
            :items="['Random Forest']"
            label="Algorithm"
            value="Random Forest"
          ></v-select>
        </div>
      </div>

      <div class="d-flex justify-content-end">
        <router-link to="/"
          ><button type="button" class="btn btn-light">
            Cancel
          </button></router-link
        >
        <button type="submit" class="btn btn-primary ms-2">Start</button>
      </div>
    </form>
    <div class="bg-light map-column" id="map-container"></div>
  </div>
</template>

<script>
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import subMonths from "date-fns/subMonths";
import format from "date-fns/format";
import * as API from "@/common/api";

export default {
  name: "InputView",
  data: () => ({
    formData: {
      name: "",
      resolution: "10",
      cloud_cover: "15",
      start_timestamp: format(subMonths(new Date(), 6), "yyyy-MM-dd"),
      end_timestamp: format(new Date(), "yyyy-MM-dd"),
      samples_class: "class",
    },
    // Sentinel-2B start:
    minTimestamp: format(new Date("2017-03-09T00:00:00.000Z"), "yyyy-MM-dd"),
    maxTimestamp: format(new Date(), "yyyy-MM-dd"),
    // file previews:
    samplesFile: null,
    // map:
    map: null,
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
    /**
     * Checks the form and send it to the API.
     */
    async onSubmitForm(e) {
      // prevent that the form is send:
      e.preventDefault();

      // TODO: Implement a better form check with yup:
      if (!this.formData.name || !this.samplesFile || !this.drawnItem) {
        return;
      }

      // create job object for the api
      const job = {
        name: this.formData.name,
        use_lookup: false,
        resolution: Number.parseInt(this.formData.resolution, 10) || 10,
        cloud_cover: Number.parseInt(this.formData.cloud_cover, 10) || 15,
        start_timestamp: `${this.formData.start_timestamp}T00:00:00.000Z`,
        end_timestamp: `${this.formData.end_timestamp}T00:00:00.000Z`,
        samples_class: this.formData.samples_class,
        sampling_strategy: "regular",
        use_pretrained_model: false,
        area_of_interest: { ...this.aoiJson },
      };

      try {
        await API.createJob({ samples: this.samplesFile, job });
        // Go to the job overview
        this.$router.push("/");
      } catch (err) {
        // TODO: Better error handling:
        console.error(err);
      }
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
    overflow-x: hidden;
    min-height: 0;
  }
  .map-column {
    flex: 1;
    min-height: 500px;
    height: 100%;
  }
}
</style>
