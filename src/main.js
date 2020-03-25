import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import VueAxios from "vue-axios";
import { BootstrapVue, IconsPlugin } from "bootstrap-vue";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import { Fake3dImageEffect } from "@luxdamore/vue-fake3d-image-effect";
import "@luxdamore/vue-fake3d-image-effect/dist/Fake3dImageEffect.css";
import Echarts from "vue-echarts";

import "echarts/lib/chart/bar";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";

Vue.component("chart", Echarts);

// Install
Vue.component(Fake3dImageEffect.name, Fake3dImageEffect);

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(VueAxios, axios);
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
