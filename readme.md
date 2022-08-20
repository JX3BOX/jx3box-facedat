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
<Facedat :data="json" :lock="false"/>
```

## 测试地址
1. 应用页
2. 新数据渲染页
3. 旧数据渲染页

## 数据构建
1. 本地数据库构建，默认使用facedecals__作为主
2. decal__作为价格补充列
3. 导入gb2313，关联RoleType/Type/ShowID
4. 导出csv
5. 执行`npm run face`生成json

## Todo
涉及项目：app、share
1. 根据游戏版本进程，需要更新version.json
2. 根据游戏更新贴花，需要更新raw内容并重新build，同时更新使用项目库
