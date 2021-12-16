<template>
  <div class="d-flex flex-column-reverse flex-lg-row" style="flex: 1">
    <form class="d-flex flex-column form-column m-3" v-on:submit="onSubmitForm">
      <h3>Create job</h3>

      <div class="mt-2 mb-3">
        <div class="form-floating">
          <input
            type="text"
            class="form-control"
            id="name"
            placeholder=""
            v-model="formData.name"
          />
          <label for="name" class="form-label">Name</label>
        </div>
      </div>

      <div class="mt-3 mb-2"><h6>Sentinel-2</h6></div>

      <div class="row mb-3">
        <div class="col">
          <div class="form-floating">
            <input
              type="date"
              class="form-control"
              id="start_timestamp"
              v-model="formData.start_timestamp"
              :min="minTimestamp"
              :max="maxTimestamp"
              required
            />
            <label for="start_timestamp" class="form-label">From</label>
          </div>
        </div>
        <div class="col">
          <div class="form-floating">
            <input
              type="date"
              class="form-control"
              id="end_timestamp"
              v-model="formData.end_timestamp"
              :min="minTimestamp"
              :max="maxTimestamp"
              required
            />
            <label for="end_timestamp" class="form-label">To</label>
          </div>
        </div>
      </div>

      <div class="row mb-3">
        <div class="col">
          <div class="input-group floating">
            <div class="form-floating">
              <select
                class="form-select"
                id="resolution"
                v-model="formData.resolution"
              >
                <option selected value="10">10</option>
                <option selected value="20">20</option>
                <option selected value="60">60</option>
              </select>

              <label for="resolution" class="form-label">Resolution</label>
            </div>
            <span class="input-group-text">meter</span>
          </div>
        </div>
        <div class="col">
          <div class="input-group floating">
            <div class="form-floating">
              <input
                type="text"
                class="form-control"
                id="cloud_cover"
                v-model="formData.cloud_cover"
              />
              <label for="cloud_cover" class="form-label">Cloud Cover</label>
            </div>
            <span class="input-group-text">%</span>
          </div>
        </div>
      </div>

      <div class="mt-3 mb-2"><h6>Samples</h6></div>

      <div class="row mb-3">
        <div class="col-6">
          <input
            type="file"
            ref="samplesFileInput"
            class="d-none"
            accept=".json,.geojson"
            v-on:change="onChangeSamplesFileInput"
          />
          <div
            class="form-floating"
            v-on:click="selectSamplesFile"
            v-on:keyup.enter="selectSamplesFile"
            style="cursor: pointer"
          >
            <input
              type="text"
              class="form-control"
              id="samples_preview"
              :value="samplesFile ? samplesFile.name : 'Select .json, .geojson'"
              style="pointer-events: none; color: #4c6ef5"
            />
            <label for="samples_preview" class="form-label">File</label>
          </div>
        </div>
        <div class="col-6">
          <div class="form-floating">
            <input
              type="text"
              class="form-control"
              id="samples_class"
              v-model="formData.samples_class"
            />
            <label for="samples_class" class="form-label">Class field</label>
          </div>
        </div>
      </div>

      <div class="mt-3 mb-2"><h6>Algorithm</h6></div>

      <div class="row mb-3">
        <div class="col-6">
          <div class="form-floating">
            <select
              id="algorithm"
              class="form-select"
              aria-label="Select algorithm"
            >
              <option selected>Random Forest</option>
            </select>
            <label for="algorithm" class="form-label">Algorithm</label>
          </div>
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
    selectSamplesFile() {
      this.$refs.samplesFileInput.click();
    },
    onChangeSamplesFileInput(event) {
      const file = event.target.files[0];
      this.samplesFile = file;
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
        area_of_interest: {
          type: "FeatureCollection",
          features: [{ ...this.aoiJson }],
        },
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
