<template>
  <div class="d-flex flex-column flex-lg-row wrapper" style="flex: 1">
    <div class="flex-column layer-column">
      <div id="job_number" class="m-3 mb-2 text-h5">
        {{ job.name || "-" }}
        <v-btn
          class="float-right"
          outlined
          style="padding-left: 10px; padding-right: 7px"
          v-on:click="downloadItem('output.log', 'output.log', 'text/html')"
        >
          Protocol
          <v-icon>mdi-download</v-icon>
        </v-btn>
      </div>

      <v-row class="ml-1">
        <v-col cols="12">
          <v-switch
            v-model="colorblindMode"
            label="Switch to Color Blind Mode"
            v-on:change="switchMode"
          ></v-switch
        ></v-col>
      </v-row>

      <template v-if="colorblindMode === true">
        <v-row class="mx-1">
          <v-col cols="12">
            <v-select
              filled
              :items="[
                'Red-Blind/Protanopia',
                'Green-Blind/Deuteranopia',
                'Blue-Blind/Tritanopia',
              ]"
              label="Type"
              v-model="typeOfColorBlindness"
              v-on:change="changePolygonColor"
            ></v-select>
          </v-col>
        </v-row>
      </template>

      <v-simple-table class="mb-6">
        <template v-slot:default>
          <tbody>
            <template v-if="aoiLayer != null">
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
                  </div>
                </td>
              </tr>
            </template>
            <template v-if="aoiLayer === null">
              <v-tooltip left color="error">
                <template v-slot:activator="{ on }">
                  <tr id="not_last_td" v-on="on">
                    <td id="td_elements_with_slider" style="color: #a7a7a7">
                      Area of Interest (AOI)
                      <vue-slider
                        disabled
                        v-model="aoiTransparency"
                        v-on:change="changeOpacity('aoi')"
                        :minRange="0"
                        :maxRange="10"
                      />
                      <p style="font-size: 10px">Transparency</p>
                      <vue-slider
                        disabled
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
                        <v-simple-checkbox
                          id="aoi"
                          color="primary"
                          v-model="aoiCheckbox"
                          v-ripple
                          disabled
                        ></v-simple-checkbox>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ms-2"
                              icon
                              disabled
                              v-on:click="zoomToLayer('aoi')"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </template>
                          <span>Zoom to layer</span>
                        </v-tooltip>
                      </div>
                    </td>
                  </tr>
                </template>
                <span>This Layer is not available</span>
              </v-tooltip>
            </template>
            <template v-if="diLayer != null">
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Dissimilarity Index
                  <vue-slider
                    v-model="diTransparency"
                    v-on:change="changeOpacity('di')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>

                  <ColorLegend scale="Viridis" :steps="6" :fixed="1" />
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
                            downloadItem('aoa_di.tif', 'aoa_di', 'image/tiff')
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
            </template>
            <template v-if="diLayer === null">
              <v-tooltip left color="error">
                <template v-slot:activator="{ on }">
                  <tr id="not_last_td" v-on="on">
                    <td id="td_elements_with_slider" style="color: #a7a7a7">
                      Dissimilarity Index
                      <vue-slider
                        :disabled="true"
                        v-model="diTransparency"
                        v-on:change="changeOpacity('di')"
                        :tooltip-formatter="sliderPercentage"
                      />
                      <p style="font-size: 10px">Transparency</p>

                      <ColorLegend scale="Viridis" :steps="6" :fixed="1" />
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <v-simple-checkbox
                          id="di"
                          color="primary"
                          v-model="diCheckbox"
                          v-ripple
                          disabled
                        ></v-simple-checkbox>

                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ms-2"
                              icon
                              disabled
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
                              disabled
                              v-on:click="
                                downloadItem(
                                  'aoa_di.tif',
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
                </template>
                <span>This Layer is not available</span>
              </v-tooltip>
            </template>
            <template v-if="predLayer != null">
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
                            downloadItem('pred.tif', 'pred', 'image/tiff')
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
            </template>
            <template v-if="predLayer === null">
              <v-tooltip left color="error">
                <template v-slot:activator="{ on }">
                  <tr id="not_last_td" v-on="on">
                    <td id="td_elements_with_slider" style="color: #a7a7a7">
                      Prediction / Classification
                      <vue-slider
                        disabled
                        v-model="predTransparency"
                        v-on:change="changeOpacity('pred')"
                        :tooltip-formatter="sliderPercentage"
                      />
                      <p style="font-size: 10px">Transparency</p>
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <v-simple-checkbox
                          id="pred"
                          color="primary"
                          v-model="predCheckbox"
                          v-ripple
                          disabled
                        ></v-simple-checkbox>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ms-2"
                              icon
                              disabled
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
                              disabled
                              v-on:click="
                                downloadItem('pred.tif', 'pred', 'image/tiff')
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
                </template>
                <span>This Layer is not available</span>
              </v-tooltip>
            </template>
            <template v-if="aoaLayer != null">
              <tr id="not_last_td">
                <td id="td_elements_with_slider">
                  Area of Applicability (AOA)
                  <vue-slider
                    v-model="aoaTransparency"
                    v-on:change="changeOpacity('aoa')"
                    :tooltip-formatter="sliderPercentage"
                  />
                  <p style="font-size: 10px">Transparency</p>

                  <ColorLegend
                    :scale="['#cf1f8f', '#ffffff']"
                    :steps="2"
                    :fixed="0"
                  />
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
                            downloadItem('aoa_aoa.tif', 'aoa_aoa', 'image/tiff')
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
            </template>
            <template v-if="aoaLayer === null">
              <v-tooltip left color="error">
                <template v-slot:activator="{ on }">
                  <tr id="not_last_td" v-on="on">
                    <td id="td_elements_with_slider" style="color: #a7a7a7">
                      Area of Applicability (AOA)
                      <vue-slider
                        disabled
                        v-model="aoaTransparency"
                        v-on:change="changeOpacity('aoa')"
                        :tooltip-formatter="sliderPercentage"
                      />
                      <p style="font-size: 10px">Transparency</p>

                      <ColorLegend
                        :scale="['#cf1f8f', '#ffffff']"
                        :steps="2"
                        :fixed="0"
                      />
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <v-simple-checkbox
                          id="aoa"
                          color="primary"
                          v-model="aoaCheckbox"
                          v-ripple
                          disabled
                        ></v-simple-checkbox>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ms-2"
                              icon
                              disabled
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
                              disabled
                              v-on:click="
                                downloadItem(
                                  'aoa_aoa.tif',
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
                </template>
                <span>This Layer is not available</span>
              </v-tooltip>
            </template>
            <template v-if="samplePolygonsLayer != null">
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
                  </div>
                </td>
              </tr>
            </template>
            <template v-if="samplePolygonsLayer === null">
              <v-tooltip left color="error">
                <template v-slot:activator="{ on }">
                  <tr id="last_td" v-on="on">
                    <td id="td_elements_with_slider" style="color: #a7a7a7">
                      Sample Polygons
                      <vue-slider
                        disabled
                        v-model="samplePolygonsTransparency"
                        v-on:change="changeOpacity('samplePolygons')"
                        :tooltip-formatter="sliderPercentage"
                      />
                      <p style="font-size: 10px">Transparency</p>
                      <vue-slider
                        disabled
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
                        <v-simple-checkbox
                          id="samplePolygons"
                          color="primary"
                          v-model="samplePolygonsCheckbox"
                          v-ripple
                          disabled
                        ></v-simple-checkbox>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ms-2"
                              icon
                              disabled
                              v-on:click="zoomToLayer('samplePolygons')"
                              v-bind="attrs"
                              v-on="on"
                            >
                              <v-icon>mdi-magnify</v-icon>
                            </v-btn>
                          </template>
                          <span>Zoom to layer</span>
                        </v-tooltip>
                      </div>
                    </td>
                  </tr></template
                >
                <span>This Layer is not available</span>
              </v-tooltip>
            </template>
            <template v-if="suggestionLayer != null">
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
                              'suggestion.geojson',
                              'suggestion',
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
            </template>
            <template v-if="suggestionLayer === null">
              <v-tooltip left color="error">
                <template v-slot:activator="{ on }">
                  <tr id="not_last_td" v-on="on">
                    <td style="color: #a7a7a7">
                      Suggested locations for training polygons
                    </td>
                    <td>
                      <div class="d-flex align-items-center">
                        <v-simple-checkbox
                          id="suggestion"
                          color="primary"
                          v-model="suggestionCheckbox"
                          v-ripple
                          disabled
                        ></v-simple-checkbox>
                        <v-tooltip bottom>
                          <template v-slot:activator="{ on, attrs }">
                            <v-btn
                              class="ms-2"
                              icon
                              disabled
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
                              disabled
                              v-on:click="
                                downloadItem(
                                  'suggestion.geojson',
                                  'suggestion',
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
                </template>
                <span>This Layer is not available</span>
              </v-tooltip>
            </template>
          </tbody></template
        >
      </v-simple-table>
      <v-divider light class="m-0"> </v-divider>
      <template v-if="kappaIndex === null">
        <v-tooltip left color="error">
          <template v-slot:activator="{ on }">
            <v-row justify="center" v-on="on">
              <v-expansion-panels flat accordion disabled class="pb-7">
                <v-expansion-panel>
                  <v-expansion-panel-header class="pl-4" style="font-size: 14px"
                    >Details</v-expansion-panel-header
                  >
                  <v-expansion-panel-content> </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels> </v-row
          ></template>
          <span>These informations are not available</span>
        </v-tooltip>
      </template>
      <template v-if="kappaIndex != null">
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
                        'model.rds',
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
                        'job_param.json',
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
      </template>
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
//import axios from "axios";
import * as API from "@/common/api";

import VueSlider from "vue-slider-component";
import "vue-slider-component/theme/antd.css";

import chroma from "chroma-js";

import markerPng from "@/assets/markerIconRedCrossWithBlackEvenThicker.png";

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
    aoiJson: "aoi.geojson",
    aoiLayer: null,
    aoiTransparency: 50,
    aoiLineThickness: 1,
    // Everything needed to visualize the aoi_di.tif.
    diCheckbox: false,
    diUrl: "aoa_di.tif",
    diLayer: null,
    diTransparency: 100,
    // Everything needed to visualize the pred.tif.
    predCheckbox: false,
    predUrl: "pred.tif",
    predLayer: null,
    predTransparency: 100,
    // Generated by chromajs, e.g.: ['#9e0142', '#f98e52', ...]
    predClassificationColors: [],
    // Everything needed to visualize the aoi_aoa.tif.
    aoaCheckbox: false,
    aoaUrl: "aoa_aoa.tif",
    aoaLayer: null,
    aoaTransparency: 100,
    // Everything needed to visualize the samplePolygons.geojson.
    samplePolygonsCheckbox: false,
    samplePolygonsJson: "samples.geojson",
    samplePolygonsLayer: null,
    samplePolygonsTransparency: 50,
    samplePolygonsLineThickness: 1,
    // Everything needed to visualize the suggestion.geojson.
    suggestionCheckbox: false,
    suggestionJson: "suggestion.geojson",
    suggestionLayer: null,
    // Causes the percentage scale of the slider component.
    sliderPercentage: "{value} %",
    resultJsonUrl: "result.json",
    resultJson: null,
    kappaIndex: null,
    accuracy: null,
    outputLogUrl: "output.log",
    // Color blind mode
    colorblindMode: false,
    typeOfColorBlindness: "Red-Blind/Protanopia",
  }),
  components: {
    VueSlider,
    ColorLegend,
  },
  methods: {
    /**
     * This function will change the basemap into a colorblind version.
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

        await this.showGeoJson("#3388ff");
      } else if (this.colorblindMode === true) {
        this.tileLayer = L.tileLayer(
          "https://tile.jawg.io/e05fd39a-c48d-4fe7-865e-75b940afcb34/{z}/{x}/{y}{r}.png?access-token=f8JszPWTpbAxBEKElUVA7DJcC7Rrzg8hm36s98r2dV7SFWWvoP6v0E9BTxGttjZZ",
          {
            attribution:
              '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors',
          }
        ).addTo(this.map);

        let polygonColor = null;

        if (this.redBlind === true) {
          polygonColor = "#33691E";
        } else if (this.greenBlind === true) {
          polygonColor = "#FF6D00";
        } else if (this.blueBlind === true) {
          polygonColor = "#FF1744";
        }
        await this.showGeoJson(polygonColor);
      }
    },
    changePolygonColor: async function () {
      if (this.colorblindMode === false) {
        await this.showGeoJson("#3388ff");
      } else if (this.colorblindMode === true) {
        let polygonColor = null;

        if (this.typeOfColorBlindness === "Red-Blind/Protanopia") {
          polygonColor = "#33691E";
        } else if (this.typeOfColorBlindness === "Green-Blind/Deuteranopia") {
          polygonColor = "#FF6D00";
        } else if (this.typeOfColorBlindness === "Blue-Blind/Tritanopia") {
          polygonColor = "#FF1744";
        }
        await this.showGeoJson(polygonColor);
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
      // Colorblind layer basemap
      const colorblindUrl =
        "https://tile.jawg.io/e05fd39a-c48d-4fe7-865e-75b940afcb34/{z}/{x}/{y}{r}.png?access-token=f8JszPWTpbAxBEKElUVA7DJcC7Rrzg8hm36s98r2dV7SFWWvoP6v0E9BTxGttjZZ";
      const colorblindAttr =
        '<a href="https://www.jawg.io" target="_blank">&copy; Jawg</a> - <a href="https://www.openstreetmap.org" target="_blank">&copy; OpenStreetMap</a>&nbsp;contributors';

      this.tileLayer = L.tileLayer(osmUrl, {
        attribution: osmAttr,
        pane: "basemap", // Both layers are added to the basemap-pane.
      }).addTo(this.map);

      this.earthLayer = L.tileLayer(earthUrl, {
        attribution: earthAttr,
        pane: "basemap", // Both layers are added to the basemap-pane.
      });

      this.colorblindLayer = L.tileLayer(colorblindUrl, {
        attribution: colorblindAttr,
        subdomains: "abcd",
      });

      const basemaps = {
        "Open Street Map": this.tileLayer,
        "Colorblind map": this.colorblindLayer,
      };
      const overlayMaps = { "World Imagery": this.earthLayer };

      // At last a layer control must be added to switch between multiple basemaps.
      L.control.layers(basemaps, overlayMaps).addTo(this.map);
    },
    /**
     * This function triggers the downlad process of the results of the calculations.
     * @param {string} urlLink -  Contains the internal URL to the file.
     * @param {string} label - Contains the label the downloaded file should get.
     */
    downloadItem: async function (urlLink, label, type) {
      let response = await API.getJobFile(this.jobId, urlLink, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: type });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = label;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    downloadTextFile: async function (urlLink, label) {
      let response = await API.getJobFile(this.jobId, urlLink, {
        responseType: "blob",
      });
      const blob = new Blob([response.data], { type: "text/html" });
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
      } else if (layerId == "di") {
        this.diLayer.setOpacity(this.diTransparency / 100);
      } else if (layerId == "pred") {
        this.predLayer.setOpacity(this.predTransparency / 100);
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
          this.diLayer.addTo(this.map);
          this.map.fitBounds(this.diLayer.getBounds());
        } else if (this.diCheckbox == false) {
          this.map.removeLayer(this.diLayer);
        }
      } else if (id == "pred") {
        if (!this.checkLayerGetsFoundWithMessage(this.predLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";
        if (this.predCheckbox == true) {
          this.predLayer.addTo(this.map);
          this.map.fitBounds(this.predLayer.getBounds());
        } else if (this.predCheckbox == false) {
          this.map.removeLayer(this.predLayer);
        }
      } else if (id == "aoa") {
        if (!this.checkLayerGetsFoundWithMessage(this.aoaLayer))
          throw "ERROR - Dieser Layer exisitiert nicht!";
        if (this.aoaCheckbox == true) {
          this.aoaLayer.addTo(this.map);
          this.map.fitBounds(this.aoaLayer.getBounds());
        } else if (this.aoaCheckbox == false) {
          this.map.removeLayer(this.aoaLayer);
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
    showGeoJson: async function (color) {
      const customizedIcon = L.icon({
        iconUrl: markerPng,
        iconSize: [46, 46],
        iconAnchor: [23, 23],
      });

      let responseAoi = null;
      let responseSamplePolygons = null;
      let responseSuggestion = null;

      try {
        responseAoi = await API.getJobFile(this.jobId, this.aoiJson);
      } catch (err) {
        console.warn("Unable to load file:", this.aoiJson);
      }
      try {
        responseSamplePolygons = await API.getJobFile(
          this.jobId,
          this.samplePolygonsJson
        );
      } catch (err) {
        console.warn("Unable to load file:", this.samplePolygonsJson);
      }
      try {
        responseSuggestion = await API.getJobFile(
          this.jobId,
          this.suggestionJson
        );
      } catch (err) {
        console.warn("Unable to load file:", this.suggestionJson);
      }

      if (responseAoi) {
        this.aoiLayer = L.geoJson(responseAoi.data, {
          style: { color: color },
        });
      }
      if (responseSamplePolygons) {
        this.samplePolygonsLayer = L.geoJson(responseSamplePolygons.data);
      }
      if (responseSuggestion) {
        this.suggestionLayer = L.geoJson(responseSuggestion.data, {
          pointToLayer: function (_feature, latlng) {
            return L.marker(latlng, { icon: customizedIcon });
          },
        });
      }
    },
    /**
     * This function builds layers for all .tif files.
     */
    showTif1Band: async function () {
      let responseDi = null;
      let responseAoa = null;
      let responsePred = null;

      try {
        responseDi = await API.getJobFile(this.jobId, this.diUrl, {
          responseType: "arraybuffer",
        });
      } catch (err) {
        console.warn("Unable to load file:", this.diUrl);
      }
      try {
        responseAoa = await API.getJobFile(this.jobId, this.aoaUrl, {
          responseType: "arraybuffer",
        });
      } catch (err) {
        console.warn("Unable to load file:", this.aoaUrl);
      }
      try {
        responsePred = await API.getJobFile(this.jobId, this.predUrl, {
          responseType: "arraybuffer",
        });
      } catch (err) {
        console.warn("Unable to load file:", this.predUrl);
      }

      if (responseDi) {
        const georasterDi = await parseGeoraster(responseDi.data);

        const minDi = georasterDi.mins[0];
        const rangeDi = georasterDi.ranges[0];

        const scaleViridis = chroma.scale("Viridis");

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
      }

      if (responseAoa) {
        const georasterAoa = await parseGeoraster(responseAoa.data);

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
      }
      // Needs to be colored:
      if (responsePred) {
        const georasterPred = await parseGeoraster(responsePred.data);

        this.predLayer = new GeoRasterLayer({
          georaster: georasterPred,
          opacity: this.predTransparency,
          pixelValuesToColorFn: (pixelValues) =>
            this.predClassificationColors[pixelValues[0] - 1] || null,
          resolution: 256,
        });
      }
    },
    /**
     * This function loads the given result.json asynchronious, which gives us the possibility to work with this given values including
     * the accuracy and the dissimilarity index as resulting values from the processing as well as the the classes from the classification used
     * to color the resultig GeoTiff.
     */
    loadResultJson: async function () {
      let responseResult = null;

      try {
        responseResult = await API.getJobFile(this.jobId, this.resultJsonUrl);
      } catch (err) {
        console.warn("Unable to load file:", this.resultJsonUrl);
      }

      if (!responseResult) {
        return;
      }

      this.accuracy = responseResult.data[1];
      this.kappaIndex = responseResult.data[2];
      this.resultJson = responseResult.data;

      // Generate classification colors with chromajs
      this.predClassificationColors = chroma
        .scale("Spectral")
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
