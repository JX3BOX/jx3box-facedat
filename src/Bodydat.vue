<template>
  <div class="c-facedat" v-if="ready">
    <el-tabs class="c-facedat-preivew" v-model="active" :type="tab_type">
      <el-tab-pane
        :label="tab.label"
        :name="tab.value"
        v-for="tab in tabs"
        :key="tab.value"
      >
        <div class="c-facedat-group">
          <ul class="u-list">
            <li v-for="(item, i) in currentGroup" :key="i">
              <label>{{ item.NameCH }}</label>
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
import { dump } from "./bodyParser.js";
import { saveAs } from "file-saver";
import group from "../assets/data/body/body_group.json";
import types from "../assets/data/index.json";
import fields from "../assets/data/body/body_fields_reverse.json";

export default {
  name: "Bodydat",
  props: ["data", "lock", "tab_type"],
  data: function () {
    return {
      active: "whole",
      body_data: "",
      body_type: "",
      group,
      types: types.bodyMap,
      tabs: [
        {
          value: "whole",
          label: "整体",
        },
        {
          value: "neck",
          label: "头颈",
        },
        {
          value: "body",
          label: "躯干",
        },
        {
          value: "arm",
          label: "上肢",
        },
        {
          value: "leg",
          label: "下肢",
        },
      ],
    };
  },
  computed: {
    ready: function () {
      return !!this.body_data;
    },
    currentFields() {
      return fields[this.types[this.body_type].value];
    },
    currentGroup() {
      return this.group[this.active]
        .map((key) => {
          return {
            ...this.currentFields[key],
            key: key,
            min: Number(this.currentFields[key].Min),
            max: Number(this.currentFields[key].Max),
            value: this.body_data.tBody[key],
          };
        })
        .filter((item) => item.IsUsedForBodyType);
    },
  },
  watch: {
    data: {
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
        let body_data = JSON.parse(this.data);
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
