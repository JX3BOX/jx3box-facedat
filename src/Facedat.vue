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
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                v-model="facedata['tBone'][key]"
                                :disabled="lock"
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
                                v-model="facedata['tBone'][key]"
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
                                v-model="facedata['tBone'][key]"
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
                                v-model="facedata['tBone'][key]"
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
                            <ul class="u-decals">
                                <li v-show="!clean || checkDecalProp(key)">
                                    <div class="u-title">{{ dict[key]['desc'] }}</div>
                                    <img
                                        class="u-pic"
                                        :src="getDecalIcon(key,cleandata['tDecal'][key]['nShowID'])"
                                    />
                                    <span
                                        class="u-dname"
                                    >{{getDecalName(key,cleandata['tDecal'][key]['nShowID'])}}</span>
                                    <span
                                        class="u-dcolor"
                                    >(颜色:{{cleandata['tDecal'][key]['nColorID']}})</span>
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
        <div class="c-facedat-setting">
            <el-form
                class="c-facedat-setting-form"
                ref="form"
                label-width="80px"
                label-position="left"
            >
                <!-- <el-form-item label="导出">
                    <el-radio-group v-model="client">
                        <el-radio label="std">正式服</el-radio>
                        <el-radio label="origin">怀旧服</el-radio>
                    </el-radio-group>
                </el-form-item>-->
                <el-form-item label="高级">
                    <el-checkbox v-model="clean">清洗付费部位</el-checkbox>
                    <span class="u-tip">
                        （
                        <i class="el-icon-warning-outline"></i> 仅保留创建新角色时可用项）
                    </span>
                </el-form-item>
            </el-form>
        </div>
        <div class="c-facedata-btns">
            <el-button
                class="u-btn"
                type="primary"
                @click="buildData('std')"
                icon="el-icon-receiving"
            >导出正式服</el-button>
            <el-button
                class="u-btn"
                type="warning"
                @click="buildData('origin')"
                icon="el-icon-receiving"
            >导出怀旧服</el-button>
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
import decalorigin from "../assets/data/decal_origin.json";
import decalstd from "../assets/data/decal_std.json";
import decalprop from "../assets/data/decal_prop.json";
import decaldefault from "../assets/data/decal_default.json";
import std_decal_default from "../assets/data/std_decal_default.json";

import Bus from "./bus.js";
import { format } from "lua-json";
import { saveAs } from "file-saver";
import versions from "../assets/data/version.json";

export default {
    name: "Facedat",
    props: ["data", "lock"],
    data: function () {
        return {
            active: "eye",

            // 数据
            body_type: "",
            facedata: "",

            // 骨骼
            group,
            dict,
            bonerange,

            // 妆容
            decalgroup,

            // 导出设置
            clean: false,
            version: "std",

            // test
            // data : JSON.stringify(olddata)
        };
    },
    computed: {
        ready: function () {
            return !!(this.facedata && this.decalmap);
        },
        cleandata: function () {
            if (this.clean && this.facedata) {
                let _cleandata = _.cloneDeep(this.facedata);
                for (let key in _cleandata.tDecal) {
                    let CanUseInCreate = this.showDecalFree(
                        key,
                        _cleandata?.tDecal[key]["nShowID"]
                    );
                    if (!CanUseInCreate) {
                        _cleandata.tDecal[key]["nShowID"] = decaldefault["nShowID"][key];
                    }
                }
                return _cleandata;
            } else {
                return this.facedata;
            }
        },
        // 自动检测数据版本
        client: function () {
            let _nMajorVersion = this.facedata?.nMajorVersion;
            if (_nMajorVersion == 1 || !_nMajorVersion) {
                return "std";
            } else {
                return "origin";
            }
        },
        decalmap: function () {
            if (this.client == "std" || !this.client) {
                return decalstd;
            } else {
                return decalorigin;
            }
        },
        output_std: function () {
            let data = this.amendVersion('std')
            // 默认需要修订版本号与客户端版本
            if (this.clean) {
                // 正式服数据包含全部属性（shadow1~4），且有额外属性值（fValue1~3）
                // 直接取一个demo数据，以防上传的是怀旧服数据缺失部分属性
                data.tDecal = std_decal_default
            }
            return data;
        },
        output_origin: function () {
            // 默认需要修订版本号与客户端版本
            let data = this.amendVersion('origin')
            for (let key in data.tDecal) {
                if (decalgroup.origin.includes(key)) {
                    // 2.重置color和show_id
                    data.tDecal[key]["nColorID"] = decaldefault['nColorID'][key];
                    data.tDecal[key]["nShowID"] = decaldefault['nShowID'][key];
                    // 3.移除正式服特有属性（fValue1~3）
                    for (let prop in data.tDecal[key]) {
                        if (!decalprop.origin.includes(prop)) {
                            delete data.tDecal[key][prop];
                        }
                    }
                // 1.首先移除正式服特有的部分属性（shadow1~4）
                } else {
                    delete data.tDecal[key];
                }
            }
            return data;
        },
        output: function () {
            let table = {};
            let data =
                this.version == "origin" ? this.output_origin : this.output_std;
            try {
                table = format(data);
            } catch (e) {
                console.log("导出转换失败");
                console.log(e);
            }
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
        cleandata: {
            deep: true,
            handler: function () {
                this.$forceUpdate();
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
            return ~~this.decalmap?.[this.body_type]?.[dict[key]?.type]?.[val]
                ?.CanUseInCreate;
        },
        showDecalPrice: function (key, val) {
            return ~~this.decalmap?.[this.body_type]?.[dict[key]?.type]?.[val]
                ?.CoinPrice;
        },
        checkDecalProp: function (key) {
            return decalgroup.origin.includes(key);
        },

        // 按钮
        buildData: function (v) {
            this.version = v;
            let blob = new Blob([this.output], {
                type: "application/dat;charset=utf-8",
            });
            saveAs(blob, Date.now() + ".dat");
        },

        // 数据转换
        amendVersion : function (v){
            let data = _.cloneDeep(this.cleandata);
            data.nDecorationID = 0;
            data.nMajorVersion = versions[v]["nMajorVersion"];
            data.nVersion = versions[v]["nVersion"];
            return data
        },
    },
    mounted: function () {
        this.render();
    },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>
