<template>
  <div class="c-facedat" v-if="ready && group_tabs">
    <div class="c-facedat-tab">
      <el-radio-group v-model="active">
        <el-radio-button v-for="(tab, index) in cachedTabs" :key="index" class="u-filter"
          :label="tab.value">{{ tab.label }}</el-radio-button>
      </el-radio-group>
      <slot></slot>
    </div>
    <template v-for="tab in cachedTabs" :key="tab.value">
      <div class="c-facedat-preivew" v-show="active === tab.value">
        <div class="c-facedat-group">
          <ul class="u-list">
            <li v-for="(item, i) in currentGroup" :key="i">
              <label>{{ item.name }}</label>
              <span>{{ item.value }}</span>
              <slider class="u-range" :min="item.min" :max="item.max" v-model="body_data.tBody[item.key]"
                :disabled="lock"></slider>
            </li>
          </ul>
        </div>
      </div>
    </template>
    <div class="c-facedat-btns">
      <el-button class="u-btn" type="primary" @click="buildData" :disabled="!body_data"
        :icon="Download">导出正式服</el-button>
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { ElNotification } from "element-plus";
import { Download } from "@element-plus/icons-vue";
import { dump } from "./BodyConverter";
import { saveAs } from "file-saver";
import group_tabs from "../assets/data/body/body_group_tabs.json";
import group_fields from "../assets/data/body/body_group_fields.json";
import types from "../assets/data/index.json";
import field_range from "../assets/data/body/body_fields_reverse.json";
import Slider from "./Slider.vue";

export default {
  name: "Jx3boxBodydat",
  // props: 父组件传入的体型数据对象
  props: ["data", "lock", "tab_type"],
  components: { Slider },
  data: function () {
    return {
      // 当前选中的分组标签（默认值：全身）
      active: "whole",
      // 体型数据对象（解析后的 JSON 数据）
      body_data: "",
      // 当前体型类型（如 "1"=成男, "2"=成女 等）
      body_type: "",
      // 分组标签配置（从 JSON 文件导入）
      group_tabs,
      // 分组字段定义（从 JSON 文件导入）
      group_fields,
      // 字段取值范围配置（从 JSON 文件导入）
      field_range,
      // 体型类型映射表（从 index.json 导入）
      types: types.bodyMap,
      // Element Plus 图标
      Download,
    };
  },
  computed: {
    // 缓存分组标签数组，避免模板中重复调用 Object.values()
    cachedTabs: function () {
      return Object.values(this.group_tabs);
    },
    // 组件是否已准备好（已加载体型数据）
    ready: function () {
      return !!this.body_data;
    },
    // 当前体型的字段范围配置
    currentFieldRanges: function () {
      const bodyType = this.types[this.body_type];
      return bodyType ? field_range[bodyType.value] : {};
    },
    // 当前激活的分组标签内的字段定义
    currentGroupFields: function () {
      return this.group_fields[this.active] || {};
    },
    // 当前激活的分组标签内的控件信息（包含字段名、显示名、取值范围等）
    currentGroup: function () {
      if (!this.currentFieldRanges || !this.currentGroupFields) {
        return [];
      }
      return Object.keys(this.currentGroupFields)
        .filter((key) => this.currentFieldRanges[key]?.use_for_body_type)
        .map((key) => {
          const fieldRange = this.currentFieldRanges[key];
          return {
            key: key,
            name: this.currentGroupFields[key].name,
            min: fieldRange?.min ?? 0,
            max: fieldRange?.max ?? 100,
            use_for_body_type: fieldRange?.use_for_body_type ?? false,
            value: this.body_data?.tBody?.[key] ?? 0,
          };
        });
    },
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler() {
        this.render();
      },
    },
  },
  methods: {
    /**
     * 解析并渲染传入的体型数据
     * 从 props.data 中提取体型对象，并设置当前体型类型
     */
    render: function () {
      // 数据为空时，重置状态
      if (!this.data) {
        this.body_data = "";
        this.body_type = "";
        return;
      }

      // 尝试解析体型数据对象
      try {
        const bodyData = this.data?.object;
        if (!bodyData) {
          throw new Error("Missing body object");
        }
        // nRoleType 为体型类型标识（如 1=成男, 2=成女, 3=正太, 4=少女）
        this.body_type = bodyData.nRoleType?.toString() ?? "";
        this.body_data = bodyData;
      } catch (e) {
        this.body_data = "";
        this.body_type = "";
        // Vue 3 使用 ElNotification 替代 this.$notify
        ElNotification.error({
          title: "错误",
          message: "体型数据无法解析",
        });
      }
    },
    /**
     * 构建并导出体型数据为 .dat 文件
     * 使用 BodyConverter 将数据转换为游戏服务端格式
     */
    buildData: function () {
      if (!this.body_data) return;
      // 深拷贝避免修改原始数据
      const outputWithHeader = dump(_.cloneDeep(this.body_data));
      const blob = new Blob([outputWithHeader], {
        type: "application/dat;charset=utf-8",
      });
      saveAs(blob, Date.now() + ".dat");
    },
  },
  mounted() { },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";

.c-facedat-tab {
  .mt(20px);
  .mb(20px);

  .u-filter {
    white-space: nowrap;
    vertical-align: middle;

    .el-button,
    .el-checkbox-button__inner,
    .el-radio-button__inner {
      .fz(16px, 33px);
      padding: 0 20px 0 20px;
      margin: 10px 10px 0 10px;
      .db;
      .r(30px);
      color: #8d8d8d;
      border: 1px solid #fff;
      background-color: #fff;
      .bold(400);

      &:hover {
        color: #fff;
        background-color: #6b52ff;
        border-color: #6b52ff;
        .bold(400);
      }
    }

    .el-radio-button__orig-radio:checked+.el-radio-button__inner {
      background-color: #6b52ff;
      border-color: #6b52ff;
      color: #fff;
      .bold(400);
    }

  }
}
</style>
