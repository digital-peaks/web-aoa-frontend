<template>
  <div class="d-flex flex-column-reverse flex-lg-row wrapper">
    <form class="d-flex flex-column p-3 form-column" style="flex: 1">
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
            >The Area of Interest describes the area<br />
            the trained model should be tested on. A<br />
            rectangle has to be drawn in the given map.</span
          >
        </v-tooltip>
      </div>

      <v-row class="mb-3">
        <v-col class="d-flex align-items-center">
          <div class="me-3" style="min-width: 120px">48.338 km<sup>2</sup></div>
          <v-btn color="primary">
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
            readonly
            v-model="formData.start_timestamp"
          />
        </v-col>
        <v-col cols="6">
          <v-text-field
            type="date"
            label="To"
            filled
            readonly
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
              >In case no existing model should <br />
              be used, points or polygons to train <br />
              a model are required.</span
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
            >A sampling strategy to find suggested <br />
            points for additional measuring.</span
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
      // size in meters^2
      // aoiSize: 0,
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
        `${process.env.BASE_URL}demoData/demo_aoi.geojson`
      );
      const aoi = await responseAoi.json();
      this.rectangleLayer = L.geoJson(aoi);
      this.rectangleLayer.addTo(this.map);

      /*
      const bounds = this.rectangleLayer.getBounds();
      const rectangle = [
        new L.latLng(bounds._southWest.lat, bounds._northEast.lng),
        new L.latLng(bounds._northEast.lat, bounds._northEast.lng),
        new L.latLng(bounds._northEast.lat, bounds._southWest.lng),
        new L.latLng(bounds._southWest.lat, bounds._southWest.lng),
      ];
      // This variable contains the size of the entered aoi in m2.
      this.aoiSize = L.GeometryUtil.geodesicArea(rectangle);
      */
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
