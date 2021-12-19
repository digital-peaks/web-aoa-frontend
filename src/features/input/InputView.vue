<template>
  <div class="d-flex flex-column-reverse flex-lg-row wrapper">
    <v-dialog v-model="dialogError" max-width="390" style="z-index: 1000">
      <v-card>
        <v-card-title class="text-h5 red--text">Oops!</v-card-title>

        <v-card-text>
          <div class="mb-3">
            Something went wrong. Please try again later or send us the error
            message and we will help you.
          </div>
          <div v-if="errorMessage">
            <v-btn
              small
              outlined
              class="mb-2"
              @click="dialogErrorShowError = !dialogErrorShowError"
            >
              {{ dialogErrorShowError ? "Hide" : "Show" }} error message
            </v-btn>

            <div v-if="dialogErrorShowError">
              <v-textarea
                solo
                label="Error Message"
                style="font-size: 12px"
                :value="
                  typeof errorMessage === 'object'
                    ? JSON.stringify(errorMessage, null, 2)
                    : errorMessage
                "
              ></v-textarea>
            </div>
          </div>
        </v-card-text>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn color="darken-1" text @click="dialogError = false"> Ok </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <form
      class="d-flex flex-column p-3 form-column"
      style="flex: 1"
      v-on:submit="onSubmitForm"
    >
      <div class="d-flex w-100 mb-3">
        <div style="flex: 1"><h3>Create job</h3></div>
        <div>
          <v-btn to="/">Cancel</v-btn>
          &nbsp;
          <v-btn type="submit" color="primary">Start</v-btn>
        </div>
      </div>

      <div class="mt-2 mb-3">
        <v-text-field
          type="text"
          label="Name"
          filled
          v-model="formData.name"
          :error-messages="
            v$.formData.name.$error ? ['This field is required'] : []
          "
        />
      </div>

      <div class="mt-3 mb-2"><h6>Area of Interest (AOI)</h6></div>

      <v-row class="mb-3">
        <v-col class="d-flex align-items-center">
          <div
            v-if="aoiSize === 0"
            :class="{
              'me-3': true,
              'red--text': v$.formData.area_of_interest.$error,
            }"
            style="min-width: 120px"
          >
            Not selected...
          </div>
          <div v-if="aoiSize > 0" class="me-3" style="min-width: 120px">
            {{ (aoiSize / 1000 / 1000).toFixed(3) }} km<sup>2</sup>
          </div>
          <v-btn color="primary" v-on:click="drawItem">
            Select on map
            <v-icon right dark>mdi-vector-square</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <div class="mt-3 mb-2"><h6>Sentinel-2</h6></div>

      <v-row>
        <v-col cols="6">
          <v-text-field
            type="date"
            label="From"
            filled
            v-model="formData.start_timestamp"
            :min="minTimestamp"
            :max="maxTimestamp"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="date"
            label="To"
            filled
            v-model="formData.end_timestamp"
            :min="minTimestamp"
            :max="maxTimestamp"
          />
        </v-col>
      </v-row>

      <v-row class="mb-3">
        <v-col cols="6">
          <v-select
            filled
            :items="['10', '20', '60']"
            label="Resolution"
            v-model="formData.resolution"
            suffix="meter"
          ></v-select>
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="text"
            filled
            label="Cloud Cover"
            v-model="formData.cloud_cover"
            suffix="%"
            :error-messages="
              v$.formData.cloud_cover.$error
                ? ['Must be between 0 and 100']
                : []
            "
          />
        </v-col>
      </v-row>

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
            :error-messages="
              v$.samplesFile.$error ? ['This field is required'] : []
            "
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
            :error-messages="
              v$.formData.samples_class.$error ? ['This field is required'] : []
            "
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
    </form>
    <div class="d-flex align-stretch bg-light" style="flex: 1">
      <div id="map-container"></div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import { required, minValue, maxValue } from "@vuelidate/validators";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import subMonths from "date-fns/subMonths";
import format from "date-fns/format";
import * as API from "@/common/api";

export default {
  name: "InputView",
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      formData: {
        name: "",
        area_of_interest: null,
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
      // Error Dialog:
      dialogError: false,
      dialogErrorShowError: false,
      // Will be shown in the dialog
      errorMessage: "",
      // map:
      map: null,
      tileLayer: null,
      drawControl: null,
      rectangleLayer: null,
      drawnItem: null,
      // size in meters^2
      aoiSize: 0,
    };
  },
  validations() {
    return {
      formData: {
        name: { required },
        cloud_cover: {
          required,
          minValue: minValue(0),
          maxValue: maxValue(100),
        },
        samples_class: { required },
        area_of_interest: { required },
      },
      samplesFile: { required },
    };
  },
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

      const isFormCorrect = await this.v$.$validate();

      if (!isFormCorrect) {
        return;
      }

      // create job object for the api
      const job = {
        name: this.formData.name,
        area_of_interest: this.formData.area_of_interest,
        use_lookup: false,
        resolution: Number.parseInt(this.formData.resolution, 10) || 10,
        cloud_cover: Number.parseInt(this.formData.cloud_cover, 10) || 15,
        start_timestamp: `${this.formData.start_timestamp}T00:00:00.000Z`,
        end_timestamp: `${this.formData.end_timestamp}T00:00:00.000Z`,
        samples_class: this.formData.samples_class,
        sampling_strategy: "regular",
        use_pretrained_model: false,
      };

      try {
        await API.createJob({ samples: this.samplesFile, job });
        // Go to the job overview
        this.$router.push("/");
      } catch (err) {
        console.error(err);

        // Create an error message for the modal.
        if (err?.response?.data) {
          this.dialogError = true;
          this.errorMessage = {
            type: "createJob",
            timestamp: new Date(),
            ...err.response.data,
            body: job,
          };
        }
      }
    },
    /**
     * Enables to draw a Rectangle on Leaflet.
     */
    drawItem() {
      if (!this.map || !this.drawControl) {
        return;
      }
      new L.Draw.Rectangle(this.map).enable();
    },
  },
  mounted() {
    this.initMap();
    this.$nextTick(() => {
      this.rectangleLayer = new L.FeatureGroup().addTo(this.map);

      this.drawControl = new L.Control.Draw({
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
          remove: false,
          edit: false,
        },
      });

      this.map.addControl(this.drawControl);

      this.map.on(L.Draw.Event.CREATED, (e) => {
        if (this.drawnItem != null) {
          // In case a drawn item on the map already exists,
          // it gets removed and the aoi attribute gets overwritten.
          // The result is, that only one aoi can be entered
          this.rectangleLayer.removeLayer(this.drawnItem);
        }
        this.drawnItem = e.layer;

        // Get the first element
        const [rectangle] = this.drawnItem.getLatLngs();

        // Prepare coordinates for AOI GeoJSON
        const coordinates = [];
        for (let i = 0; i < 4; ++i) {
          coordinates[i] = [rectangle[i].lat, rectangle[i].lng];
        }

        // Set AOI:
        this.formData.area_of_interest = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates,
          },
          properties: {
            name: "AOI",
          },
        };

        // This variable contains the size of the entered aoi in m2.
        this.aoiSize = L.GeometryUtil.geodesicArea(rectangle);

        // Do whatever else you need to. (save to db, add to map etc)
        this.rectangleLayer.addLayer(this.drawnItem);
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
#map-container {
  width: 100%;
  height: 350px;
}
@media (min-width: 1264px) {
  .wrapper {
    flex: 1;
    min-height: 0;
  }
  .form-column {
    flex: 1;
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
  }
  #map-container {
    width: 100%;
    height: 100%;
  }
}
</style>
