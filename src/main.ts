import "./assets/main.css";

import { createApp } from "vue";
import { createPinia } from "pinia";
import AppVm from "@/AppVm.vue";

const app = createApp(AppVm);

app.use(createPinia());
app.mount("#app");
