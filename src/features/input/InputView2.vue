<template>
  <div
    style="
      width: 100%;
      height: 100%;
      background-color: #eee;
      position: relative;
    "
  >
    <v-map
      ref="map"
      :zoom="zoom"
      :center="center"
      :options="{ zoomControl: false }"
      attribution="© Проект А"
    >
      <v-tilelayer :url="url" :attribution="attribution"></v-tilelayer>
      <v-geo-json
        v-for="(gj, idx) in geojson"
        :geojson="gj.geometry"
        :key="idx"
        :options="options(gj)"
      >
        <v-popup
          :content="gotoTunnelCard"
          :options="{ autoClose: false, closeOnClick: false }"
        ></v-popup>
      </v-geo-json>
    </v-map>
  </div>
</template>

<script>
import Vue2Leaflet from "vue2-leaflet";
import "leaflet-draw";

export default {
  name: "InputView",
  components: {
    "v-map": Vue2Leaflet.LMap,
    "v-tilelayer": Vue2Leaflet.LTileLayer,
    "v-marker": Vue2Leaflet.LMarker,
    "v-geo-json": Vue2Leaflet.LGeoJson,
    "v-popup": Vue2Leaflet.Popup,
  },

  mounted() {
    this.$nextTick(() => {
      const map = this.$refs.map.mapObject;

      this.drawControl = new window.L.Control.Draw({
        position: "topright",
        draw: {
          polyline: {
            allowIntersection: false,
            showArea: true,
          },
          polygon: false,
          rectangle: false,
          circle: false,
        },
      });

      window.L.DrawToolbar.include({
        getModeHandlers(_map) {
          return [
            {
              enabled: true,
              handler: new window.L.Draw.Polyline(_map),
              title: "Добавить тоннель",
            },
          ];
        },
      });

      this.drawControl.setDrawingOptions({
        // new lines will have different color
        polyline: {
          shapeOptions: {
            color: "#ff0a1e",
          },
        },
      });

      map.addControl(this.drawControl);

      this.editableLayers = new window.L.FeatureGroup().addTo(map);
      const control = this.drawControl._container.querySelector(
        ".leaflet-draw-toolbar"
      );

      /* Commit drawn tunnel */
      let link = document.createElement("a");
      link.className = "leaflet-draw-draw-OK_ICON";
      link.style.display = "none";
      link.onclick = () => {
        this.$store.dispatch("tunnelEdit", this.newTunnel);
        this.$emit("tunnelAdd");
      };
      this.okBtn = control.appendChild(link);

      /* Remove drawn tunnel */
      link = document.createElement("a");
      link.className = "leaflet-draw-draw-NOK_ICON";
      link.style.display = "none";
      link.onclick = () => {
        this.okBtn.style.display = "none";
        this.nokBtn.style.display = "none";
        this.layers.forEach((l) => this.editableLayers.removeLayer(l));
        this.newTunnel = {
          geometry: {
            coordinates: [],
          },
        };
      };
      this.nokBtn = control.appendChild(link);

      map.on(window.L.Draw.Event.CREATED, (e) => {
        const layer = e.layer;
        const coords = layer._latlngs.map((objCoordinates) => [
          objCoordinates.lng,
          objCoordinates.lat,
        ]);

        this.newTunnel.geometry.coordinates.push(coords);
        this.newTunnel.categoryDate = 0;
        this.editableLayers.addLayer(layer);
        this.layers.push(layer);
        this.okBtn.style.display = "block";
        this.nokBtn.style.display = "block";
      });
    });
  },

  data() {
    return {
      zoom: 13,
      editableLayers: null,
      drawControl: null,
      layers: [],
      okBtn: null,
      cancelBtn: null,
      newTunnel: {
        geometry: {
          type: "MultiLineString",
          coordinates: [],
        },
      },
      center: [55.75583, 37.61778],
      // url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      url: "http://10.101.20.207/api/{z}/{x}/{y}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: window.L.latLng(47.41322, -1.219482),
      popupRoot: null,
      tunnel: null,
      tName: 0,
    };
  },

  computed: {
    geojson() {
      return this.$store.state.TunnelsCategories.tunnels;
    },
  },

  methods: {
    gotoTunnelCard(tunnel) {
      this.$store.dispatch("tunnelEdit", tunnel);
      this.$emit("tunnelCommonInfo");
    },

    renderPopup(tunnel) {
      const popupRoot = document.createElement("div");
      popupRoot.setAttribute("id", "leafroot-id");
      const el = document.createElement("button");

      const imgId = (function (id) {
        switch (id) {
          case 1:
            return 165;
          case 2:
            return 67;
          case 3:
            return 166;
          case 53:
            return 169;
          case 54:
            return 170;
          case 12:
            return 97;
          default:
            return 1;
        }
      })(tunnel.id);

      popupRoot.innerHTML =
        '<h5 style="font-weight:bold">' +
        tunnel.name +
        "</h5>" +
        '<img class="popup-img" src="imgs/' +
        imgId +
        '_3.png"/>' +
        '<div class="popup-text">Категория: ' +
        tunnel.category +
        "</div>" +
        '<div class="popup-text">Дата установки: ' +
        tunnel.categoryDate +
        "</div>" +
        '<div class="popup-text">Название дороги: ' +
        tunnel.roadName +
        "</div>" +
        '<div class="popup-text length">Длина дороги: ' +
        tunnel.length +
        "</div>";

      el.innerHTML = "Перейти к рассчёту";
      el.classList = "btn notice-btn btn-secondary";
      el.onclick = this.gotoTunnelCard.bind(this, tunnel);
      popupRoot.appendChild(el);

      return popupRoot;
    },
    onEachFeatureFunction(tunnel) {
      return (feature, layer) => {
        const popup = this.renderPopup(tunnel);
        layer.bindTooltip(
          '<div style="font-weight:bold;">' + tunnel.name + "</div>",
          { permanent: false, sticky: true }
        );
        layer.bindPopup(popup, { permanent: false, sticky: true });
      };
    },

    options(tunnel) {
      return {
        onEachFeature: this.onEachFeatureFunction.call(this, tunnel),
      };
    },
  },
};
</script>

<style scoped></style>
