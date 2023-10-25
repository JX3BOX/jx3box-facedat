<template>
  <div class="c-facedat" v-if="ready">
    <el-tabs class="c-facedat-preivew" v-model="active" :type="tab_type">
      <el-tab-pane
        :label="tab.label"
        :name="tab.value"
        v-for="tab in Object.values(group_tabs)"
        :key="tab.value"
      >
        <div class="c-facedat-group">
          <ul class="u-list">
            <li v-for="(item, i) in currentGroup" :key="i">
              <label>{{ item.name }}</label>
              <span>{{ item.value }}</span>
              <el-slider
                class="u-range"
                :min="item.min"
                :max="item.max"
                v-model="body_data.tBody[item.key]"
                :disabled="lock"
              ></el-slider>
            </li>
          </ul>
        </div>
      </el-tab-pane>
    </el-tabs>
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

export default {
  name: "Bodydat",
  props: ["data", "lock", "tab_type"],
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
        this.body_type = body_data.nRoleType.toString();
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
</style>
