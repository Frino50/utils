import { createApp } from "vue";
import "./assets/style.css";
import "./assets/color.css";
import App from "./App.vue";
import { validateDirective } from "./directives/validate.ts";

const app = createApp(App);
app.directive("validate", validateDirective);
app.mount("#app");
