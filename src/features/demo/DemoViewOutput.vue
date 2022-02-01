<template>
  <div class="d-flex flex-column flex-lg-row wrapper" style="flex: 1">
    <div class="flex-column layer-column">
      <div id="job_number" class="m-3 mb-2 text-h5">
        Demo

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn
              class="float-right"
              outlined
              v-on="on"
              style="padding-left: 10px; padding-right: 7px"
              v-on:click="
                downloadItem('demoData/output.log', 'output.log', 'text/html')
              "
            >
              Protocol
              <v-icon>mdi-download</v-icon>
            </v-btn>
          </template>
          <span>
            Here you can download <br />
            a log file, written <br />
            by the R-code while <br />
            the calculations are <br />
            running.
          </span>
        </v-tooltip>
      </div>

      <div class="pt-6 pl-4">
        <span>
          This switch provides the user a colorblind-friendly version of our
          website. It is specialized for the tpye of colorblindness, that is the
          most common world-wide. Affected people are not able or have
          difficulties to differentiate between red and green.
        </span>
      </div>

      <v-row class="ml-1">
        <v-col cols="12">
          <v-switch
            v-model="colorblindMode"
            label="Switch to Color Blind Mode (Trichromacy)"
            v-on:change="switchMode"
          ></v-switch
        ></v-col>
      </v-row>

      <hide-at
        :breakpoints="{ small: 1263, medium: 1264 }"
        breakpoint="smallAndBelow"
      >
        <div>
          <div class="m-3 pt-4">
            <span
              >The <i>Area of Interest</i> is the area for which the
              classification and the Area of Applicability are calculated:</span
            >
          </div>
          <v-simple-table class="mb-6">
            <tbody>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Area of Interest (AOI)
                  <vue-slider
                    v-model="aoiTransparency"
                    v-on:change="changeOpacity('aoi')"
                    :minRange="0"
                    :maxRange="10"
                  />
                  <p style="font-size: 10px">Transparency</p>
                  <vue-slider
                    v-model="aoiLineThickness"
                    v-on:change="changeLineThickness('aoi')"
                    :data="[0, 1, 2, 3, 4, 5]"
                    :marks="true"
                    :hide-label="true"
                  />
                  <p style="font-size: 10px">Line thickness</p>
                </td>
                <td class="check justify-center align-start">
                  <div class="d-flex align-items-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-simple-checkbox
                          id="aoi"
                          v-on:click="switchLayer('aoi')"
                          color="primary"
                          v-on="on"
                          v-bind="attrs"
                          v-model="aoiCheckbox"
                          v-ripple
                        ></v-simple-checkbox>
                      </template>
                      <span>Show/Hide</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="zoomToLayer('aoi')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Zoom to layer</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="
                            downloadItem(
                              'demoData/demo_aoi.geojson',
                              'suggestion',
                              'application/json'
                            )
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
          <div class="m-3">
            <span class="my-4"
              >The <i>Dissimilarity Index</i> can be understood as a measure for
              the similarity between the surveyed area and the area from which
              the training datsets are extracted. The values range from 0 to 1
              and the closer the value is to 0, the greater the
              similarity:</span
            >
          </div>
          <v-simple-table>
            <tbody>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Dissimilarity Index
                  <vue-slider
                    v-model="diTransparency"
                    v-on:change="changeOpacity('di')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>

                  <template v-if="colorblindMode == false">
                    <ColorLegend scale="Viridis" :steps="6" :fixed="1" />
                  </template>
                  <template v-if="colorblindMode == true">
                    <ColorLegend
                      :scale="[
                        '#ffff00',
                        '#ffaf00',
                        '#ff5634',
                        '#e9005d',
                        '#9a0079',
                        '#000080',
                      ]"
                      :steps="6"
                      :fixed="1"
                    />
                  </template>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-simple-checkbox
                          id="di"
                          v-on:click="switchLayer('di')"
                          color="primary"
                          v-on="on"
                          v-bind="attrs"
                          v-model="diCheckbox"
                          v-ripple
                        ></v-simple-checkbox>
                      </template>
                      <span>Show/Hide</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="zoomToLayer('di')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Zoom to layer</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="
                            downloadItem(
                              'demoData/aoa_di.tif',
                              'aoa_di',
                              'image/tiff'
                            )
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider> </v-divider>
          <div class="m-3">
            <span
              >The <i>Prediction</i> is the actual result of the
              land-use/land-cover classification and is in essence a
              segmentation of the Sentinel-2A image into the classes, provided
              in the training datasets or the pretrained model:</span
            >
          </div>
          <v-simple-table>
            <tbody>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Prediction / Classification
                  <vue-slider
                    v-model="predTransparency"
                    v-on:change="changeOpacity('pred')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>

                  <div class="d-flex flex-column">
                    <template v-if="colorblindMode == false">
                      <div
                        v-for="(value, index) in predClassificationColors"
                        :key="value"
                        class="d-flex align-items-center mb-1"
                      >
                        <div
                          :style="{
                            width: '20px',
                            height: '20px',
                            backgroundColor: value,
                            boxShadow: '0 0 1px #333',
                          }"
                        ></div>
                        <div class="ml-3">{{ resultJson[0][index] }}</div>
                      </div>
                    </template>
                    <template v-if="colorblindMode == true">
                      <div
                        v-for="(value, index) in colorblindScalePred"
                        :key="value"
                        class="d-flex align-items-center mb-1"
                      >
                        <div
                          :style="{
                            width: '20px',
                            height: '20px',
                            backgroundColor: value,
                            boxShadow: '0 0 1px #333',
                          }"
                        ></div>
                        <div class="ml-3">{{ resultJson[0][index] }}</div>
                      </div>
                    </template>
                  </div>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-simple-checkbox
                          id="pred"
                          v-on:click="switchLayer('pred')"
                          color="primary"
                          v-on="on"
                          v-bind="attrs"
                          v-model="predCheckbox"
                          v-ripple
                        ></v-simple-checkbox>
                      </template>
                      <span>Show/Hide</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="zoomToLayer('pred')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Zoom to layer</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="
                            downloadItem(
                              'demoData/pred.tif',
                              'pred',
                              'image/tiff'
                            )
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider> </v-divider>
          <div class="m-3">
            <span
              >The <i>Area of Applicability</i> describes the areas in which the
              trained model performed inside acceptable margins of error (pixel
              value 1). In areas, which are outside the Area of Applicability,
              the trained model did not perform as expected, thus the results
              there are not reliable (pixel value 0):</span
            >
          </div>
          <v-simple-table>
            <tbody>
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Area of Applicability (AOA)
                  <vue-slider
                    v-model="aoaTransparency"
                    v-on:change="changeOpacity('aoa')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>

                  <template v-if="colorblindMode == false">
                    <ColorLegend
                      :scale="['#cf1f8f', '#ffffff']"
                      :steps="2"
                      :fixed="0"
                    />
                  </template>
                  <template v-if="colorblindMode == true">
                    <ColorLegend
                      :scale="['#21A7E6', '#ffffff']"
                      :steps="2"
                      :fixed="0"
                    />
                  </template>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-simple-checkbox
                          id="aoa"
                          v-on:click="switchLayer('aoa')"
                          color="primary"
                          v-on="on"
                          v-bind="attrs"
                          v-model="aoaCheckbox"
                          v-ripple
                        ></v-simple-checkbox>
                      </template>
                      <span>Show/Hide</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="zoomToLayer('aoa')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Zoom to layer</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="
                            downloadItem(
                              'demoData/aoa_aoa.tif',
                              'aoa_aoa',
                              'image/tiff'
                            )
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
          <div class="m-3">
            <span
              >In case no pretrained model was provided, the
              <i>training datasets</i> are shown here:</span
            >
          </div>
          <v-simple-table>
            <tbody>
              <tr id="last_td">
                <td id="td_elements_with_slider">
                  Sample Polygons
                  <vue-slider
                    v-model="samplePolygonsTransparency"
                    v-on:change="changeOpacity('samplePolygons')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>
                  <vue-slider
                    v-model="samplePolygonsLineThickness"
                    v-on:change="changeLineThickness('samplePolygons')"
                    :data="[0, 1, 2, 3, 4, 5]"
                    :marks="true"
                    :hide-label="true"
                  />
                  <p style="font-size: 10px">Line thickness</p>
                </td>
                <td>
                  <div class="d-flex align-items-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-simple-checkbox
                          id="samplePolygons"
                          v-on:click="switchLayer('samplePolygons')"
                          color="primary"
                          v-on="on"
                          v-bind="attrs"
                          v-model="samplePolygonsCheckbox"
                          v-ripple
                        ></v-simple-checkbox>
                      </template>
                      <span>Show/Hide</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="zoomToLayer('samplePolygons')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Zoom to layer</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="
                            downloadItem(
                              'demoData/demoSamples.geojson',
                              'samplePolygons',
                              'application/json'
                            )
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
          <div class="m-3">
            <span
              >The software suggests
              <i>locations for additional training</i> polygons. They are
              located in areas, where the model is not applicable and are shown
              here:</span
            >
          </div>
          <v-simple-table>
            <tbody>
              <tr id="not_last_td">
                <td>Suggested locations for training polygons</td>
                <td>
                  <div class="d-flex align-items-center">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-simple-checkbox
                          id="suggestion"
                          v-on:click="switchLayer('suggestion')"
                          color="primary"
                          v-on="on"
                          v-bind="attrs"
                          v-model="suggestionCheckbox"
                          v-ripple
                        ></v-simple-checkbox>
                      </template>
                      <span>Show/Hide</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="zoomToLayer('suggestion')"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-magnify</v-icon>
                        </v-btn>
                      </template>
                      <span>Zoom to layer</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          class="ms-2"
                          icon
                          v-on:click="
                            downloadItem(
                              'demoData/suggestion.geojson',
                              'suggestion',
                              'application/json'
                            )
                          "
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-download</v-icon>
                        </v-btn>
                      </template>
                      <span>Download</span>
                    </v-tooltip>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-simple-table>
          <v-divider></v-divider>
          <div class="m-3">
            <span
              >Trained models can be described by various parameters. To
              evaluate the model the <i>accuracy</i> and the
              <i>kappa index</i> can be used. The trained model and the
              parameters of the job can be downloaded here as well:</span
            >
          </div>
          <v-expansion-panels flat accordion class="pb-7">
            <v-expansion-panel>
              <v-expansion-panel-header class="pl-4" style="font-size: 14px"
                >Details</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <div class="mb-1" style="font-size: 14px">
                  Accuracy: {{ accuracy }}
                </div>
                <div class="mb-1" style="font-size: 14px">
                  Kappa Index: {{ kappaIndex }}
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      dark
                      class="float-left mt-3 mr-2 mb-2"
                      style="padding-left: 10px; padding-right: 7px"
                      v-on:click="
                        downloadItem(
                          'demoData/model.rds',
                          'model.rds',
                          'application/octet-stream'
                        )
                      "
                    >
                      Model
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Download the trained model</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      dark
                      class="float-left mt-3 mb-2"
                      style="padding-left: 10px; padding-right: 7px"
                      v-on:click="
                        downloadItem(
                          'demoData/job_param.json',
                          'job_param.json',
                          'application/json'
                        )
                      "
                    >
                      Job parameters
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Download the job parameters</span>
                </v-tooltip>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </hide-at>

      <hide-at
        :breakpoints="{ small: 1263, medium: 1264 }"
        breakpoint="mediumAndAbove"
      >
        <div>
          <v-simple-table class="mb-6">
            <template v-slot:default>
              <tbody>
                <tr id="not_last_td">
                  <td id="td_elements_with_slider">
                    <div class="my-4">
                      The <i>Area of Interest</i> is the area for which the
                      classification and the Area of Applicability are
                      calculated:
                    </div>
                    Area of Interest (AOI)
                    <vue-slider
                      v-model="aoiTransparency"
                      v-on:change="changeOpacity('aoi')"
                      :minRange="0"
                      :maxRange="10"
                    />
                    <p style="font-size: 10px">Transparency</p>
                    <vue-slider
                      v-model="aoiLineThickness"
                      v-on:change="changeLineThickness('aoi')"
                      :data="[0, 1, 2, 3, 4, 5]"
                      :marks="true"
                      :hide-label="true"
                    />
                    <p style="font-size: 10px">Line thickness</p>
                  </td>
                  <td class="check justify-center align-start">
                    <div class="d-flex align-items-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-simple-checkbox
                            id="aoi"
                            v-on:click="switchLayer('aoi')"
                            color="primary"
                            v-on="on"
                            v-bind="attrs"
                            v-model="aoiCheckbox"
                            v-ripple
                          ></v-simple-checkbox>
                        </template>
                        <span>Show/Hide</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="zoomToLayer('aoi')"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </template>
                        <span>Zoom to layer</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="
                              downloadItem(
                                'demoData/demo_aoi.geojson',
                                'suggestion',
                                'application/json'
                              )
                            "
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>

                <tr id="not_last_td">
                  <td id="td_elements_with_slider">
                    <div class="my-4">
                      The <i>Dissimilarity Index</i> can be understood as a
                      measure for the similarity between the surveyed area and
                      the area from which the training datsets are extracted.
                      The values range from 0 to 1 and the closer the value is
                      to 0, the greater the similarity:
                    </div>
                    Dissimilarity Index
                    <vue-slider
                      v-model="diTransparency"
                      v-on:change="changeOpacity('di')"
                      :tooltip-formatter="sliderPercentage"
                    />
                    <p style="font-size: 10px">Transparency</p>

                    <template v-if="colorblindMode == false">
                      <ColorLegend scale="Viridis" :steps="6" :fixed="1" />
                    </template>
                    <template v-if="colorblindMode == true">
                      <ColorLegend
                        :scale="[
                          '#ffff00',
                          '#ffaf00',
                          '#ff5634',
                          '#e9005d',
                          '#9a0079',
                          '#000080',
                        ]"
                        :steps="6"
                        :fixed="1"
                      />
                    </template>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-simple-checkbox
                            id="di"
                            v-on:click="switchLayer('di')"
                            color="primary"
                            v-on="on"
                            v-bind="attrs"
                            v-model="diCheckbox"
                            v-ripple
                          ></v-simple-checkbox>
                        </template>
                        <span>Show/Hide</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="zoomToLayer('di')"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </template>
                        <span>Zoom to layer</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="
                              downloadItem(
                                'demoData/aoa_di.tif',
                                'aoa_di',
                                'image/tiff'
                              )
                            "
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>

                <tr id="not_last_td">
                  <td id="td_elements_with_slider">
                    <div class="my-4">
                      The <i>Dissimilarity Index</i> can be understood as a
                      measure for the similarity between the surveyed area and
                      the area from which the training datsets are extracted.
                      The values range from 0 to 1 and the closer the value is
                      to 0, the greater the similarity:
                    </div>
                    Prediction / Classification
                    <vue-slider
                      v-model="predTransparency"
                      v-on:change="changeOpacity('pred')"
                      :tooltip-formatter="sliderPercentage"
                    />
                    <p style="font-size: 10px">Transparency</p>

                    <div class="d-flex flex-column">
                      <template v-if="colorblindMode == false">
                        <div
                          v-for="(value, index) in predClassificationColors"
                          :key="value"
                          class="d-flex align-items-center mb-1"
                        >
                          <div
                            :style="{
                              width: '20px',
                              height: '20px',
                              backgroundColor: value,
                              boxShadow: '0 0 1px #333',
                            }"
                          ></div>
                          <div class="ml-3">{{ resultJson[0][index] }}</div>
                        </div>
                      </template>
                      <template v-if="colorblindMode == true">
                        <div
                          v-for="(value, index) in colorblindScalePred"
                          :key="value"
                          class="d-flex align-items-center mb-1"
                        >
                          <div
                            :style="{
                              width: '20px',
                              height: '20px',
                              backgroundColor: value,
                              boxShadow: '0 0 1px #333',
                            }"
                          ></div>
                          <div class="ml-3">{{ resultJson[0][index] }}</div>
                        </div>
                      </template>
                    </div>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-simple-checkbox
                            id="pred"
                            v-on:click="switchLayer('pred')"
                            color="primary"
                            v-on="on"
                            v-bind="attrs"
                            v-model="predCheckbox"
                            v-ripple
                          ></v-simple-checkbox>
                        </template>
                        <span>Show/Hide</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="zoomToLayer('pred')"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </template>
                        <span>Zoom to layer</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="
                              downloadItem(
                                'demoData/pred.tif',
                                'pred',
                                'image/tiff'
                              )
                            "
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>

                <tr id="not_last_td">
                  <td id="td_elements_with_slider">
                    <div class="my-4">
                      The <i>Area of Applicability</i> describes the areas in
                      which the trained model performed inside acceptable
                      margins of error (pixel value 1). In areas, which are
                      outside the Area of Applicability, the trained model did
                      not perform as expected, thus the results there are not
                      reliable (pixel value 0):
                    </div>
                    Area of Applicability (AOA)
                    <vue-slider
                      v-model="aoaTransparency"
                      v-on:change="changeOpacity('aoa')"
                      :tooltip-formatter="sliderPercentage"
                    />
                    <p style="font-size: 10px">Transparency</p>

                    <template v-if="colorblindMode == false">
                      <ColorLegend
                        :scale="['#cf1f8f', '#ffffff']"
                        :steps="2"
                        :fixed="0"
                      />
                    </template>
                    <template v-if="colorblindMode == true">
                      <ColorLegend
                        :scale="['#21A7E6', '#ffffff']"
                        :steps="2"
                        :fixed="0"
                      />
                    </template>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-simple-checkbox
                            id="aoa"
                            v-on:click="switchLayer('aoa')"
                            color="primary"
                            v-on="on"
                            v-bind="attrs"
                            v-model="aoaCheckbox"
                            v-ripple
                          ></v-simple-checkbox>
                        </template>
                        <span>Show/Hide</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="zoomToLayer('aoa')"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </template>
                        <span>Zoom to layer</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="
                              downloadItem(
                                'demoData/aoa_aoa.tif',
                                'aoa_aoa',
                                'image/tiff'
                              )
                            "
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>

                <tr id="last_td">
                  <td id="td_elements_with_slider">
                    <div class="my-4">
                      In case no pretrained model was provided, the
                      <i>training datasets</i> are shown here:
                    </div>
                    Sample Polygons
                    <vue-slider
                      v-model="samplePolygonsTransparency"
                      v-on:change="changeOpacity('samplePolygons')"
                      :tooltip-formatter="sliderPercentage"
                    />
                    <p style="font-size: 10px">Transparency</p>
                    <vue-slider
                      v-model="samplePolygonsLineThickness"
                      v-on:change="changeLineThickness('samplePolygons')"
                      :data="[0, 1, 2, 3, 4, 5]"
                      :marks="true"
                      :hide-label="true"
                    />
                    <p style="font-size: 10px">Line thickness</p>
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-simple-checkbox
                            id="samplePolygons"
                            v-on:click="switchLayer('samplePolygons')"
                            color="primary"
                            v-on="on"
                            v-bind="attrs"
                            v-model="samplePolygonsCheckbox"
                            v-ripple
                          ></v-simple-checkbox>
                        </template>
                        <span>Show/Hide</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="zoomToLayer('samplePolygons')"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </template>
                        <span>Zoom to layer</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="
                              downloadItem(
                                'demoData/demoSamples.geojson',
                                'samplePolygons',
                                'application/json'
                              )
                            "
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>

                <tr id="not_last_td">
                  <td>
                    <div class="my-4">
                      The software suggests
                      <i>locations for additional training</i> polygons. They
                      are located in areas, where the model is not applicable
                      and are shown here:
                    </div>
                    Suggested locations for training polygons
                  </td>
                  <td>
                    <div class="d-flex align-items-center">
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-simple-checkbox
                            id="suggestion"
                            v-on:click="switchLayer('suggestion')"
                            color="primary"
                            v-on="on"
                            v-bind="attrs"
                            v-model="suggestionCheckbox"
                            v-ripple
                          ></v-simple-checkbox>
                        </template>
                        <span>Show/Hide</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="zoomToLayer('suggestion')"
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-magnify</v-icon>
                          </v-btn>
                        </template>
                        <span>Zoom to layer</span>
                      </v-tooltip>
                      <v-tooltip bottom>
                        <template v-slot:activator="{ on, attrs }">
                          <v-btn
                            class="ms-2"
                            icon
                            v-on:click="
                              downloadItem(
                                'demoData/suggestion.geojson',
                                'suggestion',
                                'application/json'
                              )
                            "
                            v-bind="attrs"
                            v-on="on"
                          >
                            <v-icon>mdi-download</v-icon>
                          </v-btn>
                        </template>
                        <span>Download</span>
                      </v-tooltip>
                    </div>
                  </td>
                </tr>
              </tbody></template
            >
          </v-simple-table>
          <v-divider light class="m-0"> </v-divider>
          <div class="m-3" style="font-size: 14px">
            Trained models can be described by various parameters. To evaluate
            the model the <i>accuracy</i> and the <i>kappa index</i> can be
            used. The trained model and the parameters of the job can be
            downloaded here as well:
          </div>
          <v-expansion-panels flat accordion class="pb-7">
            <v-expansion-panel>
              <v-expansion-panel-header class="pl-4" style="font-size: 14px"
                >Details</v-expansion-panel-header
              >
              <v-expansion-panel-content>
                <div class="mb-1" style="font-size: 14px">
                  Accuracy: {{ accuracy }}
                </div>
                <div class="mb-1" style="font-size: 14px">
                  Kappa Index: {{ kappaIndex }}
                </div>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      dark
                      class="float-left mt-3 mr-2 mb-2"
                      style="padding-left: 10px; padding-right: 7px"
                      v-on:click="
                        downloadItem(
                          'demoData/model.rds',
                          'model.rds',
                          'application/octet-stream'
                        )
                      "
                    >
                      Model
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Download the trained model</span>
                </v-tooltip>
                <v-tooltip bottom>
                  <template v-slot:activator="{ on }">
                    <v-btn
                      v-on="on"
                      dark
                      class="float-left mt-3 mb-2"
                      style="padding-left: 10px; padding-right: 7px"
                      v-on:click="
                        downloadItem(
                          'demoData/job_param.json',
                          'job_param.json',
                          'application/json'
                        )
                      "
                    >
                      Job parameters
                      <v-icon>mdi-download</v-icon>
                    </v-btn>
                  </template>
                  <span>Download the job parameters</span>
                </v-tooltip>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>
        </div>
      </hide-at>
    </div>

    <div class="d-flex align-stretch bg-light" style="flex: 1">
      <div id="map-container"></div>
    </div>
  </div>
