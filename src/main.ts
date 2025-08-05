import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import ElementPlus from "element-plus";
import Lazyload from "vue3-lazyload";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(ElementPlus, { size: "small", zIndex: 3000 });
app.use(Lazyload, {
  loading: "",
  error: "",
});
app.mount("#app");
