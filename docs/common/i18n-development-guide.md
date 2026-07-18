# Facedat 国际化改造规范

## 1. 文档状态

项目已接入 `vue-i18n 9.x`，并提供包内语言包、宿主合并函数和无宿主 i18n 时的内置翻译回退。本文记录当前实现并约束后续词条维护。

项目是被 PVX、Mobile 等宿主直接引用源码的组件包，因此国际化必须满足两个条件：

- 语言由宿主应用统一决定，组件包不能擅自读取并覆盖全局语言；
- 包内词条由本包维护，宿主不应复制一份 Facedat 文案。

## 2. 当前运行时方案

使用与 JX3BOX Vue 3 项目一致的 `vue-i18n 9.x`，采用 legacy 模式兼容当前 Options API 模板中的 `$t` / `this.$t`。

当前结构：

```text
src/locale/
├── index.js       # locale 规范化、内置回退与宿主合并
├── mixin.js       # Options API 的 fdT / facedatLocale
├── keys.js        # 生成数据标签到稳定语义键的映射
├── zh-CN.js
├── zh-TW.js
├── en-US.js
└── vi.js
```

`src/locale/index.js` 已导出：

- 本包支持的 locale 列表；
- locale 规范化函数；
- 本包 messages；
- `mergeFacedatLocaleMessages(i18n)`，供已有 i18n 的宿主合并词条；
- `translateFacedat` 内置回退函数。

组件包不依赖 PVX 的 `src/locale`，也不把 `@jx3box/jx3box-ui` 作为运行前提。当前 `vue-i18n` 位于 dependencies，用于演示入口和宿主合并；发布构建应继续检查依赖去重，避免宿主出现两个运行时实例。

## 3. 语言来源与优先级

当前语言解析优先级：

1. 公共组件显式传入的 `locale`；
2. 宿主已安装的 vue-i18n 当前 locale；
3. `zh-CN` 回退语言。

组件内部不得直接读取 `localStorage.lang`。本地演示页可以读取它，但必须先规范化：

| 输入示例 | 包内 locale |
| --- | --- |
| `zh-cn`、`zh-CN` | `zh-CN` |
| `zh-tw`、`zh-HK` | `zh-TW` |
| `en`、`en-us` | `en-US` |
| `vi`、`vi-VN` | `vi` |

未知值回退到 `zh-CN`。Element Plus locale 由应用入口同步设置，普通业务组件不能各自安装 `ElConfigProvider`。

## 4. 词条命名

本包统一使用 `facedat` 命名空间，按业务语义分层：

```js
{
    facedat: {
        common: {},
        upload: {},
        face: {
            common: {},
            old: {},
            new: {},
        },
        body: {},
        notification: {},
    },
}
```

示例：

```text
facedat.upload.selectAny
facedat.upload.currentFile
facedat.notification.parseFailed
facedat.face.actions.clean
facedat.face.old.tabs.eye
facedat.face.new.tabs.contour
facedat.body.tabs.whole
facedat.common.currency.coin
```

词条按含义命名，不按视觉位置或组件行号命名。动态句子使用具名参数：

```js
this.$t("facedat.upload.currentFile", { filename: this.filename });
this.$t("facedat.upload.readSuccess", {
    role: roleLabel,
    type: fileTypeLabel,
});
```

禁止用多个翻译片段拼句子，否则英文、越南文无法调整语序。

## 5. 哪些内容需要翻译

### 5.1 必须进入语言包

- Upload 的按钮、帮助链接、空状态和文件结果；
- 所有通知标题、成功/失败消息；
- Face/Body 的一级 Tab、二级 Tab、字段显示名；
- “数据清洗”“导出正式服”“导出怀旧服”等操作；
- “颜色”“翻转”“新建角色可用”“总计”“通宝”等固定界面文案；
- 图片 alt、图标按钮 aria-label、弹窗标题；
- `DecalDatabase` 在找不到名称时返回的“无”；
- 演示页与 `public/index.html` 中用户可见的固定文案。

### 5.2 默认保持原样