</template>

<script>
// Import that are required for the following functionalities
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";

import ColorLegend from "@/components/ColorLegend";

import { mapState } from "vuex";
import axios from "axios";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

import chroma from "chroma-js";

import markerPng from "@/assets/markerIconRedCrossWithBlackEvenThicker.png";

import { hideAt } from "vue-breakpoints";

export default {
  name: "Output",
  computed: mapState({
    jobId() {
      // Getting job based on the router parameter (see vue-router):
      const { jobId = "" } = this.$route.params;
      return jobId;
    },
    job(state) {
      return state.jobs[this.jobId] || {};
    },
  }),
  data: () => ({
    map: null,
    tileLayer: null,
    earthLayer: null,
    colorblindLayer: null,
    // Everything needed to visualize the aoi.geojson.
    aoiCheckbox: false,
    aoiJson: `${process.env.BASE_URL}demoData/demo_aoi.geojson`,
    aoiLayer: null,
    aoiTransparency: 50,
    aoiLineThickness: 1,
    // Everything needed to visualize the aoi_di.tif.
    diCheckbox: false,
    diUrl: `${process.env.BASE_URL}demoData/aoa_di.tif`,
    diLayer: null,
    diLayerColorblind: null,
    diTransparency: 100,
    // Everything needed to visualize the pred.tif.
    predCheckbox: false,
    predUrl: `${process.env.BASE_URL}demoData/pred.tif`,
    predLayer: null,
    predLayerColorblind: null,
    predTransparency: 100,
    // Generated by chromajs, e.g.: ['#9e0142', '#f98e52', ...]
    predClassificationColors: [],
    colorblindScalePred: [],
    // Everything needed to visualize the aoi_aoa.tif.
    aoaCheckbox: false,
    aoaUrl: `${process.env.BASE_URL}demoData/aoa_aoa.tif`,
    aoaLayer: null,
    aoaLayerColorblind: null,
    aoaTransparency: 100,
    // Everything needed to visualize the samplePolygons.geojson.
    samplePolygonsCheckbox: false,
    samplePolygonsJson: `${process.env.BASE_URL}demoData/demoSamples.geojson`,
    samplePolygonsLayer: null,
    samplePolygonsTransparency: 50,
    samplePolygonsLineThickness: 1,
    // Everything needed to visualize the suggestion.geojson.
    suggestionCheckbox: false,
    suggestionJson: `${process.env.BASE_URL}demoData/suggestion.geojson`,
    suggestionLayer: null,
    // Causes the percentage scale of the slider component.
    sliderPercentage: "{value} %",
    resultJsonUrl: `${process.env.BASE_URL}demoData/result.json`,
    resultJson: null,
    kappaIndex: null,
    accuracy: null,
    outputLogUrl: "demoData/output.log",
    // Colorblind mode:
    colorblindMode: false,
  }),
  components: {
    VueSlider,
    ColorLegend,
    hideAt,
  },
  methods: {
    /**
     * This function will change the basemap and all layers into a colorblind version.
     */
    switchMode: async function () {
      if (this.colorblindMode === false) {
        this.tileLayer = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(this.map);

        if (this.aoiLayer != null) {
          this.aoiLayer.setStyle({
            color: "#3388ff",
          });
        }
        if (this.diLayer != null && this.diCheckbox == true) {
          this.map.removeLayer(this.diLayerColorblind);
          this.diLayer.addTo(this.map);
        }
        if (this.predLayer != null && this.predCheckbox == true) {
          this.map.removeLayer(this.predLayerColorblind);
          this.predLayer.addTo(this.map);
        }
        if (this.aoaLayer != null && this.aoaCheckbox == true) {
          this.map.removeLayer(this.aoaLayerColorblind);
          this.aoaLayer.addTo(this.map);
        }
        if (this.samplePolygonsLayer != null) {
          this.samplePolygonsLayer.setStyle({
            color: "#3388ff",
          });
        }
      } else if (this.colorblindMode === true) {
        this.tileLayer = L.tileLayer(
          //"https://tile.jawg.io/e05fd39a-c48d-4fe7-865e-75b940afcb34/{z}/{x}/{y}{r}.png?access-token=f8JszPWTpbAxBEKElUVA7DJcC7Rrzg8hm36s98r2dV7SFWWvoP6v0E9BTxGttjZZ",
          "https://{s}.tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=f8JszPWTpbAxBEKElUVA7DJcC7Rrzg8hm36s98r2dV7SFWWvoP6v0E9BTxGttjZZ",
          {
            attribution:
              //'<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors',
              '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          }
        ).addTo(this.map);

        if (this.aoiLayer != null) {
          this.aoiLayer.setStyle({
            color: "#FF4452",
          });
        }
        if (this.diLayerColorblind != null && this.diCheckbox == true) {
          this.map.removeLayer(this.diLayer);
          this.diLayerColorblind.addTo(this.map);
        }
        if (this.predLayerColorblind != null && this.predCheckbox == true) {
          this.map.removeLayer(this.predLayer);
          this.predLayerColorblind.addTo(this.map);
        }
        if (this.aoaLayerColorblind != null && this.aoaCheckbox == true) {
          this.map.removeLayer(this.aoaLayer);
          this.aoaLayerColorblind.addTo(this.map);
        }
        if (this.samplePolygonsLayer != null) {
          this.samplePolygonsLayer.setStyle({
            color: "#FF4452",
          });
        }
      }
    },
    /**
     * This function initializes the leaflet map with an osm tile layer and focused on Münster.
     */
    initMap: function () {
      this.map = L.map("map-container", {
        layers: this.tileLayer,
      }).setView([51.966, 7.633], 10);

      // To make sure, that the two basement options lie underneath the outputlayers which should be visualized,
      // a Pane with a z-Index gets created, which makes sure they will always lie underneath.
      this.map.createPane("basemap");
      this.map.getPane("basemap").style.zIndex = 10;
      // To keep sure the tiles are not able to grab this line gets added.
      this.map.getPane("basemap").style.pointerEvents = "none";
      // First the osm layer gets initialized.
      const osmUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const osmAttr =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
      // Afterwards the world imagery layer gets initialized.
      const earthUrl =
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
      const earthAttr =
        "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community";

      this.tileLayer = L.tileLayer(osmUrl, {
        attribution: osmAttr,
        pane: "basemap", // Both layers are added to the basemap-pane.
      }).addTo(this.map);

      this.earthLayer = L.tileLayer(earthUrl, {
        attribution: earthAttr,
        pane: "basemap", // Both layers are added to the basemap-pane.
      });

      // At last a layer control must be added to switch between multiple basemaps.
      L.control
        .layers(
          { "Open Street Map": this.tileLayer },
          { "World Imagery": this.earthLayer }
        )
        .addTo(this.map);
    },
    /**
     * This function triggers the downlad process of the results of the calculations.
     * @param {string} urlLink -  Contains the internal URL to the file.
     * @param {string} label - Contains the label the downloaded file should get.
     */
    downloadItem: async function (urlLink, label, type) {
      const url = `${process.env.BASE_URL}` + urlLink;
      let response = await axios.get(url, { responseType: "blob" });
      const blob = new Blob([response.data], { type: type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    /**
     * This function checks whether a requested layer exists or not
     * @param {GeoRasterLayer / GeoJson} layer - This parameter contains the requested layer.
     * @return {Boolean} - It returns true, if the layer eists and false if not.
     */
    checkLayerGetsFoundWithMessage: function (layer) {
      if (layer == null) {
        console.log("Dieser Layer existiert nicht");
        return false;
      } else return true;
    },
    /**
     * This function changes the opacity when triggered through a button.
     * @param {string} layerId - The layerId must be given to change the opacity for the right layer.
     */
    changeOpacity: function (layerId) {
      if (layerId == "aoi") {
        this.aoiLayer.setStyle({
          fillOpacity: this.aoiTransparency / 100,
        });
      } else if (layerId == "aoa") {
        this.aoaLayer.setOpacity(this.aoaTransparency / 100);
        this.aoaLayerColorblind.setOpacity(this.aoaTransparency / 100);
      } else if (layerId == "di") {
        this.diLayer.setOpacity(this.diTransparency / 100);
        this.diLayerColorblind.setOpacity(this.diTransparency / 100);
      } else if (layerId == "pred") {
        this.predLayer.setOpacity(this.predTransparency / 100);
        this.predLayerColorblind.setOpacity(this.predTransparency / 100);
      } else if (layerId == "samplePolygons") {
        this.samplePolygonsLayer.setStyle({
          fillOpacity: this.samplePolygonsTransparency / 100,
        });
      }
    },
    /**
     * This function changes the line thickness of the polygons in a GeoJson layer.
     * @param {string} layerId - The layerId must be given to change the line thickness for the right layer.
     */
    changeLineThickness: function (layerId) {
      if (layerId == "aoi") {
        this.aoiLayer.setStyle({
          weight: this.aoiLineThickness,
        });
      } else if (layerId == "samplePolygons") {
        this.samplePolygonsLayer.setStyle({
          weight: this.samplePolygonsLineThickness,
        });
      }
    },
    /**
     * This function (de-)activates the layer when it gets triffered by the Show/Hide checkbox.
     * @param {string} id - The id is needed to know which layer got triggered.
     */
    switchLayer: function (id) {
      if (id == "aoi") {
        if (!this.checkLayerGetsFoundWithMessage(this.aoiLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";

        if (this.aoiCheckbox == true) {
          this.aoiLayer.addTo(this.map);
          this.map.fitBounds(this.aoiLayer.getBounds());
        } else if (this.aoiCheckbox == false) {
          this.map.removeLayer(this.aoiLayer);
        }
      } else if (id == "di") {
        if (!this.checkLayerGetsFoundWithMessage(this.diLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";
        if (this.diCheckbox == true) {
          if (this.colorblindMode == false) {
            this.diLayer.addTo(this.map);
            this.map.fitBounds(this.diLayer.getBounds());
          } else if (this.colorblindMode == true) {
            this.diLayerColorblind.addTo(this.map);
            this.map.fitBounds(this.diLayerColorblind.getBounds());
          }
        } else if (this.diCheckbox == false) {
          if (this.colorblindMode == false) {
            this.map.removeLayer(this.diLayer);
          } else if (this.colorblindMode == true) {
            this.map.removeLayer(this.diLayerColorblind);
          }
        }
      } else if (id == "pred") {
        if (!this.checkLayerGetsFoundWithMessage(this.predLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";
        if (this.predCheckbox == true) {
          if (this.colorblindMode == false) {
            this.predLayer.addTo(this.map);
            this.map.fitBounds(this.predLayer.getBounds());
          } else if (this.colorblindMode == true) {
            this.predLayerColorblind.addTo(this.map);
            this.map.fitBounds(this.predLayerColorblind.getBounds());
          }
        } else if (this.predCheckbox == false) {
          if (this.colorblindMode == false) {
            this.map.removeLayer(this.predLayer);
          } else if (this.colorblindMode == true) {
            this.map.removeLayer(this.predLayerColorblind);
          }
        }
      } else if (id == "aoa") {
        if (!this.checkLayerGetsFoundWithMessage(this.aoaLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";
        if (this.aoaCheckbox == true) {
          if (this.colorblindMode == false) {
            this.aoaLayer.addTo(this.map);
            this.map.fitBounds(this.aoaLayer.getBounds());
          } else if (this.colorblindMode == true) {
            this.aoaLayerColorblind.addTo(this.map);
            this.map.fitBounds(this.aoaLayerColorblind.getBounds());
          }
        } else if (this.aoaCheckbox == false) {
          if (this.colorblindMode == false) {
            this.map.removeLayer(this.aoaLayer);
          } else if (this.colorblindMode == true) {
            this.map.removeLayer(this.aoaLayerColorblind);
          }
        }
      } else if (id == "samplePolygons") {
        if (!this.checkLayerGetsFoundWithMessage(this.samplePolygonsLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";
        if (this.samplePolygonsCheckbox == true) {
          this.samplePolygonsLayer.addTo(this.map);
          this.map.fitBounds(this.samplePolygonsLayer.getBounds());
        } else if (this.samplePolygonsCheckbox == false) {
          this.map.removeLayer(this.samplePolygonsLayer);
        }
      } else if (id == "suggestion") {
        if (!this.checkLayerGetsFoundWithMessage(this.suggestionLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";
        if (this.suggestionCheckbox == true) {
          this.suggestionLayer.addTo(this.map);
          this.map.fitBounds(this.suggestionLayer.getBounds());
        } else if (this.suggestionCheckbox == false) {
          this.map.removeLayer(this.suggestionLayer);
        }
      }
    },
    /**
     * This function focuses the map to the layer where the button gets triggered. It's comparable to the "zoom to layer" function known from common GIS.
     * @param {string} layerId - The layer id is needed to kn ow which layer got triggered.
     */
    zoomToLayer: function (layerId) {
      let tempLayer = null;
      if (layerId == "aoi") tempLayer = this.aoiLayer;
      else if (layerId == "di") tempLayer = this.diLayer;
      else if (layerId == "pred") tempLayer = this.predLayer;
      else if (layerId == "aoa") tempLayer = this.aoaLayer;
      else if (layerId == "samplePolygons")
        tempLayer = this.samplePolygonsLayer;
      else if (layerId == "suggestion") tempLayer = this.suggestionLayer;
      else return;
      this.map.fitBounds(tempLayer.getBounds());
    },
    /**
     * This function builds layers for all .geojson files.
     */
    showGeoJson: async function () {
      // changed
      const customizedIcon = L.icon({
        iconUrl: markerPng,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
      });

      const responseAoi = await fetch(this.aoiJson);
      const responseSamplePolygons = await fetch(this.samplePolygonsJson);
      const responseSuggestion = await fetch(this.suggestionJson);

      const aoi = await responseAoi.json();
      const samplePolygons = await responseSamplePolygons.json();
      const suggestion = await responseSuggestion.json();

      this.aoiLayer = L.geoJson(aoi);
      this.samplePolygonsLayer = L.geoJson(samplePolygons);
      this.suggestionLayer = L.geoJson(suggestion, {
        pointToLayer: function (_feature, latlng) {
          return L.marker(latlng, { icon: customizedIcon });
        },
      });
    },
    /**
     * This function builds layers for all .tif files.
     */
    showTif1Band: async function () {
      const responseDi = await fetch(this.diUrl);
      const responseAoa = await fetch(this.aoaUrl);
      const responsePred = await fetch(this.predUrl);

      const arrayBufferDi = await responseDi.arrayBuffer();
      const arrayBufferAoa = await responseAoa.arrayBuffer();
      const arrayBufferPred = await responsePred.arrayBuffer();

      const georasterDi = await parseGeoraster(arrayBufferDi);

      const minDi = georasterDi.mins[0];
      const rangeDi = georasterDi.ranges[0];

      const scaleViridis = chroma.scale("Viridis");
      const colorblindScaleDi = chroma.scale(["yellow", "navy"]).mode("lch");

      this.diLayer = new GeoRasterLayer({
        georaster: georasterDi,
        opacity: this.diTransparency,
        pixelValuesToColorFn: function (pixelValues) {
          const [pixelValue] = pixelValues; // there's just one band in this raster
          // if there's zero wind, don't return a color
          if (pixelValue === 0) return null;
          // scale to 0 - 1 used by chroma
          const scaledPixelValue = (pixelValue - minDi) / rangeDi;

          const color = scaleViridis(scaledPixelValue).hex();

          return color;
        },
        resolution: 256,
      });
      this.diLayerColorblind = new GeoRasterLayer({
        georaster: georasterDi,
        opacity: this.diTransparency,
        pixelValuesToColorFn: function (pixelValues) {
          const [pixelValue] = pixelValues; // there's just one band in this raster
          // if there's zero wind, don't return a color
          if (pixelValue === 0) return null;
          // scale to 0 - 1 used by chroma
          const scaledPixelValue = (pixelValue - minDi) / rangeDi;
          const color = colorblindScaleDi(scaledPixelValue).hex();
          return color;
        },
        resolution: 256,
      });

      const georasterAoa = await parseGeoraster(arrayBufferAoa);

      this.aoaLayer = new GeoRasterLayer({
        georaster: georasterAoa,
        opacity: this.aoaTransparency,
        pixelValuesToColorFn: function (pixelValues) {
          const pixelValue = pixelValues[0];
          // if there's zero wind, don't return a color
          if (pixelValue === 1) {
            return null;
          }
          return "#cf1f8f";
        },
        resolution: 256,
      });
      this.aoaLayerColorblind = new GeoRasterLayer({
        georaster: georasterAoa,
        opacity: this.aoaTransparency,
        pixelValuesToColorFn: function (pixelValues) {
          const pixelValue = pixelValues[0];
          // if there's zero wind, don't return a color
          if (pixelValue === 1) {
            return null;
          }
          return "#21A7E6";
        },
        resolution: 256,
      });

      // Will be colored:
      const georasterPred = await parseGeoraster(arrayBufferPred);
      this.predLayer = new GeoRasterLayer({
        georaster: georasterPred,
        opacity: this.predTransparency,
        pixelValuesToColorFn: (pixelValues) =>
          this.predClassificationColors[pixelValues[0] - 1] || null,
        resolution: 256,
      });
      this.predLayerColorblind = new GeoRasterLayer({
        georaster: georasterPred,
        opacity: this.predTransparency,
        pixelValuesToColorFn: (pixelValues) =>
          this.colorblindScalePred[pixelValues[0] - 1] || null,
        resolution: 256,
      });
    },
    /**
     * This function loads the given result.json asynchronious, which gives us the possibility to work with this given values including
     * the accuracy and the dissimilarity index as resulting values from the processing as well as the the classes from the classification used
     * to color the resultig GeoTiff.
     */
    loadResultJson: async function () {
      let responseResult = await fetch(this.resultJsonUrl);
      this.resultJson = await responseResult.json();

      this.accuracy = this.resultJson[1];
      this.kappaIndex = this.resultJson[2];

      // Generate classification colors with chromajs
      this.predClassificationColors = chroma
        .scale("Spectral")
        .colors(this.resultJson[0].length);

      this.colorblindScalePred = chroma
        .scale("RdYlBu")
        .colors(this.resultJson[0].length);
    },
  },
  async mounted() {
    this.$store.dispatch("getJobById", this.jobId);

    this.initMap();
    await this.loadResultJson();
    this.showTif1Band();
    this.showGeoJson();
  },
  beforeUnmount() {
    if (this.map) {
      this.map.remove();
    }
  },
};
</script>
<style scoped>
body {
  text-align: center;
}
td {
  height: 90px;
}
#td_elements_with_slider {
  padding-top: 15px;
  padding-bottom: 5px;
}
tr#not_last_td {
  border-bottom: grey;
}
tr#last_td {
  border-bottom: grey;
}
.child {
  display: inline-block;
}

#download_b {
  padding-top: 17px;
}
.download_button {
  justify-content: center;
  align-items: center;
  flex-wrap: nowrap;
  position: relative;
}
#control.table {
  display: block;
  /* DOENST WORK BUT THE TARGET WAS A CENTER ALIGNED LAYER CONTROL FOR THE RESPONSIVE DESIGN */
  margin-left: auto;
  margin-right: auto;
}
.layer-column {
  flex: auto;
}
#map-container {
  width: 100%;
  height: 500px;
}
@media (min-width: 1264px) {
  .wrapper {
    flex: 1;
    height: 100%;
    min-height: 0;
    overflow: hidden;
  }
  .layer-column {
    height: 100%;
    position: relative;
    overflow-y: auto;
    overflow-x: hidden;
    min-height: 0;
    min-width: 410px;
    max-width: 410px;
  }
  #map-container {
    width: 100%;
    height: 100%;
  }
}
</style>
