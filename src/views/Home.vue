<template>
  <div>
    <div class="header mb-3 mt-3">
      <b-container>
        <b-row align-v="center" align-h="around">
          <div class="title">
            <h1>COVID-19 TRACKER</h1>
            <h2 class="mb-5">Choose from the map or from the form below for more details</h2>
          </div>
          <div class="total">
            <h3>Total cases</h3>
            <h4>Confirmed: {{totalCases.confirmed}}</h4>
            <h4>Deaths: {{totalCases.deaths}}</h4>
          </div>
        </b-row>
      </b-container>
    </div>
    <div
      class="map-container"
      style="height: 60vh; width: 100%; margin: 0 auto;"
      :class="heightClass"
    >
      <l-map
        :class="heightClass"
        v-if="showMap"
        :zoom="zoom"
        :center="center"
        :options="mapOptions"
      >
        <div class="minimized-button" @click="minimized()">{{mapHeight}}</div>

        <l-tile-layer :url="url" :attribution="attribution"/>
        <l-marker
          :lat-lng="markers[index]"
          v-for="(item, index) in coronaCases"
          class="marker-test"
          style="display: block"
        >
          <l-icon :icon-url="icon" :icon-size="iconSize"></l-icon>
          <l-popup
            :content="`<span><h3>Country:</h3><p>${item.country} ${item.province}</p><h3>Confirmed:</h3><p>${item.latest.confirmed}</p></span>`"
            :options="{ autoClose: true, closeOnClick: true }"
          ></l-popup>
        </l-marker>
      </l-map>
    </div>

    <TheForm/>
    <TheFooter/>
  </div>
</template>

<script>
import { latLng } from "leaflet";
import { LMap, LTileLayer, LMarker, LIcon, LPopup } from "vue2-leaflet";
import axios from "axios";
import beer from "../assets/pin.svg";
import nations from "../assets/nations.json";
import TheForm from "../components/TheForm";
import Moveable from "vue-moveable";
import TheFooter from "../components/TheFooter";

export default {
  name: "Example",
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LIcon,
    LPopup,
    TheForm,
    Moveable,
    TheFooter
  },
  data() {
    return {
      zoom: 2,
      minimizing: false,
      center: latLng(47.41322, -1.219482),
      url:
        "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
      attribution:
        '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      currentZoom: 11.5,
      currentCenter: latLng(47.41322, -1.219482),
      showParagraph: false,
      mapOptions: {
        zoomSnap: 0.5
      },
      showMap: true,
      coronaCases: undefined,
      markers: [],
      icon: beer,
      iconSize: [55, 55],
      moveable: {
        draggable: true,
        throttleDrag: 0,
        resizable: false,
        throttleResize: 1,
        keepRatio: false,
        scalable: true,
        throttleScale: 0,
        rotatable: true,
        throttleRotate: 0,
        pinchable: true, // ["draggable", "resizable", "scalable", "rotatable"]
        origin: false
      },
      totalCases: undefined
    };
  },
  methods: {
    showLongText() {
      this.showParagraph = !this.showParagraph;
    },
    innerClick() {
      alert("Click!");
    },
    minimized() {
      this.$store.commit("toggleMinimized", true);
    },
    handleDrag({ target, transform }) {
      console.log("onDrag left, top", transform);
      target.style.transform = transform;
    },
    handleResize({ target, width, height, delta }) {
      console.log("onResize", width, height);
      delta[0] && (target.style.width = `${width}px`);
      delta[1] && (target.style.height = `${height}px`);
    },
    handleScale({ target, transform, scale }) {
      console.log("onScale scale", scale);
      target.style.transform = transform;
    },
    handleRotate({ target, dist, transform }) {
      console.log("onRotate", dist);
      target.style.transform = transform;
    },
    handleWarp({ target, transform }) {
      console.log("onWarp", transform);
      target.style.transform = transform;
    },
    handlePinch({ target }) {
      console.log("onPinch", target);
    }
  },

  computed: {
    mapHeight() {
      return this.minimizing || this.$store.state.minimizing
        ? "Maximize map"
        : "Minimize map";
    },
    heightClass() {
      if (this.minimizing || this.$store.state.minimizing) {
        return "minimized";
      } else {
        return "";
      }
    }
  },

  mounted() {
    const self = this;
    axios
      .get("https://coronavirus-tracker-api.herokuapp.com/v2/locations")
      .then(function(response) {
        const numbOfConfirmed = [];
        self.coronaCases = response.data.locations;
        const actualCases = undefined;

        response.data.locations.forEach(function(item) {
          numbOfConfirmed.push(item.latest.confirmed);
          let el = L.latLng(
            item.coordinates.latitude,
            item.coordinates.longitude
          );
          self.markers.push(el);
        });
        const maxNumber = Math.max(...numbOfConfirmed);
        const minNumber = Math.min(...numbOfConfirmed);
        const width =
          300 - (250 * (minNumber - actualCases)) / (maxNumber - minNumber);
      });
    axios
      .get("https://coronavirus-tracker-api.herokuapp.com/v2/latest")
      .then(function(response) {
        self.totalCases = response.data.latest;
      });
  },

  popup(item) {
    return item;
  }
};
</script>
<style lang="scss" scoped>
h1 {
  font-size: 60px;
}
.vue2leaflet-map {
  overflow: hidden;
  position: relative;
}
.minimized {
  height: 20vh !important;
  overflow: hidden;
  transition: all 1s;
}
.header {
  display: flex;
  justify-content: space-between;
  text-align: left;
  @media (max-width: 780px) {
    flex-wrap: wrap;
    justify-content: center;
  }
  h1 {
    color: red;
  }

  .total {
    text-align: right;
    @media (max-width: 780px) {
      text-align: center;
    }

    h3 {
      color: red;
    }
  }
}
.minimized-button {
  position: absolute;
  right: 10px;
  top: 10px;
  color: white;
  z-index: 99999;
  cursor: pointer;
  font-weight: bold;
}
.moveable {
  height: 100%;
  width: 80%;
  margin: 0 auto;
}
</style>