- 文件名和用户数据；
- 骨骼键、贴花键、字段 ID、`type` 枚举值；
- 游戏数据中的数值和版本信息；
- 远程接口返回的贴花/装饰名称，除非产品提供稳定 ID 的正式翻译表；
- 日志、代码注释和开发错误对象。

日志不能直接作为界面提示展示。

## 6. JSON UI 元数据的迁移方式

当前多个生成 JSON 把中文当展示值甚至对象键。第一阶段不改生成文件结构，而是在渲染层用稳定标识映射词条。

### Body

- Tab 使用 `tab.value` 生成词条：`facedat.body.tabs.${tab.value}`；
- 字段使用字段键生成词条：`facedat.body.fields.${key}.name`；
- 提示使用：`facedat.body.fields.${key}.tip`。

不要继续渲染 `tab.label` 或 `field.name` 作为最终界面文案；它们只作为中文兼容回退。

### OldFace

- 骨骼字段以 `group` 中的键映射：`facedat.face.old.fields.${key}`；
- 贴花分类同样使用 `BASE`、`IRIS_LEFT` 等稳定键；
- 左右瞳的业务纠正应先确认数据含义，再把最终显示名放入语言包，不能在模板里继续交换中文字符串。

### NewFace

`newface/ui.json` 的分类目前以中文对象键组织，但叶子项有稳定 `BoneType`。当前实现：

- `keys.js` 显式把生成数据中的有限中文标签映射到 `facedat.terms.<semanticKey>`，不会直接拼接中文语言键；
- 一级分类使用代码侧稳定值 `contour`、`eyebrow`、`eye`、`nose`、`mouth`；
- 妆容分组使用显式稳定映射，参数名复用语义词条；
- 长期仍建议让生成脚本直接输出稳定 `key`，逐步移除中文源值映射。

禁止把中文内容本身直接拼成 i18n key。

## 7. 组件使用约定

当前代码使用 Options API，通过统一 mixin 的 `fdT` 访问宿主词条或包内回退：

```vue
<el-button>{{ fdT("facedat.face.actions.exportStd") }}</el-button>
```

脚本中使用 `this.fdT`：

```js
ElNotification.error({
    title: this.fdT("facedat.notification.errorTitle"),
    message: this.fdT("facedat.notification.faceParseFailed"),
});
```

原生回调里当前使用 `const vm = this`，通过 `vm.fdT` 访问词条。

缺键在开发环境应产生明确警告；生产环境回退到 `zh-CN`，不能把完整 key 展示给用户。

## 8. 公共包与宿主接入

推荐宿主在创建应用 i18n 后合并本包 messages：

```js
import { mergeFacedatLocaleMessages } from "@jx3box/jx3box-facedat/src/locale";

mergeFacedatLocaleMessages(i18n);
app.use(i18n);
```

导出路径和直接 `locale` prop 的用法已写入根 README，宿主无需复制词条。

本包的 `src/main.js` 演示入口需要安装同一套 i18n，并让 Element Plus 使用匹配 locale。库组件本身不负责修改 `document.documentElement.lang`，该职责属于宿主应用。

## 9. 验收

- 所有 locale 的叶子键结构一致，占位符名称一致；
- 切换语言后无需刷新即可更新 Facedat、Bodydat、Upload 和通知文案；
- Element Plus 与业务 locale 一致；
- 中文不再作为条件判断依据；
- 英文/越南文长文本不会撑破按钮、Tab、参数行和弹窗；
- 协议字段、解析结果与导出内容不因翻译变化；
- 宿主未复制本包词条，本包也未覆盖宿主的其他命名空间。

## 10. 首轮迁移检查表

- [x] 支持 `zh-CN`、`zh-TW`、`en-US`、`vi`，默认回退 `zh-CN`。
- [x] 添加 i18n 依赖和 `src/locale`。
- [x] 演示入口完成 i18n / Element Plus locale 联动。
- [x] 迁移 Upload、通知、Facedat/Bodydat 操作和一级 Tab。
- [x] 迁移 OldFace 稳定键映射。
- [x] 通过稳定语义映射迁移 NewFace 生成数据文案。
- [x] 处理 `DecalDatabase` 兜底文案。
- [x] 移除不再适用的 IE 静态中文提示。
- [x] 校验四种语言键结构和元数据映射完整性。
