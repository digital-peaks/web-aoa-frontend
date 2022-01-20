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

      <span class="my-4">
        On this page you can create a job for the AOA (Area of Applicability)
        calculation. Multiple parameters are required and some are optional.<br />
        First of all, your have to name the job as want want it to be seen in
        the job-overview:
      </span>

      <div class="mt-2">
        <v-text-field type="text" label="Name" value="Demo" filled readonly />
      </div>

      <span class="my-3">
        Afterwards you have to choose your AOI (Area of Interest). Just press
        the button on the right <i>SELECT ON MAP</i> to start drawing of the
        map. You are allowed to draw only one rectangle to describe this area.
        But you can draw another one by pushing the small button on the left of
        the map:
      </span>

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

      <span class="my-3"
        >Here you can specify the timeframe, the resolution of the output images
        and the allowed cloud cover:</span
      >

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

      <span class="mt-3 ml-0"
        >In case you do not want to specify the resolution manually you can use
        the <i>use-lookup-table</i> option to select the resolution dynamically.
        In some cases the processing time can be reduced by choosing the
        resolution dynamically:</span
      >

      <v-row class="mb-1">
        <v-col cols="6">
          <v-switch
            v-model="formData.use_lookup"
            label="Use lookup table for optimal resolution"
            readonly
          ></v-switch
        ></v-col>
      </v-row>

      <span class="my-3"
        >In case no petrained model is provided, training datasets must be
        provided along with their <i>object id</i> - a unique attribute which
        stores an unique key for each dataset - and the attribute which contains
        the response values for the classification (<i>Class field</i>).
        Training datasets must be provided as .geojson or .gpkg. The filesize
        must not be greater that 10 MB:</span
      >

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

        <v-row>
          <v-col cols="6">
            <v-file-input
              filled
              label="Sample Polygons"
              accept=",.geojson,.gpkg"
              persistent-hint
              hint=".geojson,.gpkg (max. 10 MB)"
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

      <span class="my-4"
        >If training datasets are provided a machine learning procedure must be
        selected as well. One can choose the <i>Random Forrest</i> method or the
        <i>Support Vector Machine</i> method. Depending on the selected method
        multiple hyperparamters can be set:</span
      >

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
              hint="Describes the smoothness of the function to be minimized"
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
              hint="Describes the cost"
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

      <span class="my-4"
        >In case a pretrained model should be employed, it must be provided
        beforehand as a .rds file with a maximum size of 10 MB. Training
        datasets and a machine learning procedure are not required in this case.
        The given model should only use Sentinal-2A bands as its
        predictors:</span
      >

      <v-row class="mb-1">
        <v-col cols="6">
          <v-switch
            v-model="formData.use_pretrained_model"
            label="Use existing model"
            readonly
          ></v-switch
        ></v-col>
      </v-row>

      <span class="my-4"
        >Since the software provides the user with suggestions for additional
        locations of training datasets, a sampling method must be
        selected:</span
      >

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
          cross_validation_folds: 10,
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
            shapeOptions: {
              color: null,
            },
          },
          circle: false,
          marker: false,
          circlemarker: false,
        },
      });
      this.map.addControl(this.drawControl);

      const responseAoi = await fetch(
        `${process.env.BASE_URL}demoData/demo_aoi.geojson`
      );
      const aoi = await responseAoi.json();
      this.rectangleLayer = L.geoJson(aoi);
      this.rectangleLayer.addTo(this.map);
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
