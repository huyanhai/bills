import Vue from "vue";
import App from "./App";
Vue.config.productionTip = false;
// import "@vant/weapp/dist/common/style";

App.mpType = "app";

const app = new Vue({
  ...App,
});
app.$mount();
