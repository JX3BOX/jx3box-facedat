<template>
    <div class="c-facedat" v-if="facedata">
        <el-tabs v-model="active" type="card">
            <el-tab-pane label="眼部轮廓" name="eye">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in bonegroup['eye']" :key="key + i">
                            <label>{{ bonemap[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][bonemap[key]['type']]['min']"
                                :max="bonerange[body_type][bonemap[key]['type']]['max']"
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
                            <label>{{ bonemap[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][bonemap[key]['type']]['min']"
                                :max="bonerange[body_type][bonemap[key]['type']]['max']"
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
                            <label>{{ bonemap[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][bonemap[key]['type']]['min']"
                                :max="bonerange[body_type][bonemap[key]['type']]['max']"
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
                            <label>{{ bonemap[key]['desc'] }}</label>
                            <span>{{ facedata['tBone'][key] }}</span>
                            <input
                                type="range"
                                :min="bonerange[body_type][bonemap[key]['type']]['min']"
                                :max="bonerange[body_type][bonemap[key]['type']]['max']"
                                :value="facedata['tBone'][key]"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <!-- <el-tab-pane label="贴花" name="decal">
                <div class="m-facedat-decals" id="decals">
                    <div class="c-facedat-group" v-for="(decal, i) in decals" :key="decal + i">
                        <h2 class="u-title">{{ decal.desc }}</h2>
                        <ul class="u-decals">
                            <li>
                                <img
                                    class="u-pic"
                                    :src="getDecalIcon(decal)"
                                    :title="decal.dname"
                                    :alt="decal.dname"
                                />
                                <span class="u-dname">
                                    {{
                                    getDecalName(decal)
                                    }}
                                </span>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-tab-pane> -->
        </el-tabs>
    </div>
</template>

<script>
import _ from "lodash";
import {
    __ossMirror,
    __iconPath,
    __ossRoot,
} from "@jx3box/jx3box-common/data/jx3box.json";
import decalmap from "@jx3box/jx3box-data/data/face/facedecals.json";
import fixOldData from "./fixOldData.js";

import bonegroup from '../assets/data/bone_group.json';
import bonemap from '../assets/data/bone_map.json';
import bonerange from '../assets/data/bone_range.json';

import olddata from '../demo/old.json'

export default {
    name: "Facedat",
    props: ["data","client","clean"],
    data: function () {
        return {
            active: "eye",
            body_type: "",
            facedata : '',
            
            // 骨骼
            bonegroup,
            bonemap,
            bonerange,

            // 妆容
            decalmap : "",

            // test
            // data : JSON.stringify(olddata)
        };
    },
    computed: {
        sClient : function (){
            return this.client || 'std'
        },
        bClean : function (){
            return this.clean || false
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
        // TODO:加载不同怀旧服\正式服的贴花
        getDecalName: function (item) {
            return (
                _.get(decalmap[this.role][item.type][item.value], "name") ||
                "无"
            );
        },
        getDecalIcon: function (item) {
            let iconid = _.get(
                decalmap[this.role][item.type][item.value],
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
            if(!this.data){
                return ''
            }

            // json 转为 object
            try {
                let facedata = JSON.parse(this.data);
                // 旧版数据
                if (facedata.status) {
                    this.body_type = facedata.misc[0]["value"];
                    this.facedata = fixOldData(facedata)
                }else{
                    this.body_type = facedata.nRoleType;
                    this.facedata = facedata
                }
            } catch (e) {
                this.facedata = ''
                console.log(e);
                this.$notify.error({
                    title: "错误",
                    message: "脸型数据无法解析",
                });
            }
        },
    },
    mounted: function () {
        this.build();
    },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>
