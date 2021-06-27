<template>
    <div class="c-facedat" v-if="ready">
        <el-tabs class="c-facedat-preivew" v-model="active" type="card">
            <el-tab-pane label="眼部轮廓" name="eye">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in group['eye']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <el-slider
                                class="u-range"
                                v-model="facedata['tBone'][key]"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :disabled="lock"
                                size="mini"
                            ></el-slider>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="嘴部轮廓" name="mouth">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in group['mouth']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <el-slider
                                class="u-range"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :v-model="facedata['tBone'][key]"
                                :disabled="lock"
                            ></el-slider>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="鼻子轮廓" name="nose">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in group['nose']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <el-slider
                                class="u-range"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :v-model="facedata['tBone'][key]"
                                :disabled="lock"
                            ></el-slider>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="脸部轮廓" name="face">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in group['face']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <el-slider
                                class="u-range"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :v-model="facedata['tBone'][key]"
                                :disabled="lock"
                            ></el-slider>
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="贴花" name="decal">
                <div class="m-facedat-decals" id="decals">
                    <div class="c-facedat-group" v-for="(key, i) in group['decal']" :key="key + i">
                        <template v-if="cleandata['tDecal'][key]">
                            <h2 class="u-title">{{ dict[key]['desc'] }}</h2>
                            <ul class="u-decals">
                                <li>
                                    <img
                                        class="u-pic"
                                        :src="getDecalIcon(key,cleandata['tDecal'][key]['nShowID'])"
                                    />
                                    <span
                                        class="u-dname"
                                    >{{getDecalName(key,cleandata['tDecal'][key]['nShowID'])}}</span>
                                    <span
                                        class="u-free"
                                        v-if="showDecalFree(key,cleandata['tDecal'][key]['nShowID'])"
                                    >
                                        <i class="el-icon-success"></i> 新建角色可用
                                    </span>
                                    <span
                                        class="u-price"
                                        v-if="showDecalPrice(key,cleandata['tDecal'][key]['nShowID'])"
                                    >
                                        <i class="el-icon-coin"></i>
                                        {{showDecalPrice(key,cleandata['tDecal'][key]['nShowID'])}} 通宝
                                    </span>
                                </li>
                            </ul>
                        </template>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="c-facedata-btns">
            <el-button
                class="u-btn"
                @click="resetData"
                icon="el-icon-refresh-left"
                v-if="!readOnly"
            >清空重置</el-button>
            <el-button class="u-btn" type="success" @click="buildData" icon="el-icon-receiving">导出下载</el-button>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import {
    __ossMirror,
    __iconPath,
    __ossRoot,
    // __dataPath,
} from "@jx3box/jx3box-common/data/jx3box.json";
import fixOldData from "./fixOldData.js";

import group from "../assets/data/group.json";
import dict from "../assets/data/dict.json";
import bonerange from "../assets/data/bone_range.json";

// import olddata from '../demo/old.json'

// import axios from "axios";
import decalgroup from "../assets/data/decal_group.json";
import defaultdecal from "../assets/data/default_decal.json";
import decalorigin from "../assets/data/decal_origin.json";
import decalstd from "../assets/data/decal_std.json";

import Bus from "./bus.js";
import { format } from "lua-json";
import { saveAs } from "file-saver";
import versions from '../assets/data/version.json'

export default {
    name: "Facedat",
    props: ["data", "client", "clean", "lock", "readOnly"],
    data: function () {
        return {
            active: "eye",

            // 设置
            sClient: this.client || "std",
            bClean: this.bClean || false,

            // 数据
            body_type: "",
            facedata: "",

            // 骨骼
            group,
            dict,
            bonerange,

            // 妆容
            decalgroup,

            // test
            // data : JSON.stringify(olddata)
        };
    },
    computed: {
        ready: function () {
            return !!(this.facedata && this.decalmap);
        },
        cleandata: function () {
            if (this.bClean) {
                let cleandata = _.cloneDeep(this.facedata);
                for (let item in cleandata.tDecal) {
                    cleandata.tDecal[item]["nShowID"] = defaultdecal[item];
                }
                return cleandata;
            } else {
                return this.facedata;
            }
        },
        decalmap: function () {
            if (this.sClient == "std" || !this.sClient) {
                return decalstd;
            } else {
                return decalorigin;
            }
        },
        output: function () {
            // 校准版本号
            let data = _.cloneDeep(this.cleandata)
            data.nMajorVersion = versions[this.sClient]['nMajorVersion']
            data.nVersion = versions[this.sClient]['nVersion']
            // json转table
            let table = format(data);
            return table;
        },
    },
    watch: {
        data: {
            deep: true,
            handler: function (newdata) {
                this.render();
            },
        },
    },
    methods: {
        // 数据构建
        render: function () {
            // 是否为空
            if (!this.data) {
                return "";
            }

            // json 转为 object
            try {
                let facedata = JSON.parse(this.data);
                // 旧版数据
                if (facedata.status) {
                    this.body_type = facedata.misc[0]["value"];
                    this.facedata = fixOldData(facedata);
                } else {
                    this.body_type = facedata.nRoleType;
                    this.facedata = facedata;
                }
            } catch (e) {
                this.facedata = "";
                console.log(e);
                this.$notify.error({
                    title: "错误",
                    message: "脸型数据无法解析",
                });
            }
        },

        // 贴花
        getDecalName: function (key, val) {
            return (
                _.get(
                    this.decalmap[this.body_type][dict[key]["type"]][val],
                    "name"
                ) || "无"
            );
        },
        getDecalIcon: function (key, val) {
            let iconid = _.get(
                this.decalmap[this.body_type][dict[key]["type"]][val],
                "iconid"
            );
            if (iconid) {
                return __iconPath + "icon/" + iconid + ".png";
            } else {
                return __iconPath + "icon/" + "undefined" + ".png";
            }
        },
        showDecalFree: function (key, val) {
            return ~~_.get(
                this.decalmap[this.body_type][dict[key]["type"]][val],
                "CanUseInCreate"
            );
        },
        showDecalPrice: function (key, val) {
            return ~~_.get(
                this.decalmap[this.body_type][dict[key]["type"]][val],
                "CoinPrice"
            );
        },

        // 按钮
        resetData: function () {
            this.facedata = "";
            Bus.$emit("reset");
        },
        buildData: function () {
            let blob = new Blob([this.output], {
                type: "application/dat;charset=utf-8",
            });
            saveAs(blob, Date.now() + ".dat");
        },
    },
    mounted: function () {
        this.render();

        // 上传参数
        Bus.$on("update", (data) => {
            if (data) {
                this.bClean = data.clean;
                this.sClient = data.client;
            }
        });
    },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>
