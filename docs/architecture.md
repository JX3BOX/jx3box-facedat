# 项目架构与业务边界

## 1. 项目定位

`@jx3box/jx3box-facedat` 是 Vue 3 + Element Plus 的捏脸/体型数据组件包。它读取剑网 3 的 `.dat`、`.jx3dat`、`.ini` 文件，识别数据类型，展示参数，并在允许时重新导出游戏数据。

本仓库不是完整业务站点：没有 Vue Router、Vuex、接口页面或独立的终端分流。宿主项目通过源码路径导入组件，当前 README 中的典型用法是 `Upload.vue` + `Facedat.vue`。

相邻的 PVX、Mobile 项目不仅直接导入本包 Vue 组件，还会直接导入 `DataRouter`、`DecalDatabase`、`Slider.vue` 和 `assets/data` 下的 JSON。因此现阶段这些源码路径和数据结构也构成事实上的外部接口，整理包入口之前不能直接移动或删除。

## 2. 入口与公共组件

| 文件 | 当前职责 |
| --- | --- |
| `src/main.js` | 本地演示页入口，创建 Vue 应用并安装 Element Plus |
| `src/App.vue` | 演示上传、自动识别并切换 Face/Body 展示 |
| `index.js` | 包入口，导出并注册 `Facedat`、`Bodydat`、`Upload`、`Slider`，可合并 i18n 词条 |
| `src/Upload.vue` | 文件选择、解析、类型校验及结果事件 |
| `src/Facedat.vue` | 捏脸数据总入口，识别写意/写实并管理导出 |
| `src/Bodydat.vue` | 体型数据展示与导出 |
| `src/OldFace.vue` | 写意脸型参数与贴花展示 |
| `src/NewFace.vue` | 写实脸型参数与妆容展示 |
| `src/Slider.vue` | 锁定状态下的只读数值轨道 |

包入口已经提供四个公共组件和 locale 工具。为兼容现有 PVX/Mobile 使用方式，当前源码路径导入仍需保持可用。

## 3. 数据流

```text
用户文件
  -> Upload.vue / FileReader
  -> DataRouter.load(ArrayBuffer)
  -> KData 解包与 GBK 解码
  -> Lua / INI 类型探测
  -> FaceINIConverter 或 BodyConverter
  -> { type, file, json, object }
  -> Facedat / Bodydat
  -> OldFace / NewFace / Slider
  -> 可选导出：KData.dump + file-saver
```

`Upload` 的 `success` 事件是展示链路的主要输入，载荷结构为：

```js
{
    type: "face" | "face_v2" | "face_ini" | "body",
    file: File,
    json: String,
    object: Object,
}
```

清空时仍通过 `success` 事件发送空载荷，这是现有兼容行为。

## 4. 数据源分类

### 4.1 协议与映射数据

以下内容参与解析、序列化、字段映射或游戏版本兼容，改造 UI 时不得翻译键名、重命名字段或改变数值：

- `assets/data/face/*.json` 中的类型键、骨骼键、贴花键和默认值；
- `assets/data/body/body_fields_forward.json`、`body_fields_reverse.json`；
- `assets/data/index.json` 中的角色 ID、文件名映射和版本值；
- `raw/` 下的游戏原始数据；
- `tools/` 下的数据生成脚本。

### 4.2 UI 元数据

部分 JSON 同时包含稳定标识和中文展示文案，例如：

- `body_group_tabs.json`：`value` 是稳定标识，`label` 是展示文案；
- `body_group_fields.json`：字段键是稳定标识，`name`、`tip` 是展示文案；
- `face/dict.json`：对象键和 `type` 是业务标识，`desc` 是展示文案；
- `newface/ui.json`：`BoneType` 是业务标识，分类键和 `BoneName` 当前兼任展示文案；
- `newface/decal.json`：`DecalsType` 和开关字段是业务数据，分类键、`ClassName`、`Name1~3` 是展示文案。

i18n 改造应在渲染层根据稳定标识查语言包，第一阶段不直接重写这些生成数据，避免破坏工具链。

### 4.3 远程与用户数据

`DecalDatabase` 先同步读取本地 JSON，再并行从 OSS 更新并写入 `sessionStorage`。远程贴花/装饰名称属于数据源内容，默认原样展示；若产品要求翻译，需要另建稳定 ID 映射，不能把远程中文直接当语言键。

文件名、用户选择的文件和解析出的数值同样保持原样。

## 5. 样式与构建现状

- Vue CLI 5 构建，组件使用 Options API。
- `vue.config.js` 为所有 LESS 自动注入 `csslab/base.less` 和 `@jx3box/jx3box-common/css/var.less`。
- 演示入口引入 Element Plus 默认 CSS 和 common 的 normalize。
- `assets/css/tokens.less` 提供主题变量，`assets/css/facedat.less` 集中维护 Face/Body 结构与响应式规则。
- `.jx3box-facedat` / `.jx3box-facedat-upload` 限定主题与 Element Plus 覆盖作用域。
- `src/locale` 提供四语言词条、宿主合并和无宿主时的内置回退。
- 手机端已完成 Tab、参数行、贴花/妆容卡片、操作区与弹窗的第一轮适配。

## 6. 改造保护范围

三项 UI 改造不得改变：

- 文件类型探测顺序和 `DataRouter.load` 返回结构；
- KData 头部、CRC、GBK 编解码规则；
- Face/Body 字段映射、默认值补全和正式服/怀旧服导出逻辑；
- `success`、`fail` 事件名及现有 props 的含义；
- `lock` 为真时只读、为假时可编辑的交互语义；
- 远程数据失败时回退本地数据的行为。

可以在兼容前提下逐步补充明确的 props、emits 声明、语言能力、主题变量和响应式根类。

## 7. 已知技术债

第一轮改造已修复清洗计算隐式依赖、Slider `value/modelValue` 不匹配、NewFace 可编辑字段键错误和无效 `getNewDecal` 方法。剩余技术债包括：

- `NewFace.vue` 模板高度重复，后续可以数据驱动化，但不应与第一轮词条迁移同时大改；
- 解析器和数据路由仍有较多调试日志；
- 仓库没有自动化单元测试，也缺少可直接上传的写实脸型 demo；
- PVX/Mobile 中仍存在复制的移动端展示组件，尚未迁移到本包响应式组件；
- `keys.js` 仍需映射生成 JSON 中的中文元数据，长期应让生成脚本输出稳定语义 key。

这些问题应遵循“小步提交、每步可构建、解析导出回归优先”的原则处理。
