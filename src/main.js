import { createApp } from "vue";
import { createI18n } from "vue-i18n";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import zhTw from "element-plus/es/locale/lang/zh-tw";
import en from "element-plus/es/locale/lang/en";
import vi from "element-plus/es/locale/lang/vi";
import "element-plus/dist/index.css";

// 通用基础样式
import "@jx3box/jx3box-common/css/normalize.css";

import App from "./App.vue";
import { facedatMessages, normalizeFacedatLocale } from "./locale";

const queryLocale = new URLSearchParams(window.location.search).get("lang");
const locale = normalizeFacedatLocale(queryLocale || window.localStorage.getItem("lang") || document.documentElement.lang);
const elementLocales = { "zh-CN": zhCn, "zh-TW": zhTw, "en-US": en, vi };
const i18n = createI18n({
    legacy: true,
    globalInjection: true,
    locale,
    fallbackLocale: "zh-CN",
    messages: facedatMessages,
});

// 创建 Vue 应用实例
const app = createApp(App);

document.documentElement.lang = locale;
app.use(i18n);

// 注册 Element Plus
app.use(ElementPlus, { locale: elementLocales[locale] });

// 挂载应用
app.mount("#app");
