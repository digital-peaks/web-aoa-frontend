<template>
  <div class="bg-light map-column" id="map-container">
    <l-map style="width: 100%; height: 450px" :zoom="zoom" :center="center">
      <l-tile-layer :url="url" :attribution="attribution"></l-tile-layer>
      <l-marker :lat-lng="markerLatLng"></l-marker>
    </l-map>
  </div>
</template>

<script>
import { LMap, LTileLayer, LMarker } from "vue2-leaflet";

export default {
  name: "Output",
  data: () => ({
    aoiFile: undefined,
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a target="_blank" href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    zoom: 10,
    center: [51.966, 7.633],
    markerLatLng: [51.966, 7.633],
  }),
  components: {
    LMap,
    LTileLayer,
    LMarker,
  },
};
</script>
<style scoped>
.map-column {
  flex: auto;
  min-height: 350px;
  height: 50%;
}
@media (min-width: 992px) {
  .map-column {
    flex: 1;
    position: relative;
    min-height: auto;
    height: 100%;
  }
}
</style>
