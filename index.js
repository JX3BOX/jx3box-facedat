import Facedat from "./src/Facedat.vue";
import Bodydat from "./src/Bodydat.vue";
import Upload from "./src/Upload.vue";
import Slider from "./src/Slider.vue";
import { mergeFacedatLocaleMessages } from "./src/locale";

const components = {
  Facedat,
  Bodydat,
  Upload,
  Slider,
};

const install = function (app, options = {}) {
  if (options.i18n) mergeFacedatLocaleMessages(options.i18n);
  Object.keys(components).forEach((key) => {
    app.component(components[key].name, components[key]);
  });
};

export { Facedat, Bodydat, Upload, Slider };
export * from "./src/locale";

export default {
  install,
};
