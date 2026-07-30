# @jx3box/jx3box-facedat

剑网 3 捏脸/体型数据解析、展示与导出组件，基于 Vue 3 和 Element Plus。

## 安装

```bash
npm install @jx3box/jx3box-facedat
```

## 按需使用

```js
import Upload from "@jx3box/jx3box-facedat/src/Upload.vue";
import Facedat from "@jx3box/jx3box-facedat/src/Facedat.vue";
import Bodydat from "@jx3box/jx3box-facedat/src/Bodydat.vue";
```

```vue
<Upload locale="zh-CN" @success="handleSuccess" />
<Facedat v-if="data.type?.startsWith('face')" :data="data" :lock="true" locale="zh-CN" />
<Bodydat v-if="data.type === 'body'" :data="data" :lock="false" locale="zh-CN" />
```

组件支持 `zh-CN`、`zh-TW`、`en-US`、`vi`。如果宿主已经安装 vue-i18n，组件会跟随宿主 locale；显式 `locale` prop 的优先级更高。宿主也可以统一合并本包词条：

```js
import { mergeFacedatLocaleMessages } from "@jx3box/jx3box-facedat/src/locale";

mergeFacedatLocaleMessages(i18n);
```

## 全量注册

```js
import FacedatPlugin from "@jx3box/jx3box-facedat";

app.use(FacedatPlugin, { i18n });
```

插件会注册 `Facedat`、`Bodydat`、`Upload` 和 `Slider`。

`Slider` 是只读数值展示组件，使用 `role="meter"`；可通过 `label` 提供无障碍名称。需要编辑数值时请使用
Element Plus Slider 或其他可交互控件。

## 主题

主题通过 CSS 变量覆盖，变量作用域限制在组件根节点，不影响宿主其他 Element Plus 组件：

```css
.my-facedat-theme {
    --jx3-facedat-color-primary: #2563eb;
    --jx3-facedat-color-success: #16a34a;
    --jx3-facedat-color-price: #d97706;
}
```

将该 class 放在组件祖先节点即可。完整变量见 `assets/css/tokens.less`。

## 事件载荷

`Upload` 解析成功后触发：

```js
{
    type: "face" | "face_v2" | "face_ini" | "body",
    file: File,
    json: String,
    object: Object,
}
```

## 数据构建

- `npm run face`：生成写意脸型数据；
- `npm run facev2`：生成写实脸型数据；
- `npm run body`：生成体型字段数据。

更完整的架构、i18n、主题和响应式规则见 [`docs/README.md`](./docs/README.md)。
