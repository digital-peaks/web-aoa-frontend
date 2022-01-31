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
        <div style="flex: 1">
          <span class="text-h5">Create job</span>
        </div>
        <div>
          <v-btn to="/">Cancel</v-btn>
          &nbsp;
          <v-btn type="submit" color="primary">Start</v-btn>
        </div>
      </div>

      <v-row class="mb-1">
        <v-col>
          <v-switch
            v-model="colorblindMode"
            label="Switch to Color Blind Mode (Trichromacy)"
            v-on:change="switchMode"
          ></v-switch>
        </v-col>
      </v-row>

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

      <div class="mt-3 mb-2">
        <span class="text-h6">Area of Interest (AOI)</span>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="pb-3" small v-on="on"
              >mdi-help-circle</v-icon
            ></template
          >
          <span
            >The Area of Interest describes the area<br />
            the trained model should be tested on. A<br />
            rectangle has to be drawn in the given map.</span
          >
        </v-tooltip>
      </div>

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
            <div
              v-if="aoiSize / 1000 / 1000 > 400"
              class="me-3"
              style="min-width: 120px"
            >
              <span class="red--text">
                Area should be smaller than 400 km^2. <br />
                Otherwise Calculation can <br />
                take a very long time.
              </span>
            </div>
          </div>
          <v-btn color="primary" v-on:click="drawItem">
            Select on map
            <v-icon right dark>mdi-vector-square</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <div class="mt-3 mb-2">
        <span class="text-h6">Sentinel-2</span>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
          </template>
          <span>
            A timeframe for Sentinel-2 data that should <br />
            be used can be edited. As default value the<br />
            past six month will be used. Also a resolution<br />
            for the used imagery can be choosen as well as <br />
            the cloud coverage.
          </span>
        </v-tooltip>
      </div>

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

      <template v-if="formData.use_lookup === false">
        <v-row>
          <v-col cols="6">
            <v-select
              filled
              :items="['10', '20', '50', '100', '200', '400']"
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
      </template>
      <template v-if="formData.use_lookup === true">
        <v-row>
          <v-col cols="12">
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
      </template>

      <v-row class="mb-1">
        <v-col cols="6">
          <v-switch
            v-model="formData.use_lookup"
            label="Use lookup table for optimal resolution"
          ></v-switch
        ></v-col>
      </v-row>

      <template v-if="formData.use_pretrained_model === false">
        <div class="mt-3 mb-2">
          <span class="text-h6">Samples</span
          ><v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
            </template>
            <span
              >In case no existing model should <br />
              be used, polygons to train <br />
              a model are required.</span
            >
          </v-tooltip>
        </div>

        <div>
          <v-file-input
            class="pb-2"
            filled
            label="Sample Polygons"
            accept=".json,.geojson,.gpkg"
            persistent-hint
            hint=".json,.geojson,.gpkg (max. 10 MB, EPSG: 4326 required)"
            show-size
            truncate-length="25"
            v-model="samplesFile"
            v-on:change="checkCharactersInFileName"
            :error-messages="
              v$.samplesFile.$error ? ['This field is required'] : []
            "
          ></v-file-input>

          <template v-if="alertSamplePolygons == true">
            <v-alert dense outlined type="error">
              Please avoid umlauts and special characters
            </v-alert>
          </template>

          <v-text-field
            class="pb-2"
            filled
            type="string"
            label="Class field"
            persistent-hint
            hint="Field which classifies the polygons"
            v-model="formData.samples_class"
            :error-messages="
              v$.formData.samples_class.$error ? ['This field is required'] : []
            "
          />
          <v-text-field
            class="pb-2"
            filled
            type="string"
            label="Object ID "
            persistent-hint
            hint="Describes the attribute that represent the key of the sample polygons"
            v-model="formData.obj_id"
            :error-messages="
              v$.formData.obj_id.$error ? ['This field is required'] : []
            "
          />
        </div>
      </template>

      <template v-if="formData.use_pretrained_model === true">
        <div class="mt-3 mb-2">
          <span class="text-h6">Model</span
          ><v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
            </template>
            <span
              >Optional: A computional model <br />
              can be used to classify <br />
              Sentinel-2 imagery.</span
            >
          </v-tooltip>
        </div>

        <v-row>
          <v-col cols="6">
            <v-file-input
              filled
              label="Select model"
              accept=".rds"
              persistent-hint
              hint=".rds (max. 10 MB)"
              show-size
              truncate-length="25"
              v-model="modelFile"
              :error-messages="
                v$.modelFile.$error ? ['This field is required'] : []
              "
            ></v-file-input>
          </v-col>
        </v-row>
      </template>

      <template v-if="formData.use_pretrained_model === false">
        <div class="mt-3 mb-2">
          <span class="text-h6">Algorithm</span
          ><v-tooltip right>
            <template v-slot:activator="{ on }">
              <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
            </template>
            <span
              >An algorithm to train a<br />
              new model for prediction.</span
            >
          </v-tooltip>
        </div>

        <v-row>
          <v-col cols="12">
            <v-select
              filled
              v-model="selectedML"
              :items="[
                { algorithm: 'Random Forrest', selectedML: 'rf' },
                {
                  algorithm: 'Support Vector Machines',
                  selectedML: 'svmradial',
                },
              ]"
              item-text="algorithm"
              item-value="selectedML"
              label="Algorithm"
            ></v-select>
          </v-col>
        </v-row>

        <template v-if="selectedML === 'rf'">
          <v-row class="mb-3">
            <v-col cols="6">
              <v-select
                filled
                :items="[200, 500, 800]"
                label="N-Tree"
                hint="Describes the number of decision trees"
                persistent-hint
                v-model="formData.random_forrest.n_tree"
              ></v-select>
            </v-col>
            <v-col cols="6">
              <v-select
                filled
                :items="[1, 5, 10]"
                label="Cross validation folds"
                hint="Describes the number of cross validations"
                persistent-hint
                v-model="formData.random_forrest.cross_validation_folds"
              ></v-select>
            </v-col>
          </v-row>
        </template>

        <template v-if="selectedML === 'svmradial'">
          <v-row>
            <v-col cols="4">
              <v-text-field
                filled
                type="string"
                label="Sigma"
                :error-messages="
                  v$.formData.support_vector_machine.sigma.$error
                    ? ['Must be a decimal value']
                    : []
                "
                hint="This parameter describes sigma"
                persistent-hint
                v-model="formData.support_vector_machine.sigma"
              />
            </v-col>
            <v-col cols="4">
              <v-text-field
                filled
                type="string"
                label="C"
                :error-messages="
                  v$.formData.support_vector_machine.c.$error
                    ? ['Must be a decimal or an integer value']
                    : []
                "
                hint="This parameter describes C"
                persistent-hint
                v-model="formData.support_vector_machine.c"
              />
            </v-col>
            <v-col cols="4">
              <v-select
                filled
                :items="[1, 5, 10]"
                label="Cross validation folds"
                v-model="formData.support_vector_machine.cross_validation_folds"
              ></v-select>
            </v-col>
          </v-row>
        </template>
      </template>

      <v-row class="mb-1 mt-0">
        <v-col cols="6">
          <v-switch
            v-model="formData.use_pretrained_model"
            label="Use existing model"
          ></v-switch
        ></v-col>
      </v-row>

      <div class="mt-3 mb-2">
        <span class="text-h6">Sampling Strategy</span>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
          </template>
          <span
            >A sampling strategy to be employed<br />
            to find locations, where additional <br />
            training datsets might be useful.</span
          >
        </v-tooltip>
      </div>

      <v-row class="mb-3">
        <v-col cols="12">
          <v-select
            filled
            :items="[
              'regular',
              'stratified',
              'random',
              'nonaligned',
              'hexagonal',
              'clustered',
              'Fibonacci',
            ]"
            label="N-Tree"
            v-model="formData.sampling_strategy"
          ></v-select>
        </v-col>
      </v-row>
    </form>
    <div class="d-flex align-stretch bg-light" style="flex: 1">
      <div id="map-container"></div>
    </div>
  </div>
