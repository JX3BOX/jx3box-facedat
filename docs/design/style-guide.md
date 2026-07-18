# Facedat 主题与样式规范

## 1. 文档状态

组件已建立 `assets/css/tokens.less` 主题系统，原先散落的主色、文本色、表面色和状态色已收敛为包级 CSS 变量。本文记录当前实现和后续扩展规则。

主题改造只调整展示，不改变 Face/Body 数据结构、解析器或导出逻辑。

## 2. 样式作用域

所有公共样式必须位于包级根节点之下。当前根类：

```text
.jx3box-facedat
.jx3box-facedat-upload
```

Face、Body、OldFace、NewFace 的内部类可以继续保留，但不得新增裸全局覆盖：

- `.u-title`、`.u-btn`、`.u-list`；
- `.el-*`；
- `body`、`html`。

Element Plus 覆盖至少从 `.jx3box-facedat` 或 `.jx3box-facedat-upload` 开始，避免组件包污染宿主站点。

## 3. 主题能力边界

主题优先通过 CSS 自定义属性开放，而不是通过 Vue props 逐项传色值。宿主应能在组件祖先节点覆盖变量：

```css
.my-facedat-theme {
    --jx3-facedat-color-primary: #2563eb;
}
```

组件不负责持久化主题、不读取 `localStorage`，也不切换宿主的全站暗色模式。宿主只需传递 class 或在祖先作用域设置变量。

## 4. 当前令牌

令牌使用 `--jx3-facedat-*` 前缀，名称表达语义而不是当前色值。

### 4.1 品牌与状态色

```css
--jx3-facedat-color-primary: #6b52ff;
--jx3-facedat-color-primary-soft: color-mix(in srgb, var(--jx3-facedat-color-primary) 8%, transparent);
--jx3-facedat-color-success: #49c10f;
--jx3-facedat-color-warning: #fb6701;
--jx3-facedat-color-danger: #ff3838;
--jx3-facedat-color-price: #fba524;
```

### 4.2 表面与文本

```css
--jx3-facedat-color-surface: #ffffff;
--jx3-facedat-color-surface-muted: #f3f3f3;
--jx3-facedat-color-border: #e8e8e8;
--jx3-facedat-color-text: #111827;
--jx3-facedat-color-text-secondary: #6b7280;
--jx3-facedat-color-value: var(--jx3-facedat-color-primary);
```

### 4.3 尺寸与形状

```css
--jx3-facedat-radius-sm: 5px;
--jx3-facedat-radius-md: 10px;
--jx3-facedat-control-height: 40px;
--jx3-facedat-content-gap: 16px;
--jx3-facedat-transition: 160ms ease;
```

首轮只抽取已经重复出现或需要宿主覆盖的值。单个业务尺寸不要为了“完整”提前变成令牌。

## 5. Element Plus 联动

组件根节点应将本包主色映射到 Element Plus 变量：

```css
.jx3box-facedat,
.jx3box-facedat-upload {
    --el-color-primary: var(--jx3-facedat-color-primary);
}
```

如 Element Plus 的 hover/light 色阶不能自动满足要求，可以补充 `--el-color-primary-light-*`，但必须全部限定在组件根节点内。

不要修改 Element Plus 全局 SCSS 配置来实现单个 Facedat 主题，否则宿主其他模块会被一并改变。演示页继续加载 Element Plus 默认 CSS，组件库不重复打包第二份全局主题。

## 6. 当前样式迁移表

| 当前字面量 | 主要位置 | 目标令牌 |
| --- | --- | --- |
| `#6b52ff` / `#6B52FF` | Tab、Slider | `color-primary` |
| `#6b52ff0d` | 妆容背景 | `color-primary-soft` |
| 主题色 | 参数值 | `color-value`（指向 `color-primary`） |
| `#49c10f` | 免费/成功 | `color-success` |
| `#fba524` | 通宝价格 | `color-price` |
| `#ff3838` | 数据清洗按钮 | `color-danger` |
| `#fff` | 表面、按钮文字 | `color-surface` / 明确的反色文字变量 |
| `#8d8d8d`、`#999`、`#555` | 次要文字 | `color-text-secondary`，必要时再细分 |
| `#e8e8e8`、`#f3f3f3` | Slider/Tab 背景 | `color-border` / `color-surface-muted` |

`Slider.vue` 已移除内嵌 SVG，轨道、中心线和数值条均直接使用 CSS 变量。

## 7. 样式文件职责

当前结构：

```text
assets/css/
├── tokens.less       # 默认 CSS 变量和 Element Plus 映射
└── facedat.less      # Face/Body 共用结构与响应式规则
```

当前实现遵循：

- `Bodydat.vue`、`OldFace.vue`、`NewFace.vue` 不再各复制 `.c-facedat-tab`；
- 同一规则只维护一份，通过修饰类表达 Face/Body 差异；
- 第三方覆盖有根作用域；
- 组件专有样式保留在组件内时也使用主题变量。

## 8. 交互状态

- Hover 只在支持精细指针的设备上增强，不作为唯一反馈；
- Active 使用主色背景与清晰文字对比；
- Focus-visible 必须有可见轮廓，不能只依赖 Element Plus 默认行为被覆盖后消失；
- Disabled 不响应 hover，并保持数值可读；
- 状态不能只靠颜色表达，“免费”“错误”“价格”等仍保留文本或图标。

建议：

```css
@media (hover: hover) and (pointer: fine) {
    /* hover-only feedback */
}

@media (prefers-reduced-motion: reduce) {
    /* disable non-essential transitions */
}
```

## 9. 暗色主题

暗色模式不是当前已有能力。若本轮确认支持，应使用显式主题作用域：

```css
[data-jx3-facedat-theme="dark"] {
    /* override semantic tokens */
}
```

不要仅依赖 `prefers-color-scheme` 强制改变嵌入组件，因为宿主页面可能仍处于亮色。宿主可自行把系统偏好映射为上述属性。

暗色验收必须覆盖表面、文字、边框、Tab、Slider、弹窗、通知图标和图片占位，不能只翻转背景与文字。

## 10. 验收

- 默认视觉与改造前基本一致；
- 覆盖 `--jx3-facedat-color-primary` 后，Tab、自定义 Slider 和 Element Plus 主按钮同步变化；
- 不产生影响宿主其他 `.el-*` 组件的全局规则；
- CSS 中不再散落可主题化的主色字面量；
- 亮/暗表面（如支持）满足基本对比度；
- Hover、focus、disabled、active 状态完整；
- 主题切换不改变布局尺寸，不触发数据重新解析。

## 11. 首轮迁移检查表

- [x] 添加统一根类和默认 tokens。
- [x] 映射 Element Plus 主色变量。
- [x] 合并三个组件重复的 Tab 样式。
- [x] 替换公共样式和组件中的可主题化颜色。
- [x] 将 Slider 改为纯 CSS 变量轨道，并兼容 `value/modelValue`。
- [x] 限定 Element Plus 覆盖作用域。
- [ ] 暗色主题不在本轮范围，后续按显式主题作用域扩展。
