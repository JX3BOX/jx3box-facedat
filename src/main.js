import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// 通用UI模块样式
import "@jx3box/jx3box-common/css/element.css";
import "@jx3box/jx3box-common/css/normalize.css";

import App from "./App.vue";

// 创建 Vue 应用实例
const app = createApp(App);

// 注册 Element Plus
app.use(ElementPlus);

// 挂载应用
app.mount("#app");