</template>

<script>
import useVuelidate from "@vuelidate/core";
import {
  integer,
  or,
  decimal,
  required,
  minValue,
  maxValue,
  requiredIf,
} from "@vuelidate/validators";
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
        use_lookup: false,
        resolution: "10",
        cloud_cover: "15",
        start_timestamp: format(subMonths(new Date(), 6), "yyyy-MM-dd"),
        end_timestamp: format(new Date(), "yyyy-MM-dd"),
        samples_class: "class",
        sampling_strategy: "regular",
        use_pretrained_model: false,
        obj_id: "PID",
        random_forrest: {
          n_tree: 800,
          cross_validation_folds: 5,
        },
        support_vector_machine: {
          sigma: 0.004385965,
          c: 1,
          cross_validation_folds: 5,
        },
      },
      // Sentinel-2B start:
      minTimestamp: format(new Date("2017-03-09T00:00:00.000Z"), "yyyy-MM-dd"),
      maxTimestamp: format(new Date(), "yyyy-MM-dd"),
      // file previews:
      samplesFile: null,
      modelFile: null,
      // Error Dialog:
      dialogError: false,
      dialogErrorShowError: false,
      // Will be shown in the dialog
      errorMessage: "",
      // map:
      map: null,
      tileLayer: null,
      drawControl: null,
      drawControlColorblind: null,
      rectangleLayer: null,
      drawnItem: null,
      // size in meters^2
      aoiSize: 0,
      selectedML: "rf",
      // Colorblind mode
      colorblindMode: false,
      alertSamplePolygons: false,
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
        samples_class: {
          required: requiredIf(() => !this.formData.use_pretrained_model),
        },
        area_of_interest: { required },
        use_pretrained_model: { required },
        sampling_strategy: { required },
        resolution: requiredIf(() => !this.formData.use_lookup),
        obj_id: { required },
        support_vector_machine: {
          sigma: {
            decimal,
            minValue: minValue(0),
          },
          c: {
            valid: or(integer, decimal),
            minValue: minValue(0),
          },
        },
      },
      samplesFile: {
        required: requiredIf(() => !this.formData.use_pretrained_model),
      },
      modelFile: {
        required: requiredIf(() => this.formData.use_pretrained_model),
      },
    };
  },
  methods: {
    /**
     * This function switches the frontend to a colorblind version. The basemap changes as well as the aoi rectangle.
     */
    switchMode: function () {
      if (this.colorblindMode === false) {
        this.tileLayer = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(this.map);

        this.map.removeControl(this.drawControlColorblind);

        this.map.addControl(this.drawControl);

        if (this.rectangleLayer != null) {
          this.rectangleLayer.setStyle({
            color: "#3388ff",
          });
        }
      } else if (this.colorblindMode === true) {
        this.tileLayer = L.tileLayer(
          "https://tile.jawg.io/e05fd39a-c48d-4fe7-865e-75b940afcb34/{z}/{x}/{y}{r}.png?access-token=f8JszPWTpbAxBEKElUVA7DJcC7Rrzg8hm36s98r2dV7SFWWvoP6v0E9BTxGttjZZ",
          {
            attribution:
              '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors',
          }
        ).addTo(this.map);

        this.map.removeControl(this.drawControl);

        this.map.addControl(this.drawControlColorblind);

        if (this.rectangleLayer != null) {
          this.rectangleLayer.setStyle({
            color: "#FF4452",
          });
        }
      }
    },
    /**
     * This function initializes the leaflet map with an osm tile layer and focused on Münster.
     */
    initMap: function () {
      this.map = L.map("map-container", { layers: this.tileLayer }).setView(
        [51.966, 7.633],
        10
      );

      this.tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(this.map);

      this.rectangleLayer = new L.FeatureGroup().addTo(this.map);

      // Initialization of draw control for colorblind mode
      this.drawControlColorblind = new L.Control.Draw({
        position: "topleft",
        draw: {
          polyline: false,
          polygon: false,
          rectangle: {
            showArea: true,
            metric: ["km"],
            shapeOptions: {
              color: "#FF4452",
            },
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

      this.drawControl = new L.Control.Draw({
        position: "topleft",
        draw: {
          polyline: false,
          polygon: false,
          rectangle: {
            showArea: false,
            metric: "km",
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
          coordinates[i] = [rectangle[i].lng, rectangle[i].lat];
        }
        // For GeoJSON Polygon the first and the last must be the same:
        coordinates[4] = coordinates[0];

        // Set AOI:
        this.formData.area_of_interest = {
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [coordinates],
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
    },
    /**
     * This function checks whether the uploaded samplePolygons file got a valid name.
     */
    checkCharactersInFileName: function () {
      let fileName = this.samplesFile.name;
      let patterns = [
        "ä",
        "ö",
        "ü",
        "_",
        "-",
        "ß",
        ":",
        ";",
        ",",
        "~",
        "§",
        "$",
        "!",
        "?",
        "*",
        "+",
        "^",
        "°",
        "@",
        "€",
        "[",
        "]",
        "{",
        "(",
        ")",
        "}",
        "%",
      ];

      for (let i = 0; i < patterns.length; i++) {
        if (fileName.includes(patterns[i])) this.alertSamplePolygons = true;
      }
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

      let job = {
        name: this.formData.name,
        area_of_interest: this.formData.area_of_interest,
        use_lookup: this.formData.use_lookup,
        cloud_cover: Number.parseInt(this.formData.cloud_cover, 10) || 15,
        start_timestamp: `${this.formData.start_timestamp}T00:00:00.000Z`,
        end_timestamp: `${this.formData.end_timestamp}T00:00:00.000Z`,
        samples_class: this.formData.samples_class,
        sampling_strategy: this.formData.sampling_strategy,
        use_pretrained_model: this.formData.use_pretrained_model,
        obj_id: this.formData.obj_id,
      };

      // create job object for the api
      if (this.selectedML == "rf" && !this.formData.use_pretrained_model) {
        job.random_forrest = {
          n_tree: this.formData.random_forrest.n_tree,
          cross_validation_folds:
            this.formData.random_forrest.cross_validation_folds,
        };
      } else if (
        this.selectedML == "svmradial" &&
        !this.formData.use_pretrained_model
      ) {
        job.support_vector_machine = {
          sigma: this.formData.support_vector_machine.sigma,
          c: this.formData.support_vector_machine.c,
          cross_validation_folds:
            this.formData.support_vector_machine.cross_validation_folds,
        };
      }

      if (!this.formData.use_lookup) {
        job.resolution = Number.parseInt(this.formData.resolution, 10) || 10;
      } else {
        job.resolution = 10; // default value
      }

      const data = { job };

      if (job.use_pretrained_model) {
        // Set model file
        data.model = this.modelFile;
        data.job.samples_class = "";
      } else {
        // Set samples file
        data.samples = this.samplesFile;
      }

      try {
        await API.createJob(data);
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
      if (this.colorblindMode == false) {
        new L.Draw.Rectangle(this.map).enable();
      } else if (this.colorblindMode == true) {
        new L.Draw.Rectangle(this.map, {
          shapeOptions: { color: "#FF4452" },
        }).enable();
      }
    },
  },
  mounted() {
    this.initMap();
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
