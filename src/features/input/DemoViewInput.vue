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
        <div style="flex: 1"><span class="text-h5">Create job</span></div>
        <div>
          <v-btn to="/">Cancel</v-btn>
          &nbsp;
          <v-btn to="/outputDemo" type="submit" color="primary">Start</v-btn>
        </div>
      </div>

      <div class="mt-2 mb-3">
        <v-text-field type="text" label="Name" value="Demo" filled readonly />
      </div>

      <div class="mt-3 mb-2">
        <span class="text-h6">Area of Interest (AOI)</span>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
          </template>
          <span
            >The Area of Interest describes the area the trained model should
            <br />
            be tested on. A rectangle has to be drawn in the given map.</span
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
          </div>
          <v-btn color="primary" v-on:click="drawItem">
            Select on map
            <v-icon right dark>mdi-vector-square</v-icon>
          </v-btn>
        </v-col>
      </v-row>

      <!--
        Die Validation muss noch entfernt werden; 
        Die AOI Size muss ausgegeben werden sowie die AOI auf der Karte
        ausgegeben. 
        dann muss auf der Ausagebseite fortgefahren werden
      -->

      <div class="mt-3 mb-2">
        <span class="text-h6">Sentinel-2</span>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
          </template>
          <span class="max-width-20">
            A timeframe for Sentinel-2 data <br />that should be used can be
            edited.<br />
            As default value the past six month <br />will be used. Also a
            resolution<br />
            for the used imagery can be choosen <br />as well as the cloud
            coverage.
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
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="date"
            label="To"
            filled
            v-model="formData.end_timestamp"
          />
        </v-col>
      </v-row>

      <template v-if="formData.use_lookup === false">
        <v-row>
          <v-col cols="6">
            <v-select
              filled
              :items="['10', '20', '60']"
              label="Resolution"
              v-model="formData.resolution"
              suffix="meter"
              readonly
            ></v-select>
          </v-col>
          <v-col cols="6">
            <v-text-field
              type="text"
              filled
              label="Cloud Cover"
              v-model="formData.cloud_cover"
              suffix="%"
              readonly
            />
          </v-col>
        </v-row>
      </template>

      <v-row class="mb-1">
        <v-col cols="6">
          <v-switch
            v-model="formData.use_lookup"
            label="Use lookup table for optimal resolution"
            readonly
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
              >In case no existing model should be used, <br />
              points or polygons to train a model are required.</span
            >
          </v-tooltip>
        </div>

        <v-row>
          <v-col cols="6">
            <v-file-input
              filled
              label="Sample Polygons"
              accept=".json,.geojson,.gpkg"
              persistent-hint
              hint=".json,.geojson,.gpkg (max. 10 MB)"
              show-size
              truncate-length="25"
              v-model="samplesFile"
              disabled
            ></v-file-input>
          </v-col>
          <v-col cols="6">
            <v-text-field
              filled
              type="string"
              label="Class field"
              persistent-hint
              hint="Field which classifies the polygons"
              v-model="formData.samples_class"
              readonly
            />
          </v-col>
        </v-row>
      </template>

      <v-row class="mb-1">
        <v-col cols="6">
          <v-switch
            v-model="formData.use_pretrained_model"
            label="Use existing model"
          ></v-switch
        ></v-col>
      </v-row>

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
                {
                  algorithm: 'Support Vector Machines',
                  selectedML: 'svmradial',
                },
              ]"
              item-text="algorithm"
              item-value="selectedML"
              label="Algorithm"
              readonly
            ></v-select>
          </v-col>
        </v-row>

        <v-row class="mb-3">
          <v-col cols="4">
            <v-text-field
              filled
              type="string"
              label="Sigma"
              readonly
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
              readonly
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
              readonly
            ></v-select>
          </v-col>
        </v-row>
      </template>

      <div class="mt-3 mb-2">
        <span class="text-h6">Sampling Strategy</span>
        <v-tooltip right>
          <template v-slot:activator="{ on }">
            <v-icon class="pb-3" small v-on="on">mdi-help-circle</v-icon>
          </template>
          <span
            >A sampling strategy to find suggested points for additional
            measuring.</span
          >
        </v-tooltip>
      </div>

      <v-row class="mb-3">
        <v-col cols="12">
          <v-select
            filled
            :items="['regular']"
            label="N-Tree"
            v-model="formData.sampling_strategy"
            readonly
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
        start_timestamp: "2020-01-01",
        end_timestamp: "2020-12-01",
        samples_class: "class",
        sampling_strategy: "regular",
        use_pretrained_model: false,
        support_vector_machine: {
          sigma: 0.004385965,
          c: 1,
          cross_validation_folds: 15,
        },
      },
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
      rectangleLayer: null,
      drawnItem: null,
      // size in meters^2
      aoiSize: 0,
      selectedML: "svmradial",
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
     * This function initializes the leaflet map with an osm tile layer and focused on Münster.
     */
    initMap: async function () {
      this.map = L.map("map-container").setView([51.966, 7.633], 10);
      this.tileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }
      ).addTo(this.map);

      this.rectangleLayer = new L.FeatureGroup().addTo(this.map);

      this.drawControl = new L.Control.Draw({
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
          remove: false,
          edit: false,
        },
      });

      this.map.addControl(this.drawControl);

      const responseAoi = await fetch(
        `${process.env.BASE_URL}demoData/aoi.geojson`
      );
      const aoi = await responseAoi.json();
      this.rectangleLayer = L.geoJson(aoi);

      this.drawnItem = this.rectangleLayer;
      console.log(this.drawnItem); // DOESNST WORK TO GET LAT AND LONGS
      const [rectangle] = this.drawnItem.getLatLngs();

      // This variable contains the size of the entered aoi in m2.
      this.aoiSize = L.GeometryUtil.geodesicArea(rectangle);
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
