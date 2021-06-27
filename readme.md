# Facedat
捏脸分析公共组件

## Step.1 Install
```
npm install --save @jx3box/jx3box-facedat
```  

## Step.2 Import
+ 引入模块
```javascript
import Upload from "@jx3box/jx3box-facedat/src/Upload.vue"
import Facedat from "@jx3box/jx3box-facedat/src/Facedat.vue"
```
## Step.3 Usage
+ 使用模块
```html
<Upload @success="handleSuccess"/>
<Facedat :data="data" :clean="true" client="std"/>
```

## 测试地址
1. 应用页
2. 新数据渲染页
3. 旧数据渲染页 //TODO: