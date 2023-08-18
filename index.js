import Facedat from "./src/Facedat.vue";
import Bodydat from "./src/Bodydat.vue";

const components = {
  Facedat,
  Bodydat,
};

const install = function (Vue, Option) {
  Object.keys(components).forEach((key) => {
    Vue.component(components[key].name, components[key]);
  });
};

export default {
  install,
};
