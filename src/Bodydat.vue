<template>
  <div class="c-facedat" v-if="ready && group_tabs">
      <div class="c-facedat-tab">
          <el-radio-group v-model="active">
              <el-radio-button v-for="(tab, index) in Object.values(group_tabs)" :key="index" class="u-filter" :label="tab.value">{{ tab.label }}</el-radio-button>
          </el-radio-group>
          <slot></slot>
      </div>
      <template v-for="tab in Object.values(group_tabs)" >
        <div class="c-facedat-preivew" v-show="active === tab.value" :key="tab.value">
            <div class="c-facedat-group" >
              <ul class="u-list">
                <li v-for="(item, i) in currentGroup" :key="i">
                  <label>{{ item.name }}</label>
                  <span>{{ item.value }}</span>
                  <slider
                    class="u-range"
                    :min="item.min"
                    :max="item.max"
                    v-model="body_data.tBody[item.key]"
                    :disabled="lock"
                  ></slider>
                </li>
              </ul>
            </div>
        </div>
      </template>
    <div class="c-facedat-btns">
      <el-button
        class="u-btn"
        type="primary"
        @click="buildData"
        :disabled="!body_data"
        icon="el-icon-receiving"
        >导出正式服</el-button
      >
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import { dump } from "./BodyConverter";
import { saveAs } from "file-saver";
import group_tabs from "../assets/data/body/body_group_tabs.json";
import group_fields from "../assets/data/body/body_group_fields.json";
import types from "../assets/data/index.json";
import field_range from "../assets/data/body/body_fields_reverse.json";
import Slider from "./Slider.vue";

export default {
  name: "Bodydat",
  props: ["data", "lock", "tab_type"],
    components:{Slider},
  data: function () {
    return {
      active: "whole",
      body_data: "",
      body_type: "",
      group_tabs,
      group_fields,
      field_range,
      types: types.bodyMap,
    };
  },
  computed: {
    ready: function () {
      return !!this.body_data;
    },
    // 当前体型的字段范围
    currentFieldRanges() {
      return field_range[this.types[this.body_type].value];
    },
    // 当前激活的分组标签内的字段
    currentGroupFields() {
      return this.group_fields[this.active];
    },
    // 当前激活的分组标签内的控件信息
    currentGroup() {
      return Object.keys(this.group_fields[this.active])
        .filter((key) => this.currentFieldRanges[key].use_for_body_type)
        .map((key) => {
          return {
            key: key,
            ...this.currentGroupFields[key],
            ...this.currentFieldRanges[key],
            value: this.body_data.tBody[key],
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
    render() {
      // 是否为空
      if (!this.data) {
        this.body_data = "";
        this.body_type = "";
        return;
      }

      // json 转为 object
      try {
        let body_data = this.data.object;
        this.body_type = body_data.nRoleType && body_data.nRoleType.toString();
        this.body_data = body_data;
      } catch (e) {
        this.body_data = "";
        this.body_type = "";
        this.$notify.error({
          title: "错误",
          message: "体型数据无法解析",
        });
      }
    },
    buildData() {
      if (!this.body_data) return;
      const outputWithHeader = dump(_.cloneDeep(this.body_data));
      let blob = new Blob([outputWithHeader], {
        type: "application/dat;charset=utf-8",
      });
      saveAs(blob, Date.now() + ".dat");
    },
  },
  mounted() {},
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
        .el-radio-button__orig-radio:checked + .el-radio-button__inner {
            background-color: #6b52ff;
            border-color: #6b52ff;
            color: #fff;
            .bold(400);
        }
    }
}
</style>
