<template>
    <div class="c-facedat" v-if="ready">
        <el-tabs v-model="active" type="card">
            <el-tab-pane label="眼部轮廓" name="eye">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in bonegroup['eye']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :value="facedata['tBone'][key]"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="嘴部轮廓" name="mouth">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in bonegroup['mouth']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :value="facedata['tBone'][key]"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="鼻子轮廓" name="nose">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in bonegroup['nose']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :value="facedata['tBone'][key]"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="脸部轮廓" name="face">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in bonegroup['face']" :key="key + i">
                            <label>{{ dict[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][dict[key]['type']]['min']"
                                :max="bonerange[body_type][dict[key]['type']]['max']"
                                :value="facedata['tBone'][key]"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="贴花" name="decal">
                <div class="m-facedat-decals" id="decals">
                    <div class="c-facedat-group" v-for="(key, i) in decallist" :key="key + i">
                        <template v-if="facedata['tDecal'][key]">
                        <h2 class="u-title">{{ dict[key]['desc'] }}</h2>
                        <ul class="u-decals">
                            <li>
                                <img
                                    class="u-pic"
                                    :src="getDecalIcon(key,facedata['tDecal'][key]['nShowID'])"
                                />
                                <span class="u-dname">{{getDecalName(key,facedata['tDecal'][key]['nShowID'])}}</span>
                            </li>
                        </ul>
                        </template>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import _ from "lodash";
import {
    __ossMirror,
    __iconPath,
    __ossRoot,
    __dataPath,
} from "@jx3box/jx3box-common/data/jx3box.json";
import fixOldData from "./fixOldData.js";

import bonegroup from "../assets/data/bone_group.json";
import dict from "../assets/data/dict.json";
import bonerange from "../assets/data/bone_range.json";

// import olddata from '../demo/old.json'

import axios from "axios";
// import decalmap from "@jx3box/jx3box-data/data/face/facedecals.json";
import decalgroup from "../assets/data/decal_group.json";

export default {
    name: "Facedat",
    props: ["data", "client", "clean"],
    data: function () {
        return {
            active: "eye",
            body_type: "",
            facedata: "",

            // 骨骼
            bonegroup,
            dict,
            bonerange,

            // 妆容
            decalmap: "",
            decalgroup,

            // test
            // data : JSON.stringify(olddata)
        };
    },
    computed: {
        sClient: function () {
            return this.client || "std";
        },
        bClean: function () {
            return this.clean || false;
        },
        decallist: function () {
            return decalgroup['std'];
        },
        ready: function () {
            return this.facedata && this.decalmap;
        },
    },
    watch: {
        data: {
            deep: true,
            handler: function (newdata) {
                this.build();
            },
        },
    },
    methods: {
        getDecalName: function (key,val) {
            return (
                _.get(
                    this.decalmap[this.body_type][dict[key]['type']][val],
                    "name"
                ) || "无"
            );
        },
        getDecalIcon: function (key,val) {
            let iconid = _.get(
                this.decalmap[this.body_type][dict[key]['type']][val],
                "iconid"
            );
            if (iconid) {
                return __iconPath + "icon/" + iconid + ".png";
            } else {
                return __iconPath + "icon/" + "undefined" + ".png";
            }
        },
        build: function () {
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
        loadDecalData: function () {
            // TODO:贴花数据版本区分？
            axios.get(__dataPath + "data/face/facedecals.json").then((res) => {
                this.decalmap = res.data;
            });
        },
    },
    mounted: function () {
        this.build();
        this.loadDecalData();
    },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>
