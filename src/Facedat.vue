<template>
    <div class="c-facedat" v-if="ready">
        <el-tabs class="c-facedat-preivew" v-model="active" type="card">
            <el-tab-pane label="眼部轮廓" name="eye">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(key, i) in group['eye']" :key="key + i">
                            <label>{{ dict[key]["desc"] }}</label>
                            <span>{{ facedata["tBone"][key] }}</span>
                            <el-slider
                                class="u-range"
                                :min="bone_range[body_type][dict[key]['type']]['min']"
                                :max="bone_range[body_type][dict[key]['type']]['max']"
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
                            <label>{{ dict[key]["desc"] }}</label>
                            <span>{{ facedata["tBone"][key] }}</span>
                            <el-slider
                                class="u-range"
                                :min="bone_range[body_type][dict[key]['type']]['min']"
                                :max="bone_range[body_type][dict[key]['type']]['max']"
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
                            <label>{{ dict[key]["desc"] }}</label>
                            <span>{{ facedata["tBone"][key] }}</span>
                            <el-slider
                                class="u-range"
                                :min="bone_range[body_type][dict[key]['type']]['min']"
                                :max="bone_range[body_type][dict[key]['type']]['max']"
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
                            <label>{{ dict[key]["desc"] }}</label>
                            <span>{{ facedata["tBone"][key] }}</span>
                            <el-slider
                                class="u-range"
                                :min="bone_range[body_type][dict[key]['type']]['min']"
                                :max="bone_range[body_type][dict[key]['type']]['max']"
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
                                <li v-show="!clean || checkdecal_prop(key)">
                                    <div class="u-title">{{ dict[key]["desc"] }}</div>
                                    <img class="u-pic" :src="getDecalIcon(key, cleandata['tDecal'][key]['nShowID'])" />
                                    <span class="u-dname">{{ getDecalName(key, cleandata["tDecal"][key]["nShowID"]) }}</span>
                                    <span class="u-dcolor">(颜色:{{ cleandata["tDecal"][key]["nColorID"] }})</span>
                                    <span class="u-free" v-if="showDecalFree(key, cleandata['tDecal'][key]['nShowID'])"> <i class="el-icon-success"></i> 新建角色可用 </span>
                                    <span class="u-price" v-if="showDecalPrice(key, cleandata['tDecal'][key]['nShowID'])">
                                        <i class="el-icon-coin"></i>
                                        {{ showDecalPrice(key, cleandata["tDecal"][key]["nShowID"]) }} 通宝
                                    </span>
                                </li>
                            </ul>
                        </template>
                    </div>
                    <div class="c-facedat-group">
                        <ul class="u-decals">
                            <div class="u-title">总计</div>
                            <span class="u-total u-price"><i class="el-icon-coin"></i> <b>{{ total_coin }}</b> 通宝</span>
                        </ul>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
        <div class="c-facedat-setting">
            <el-form class="c-facedat-setting-form" ref="form" label-width="80px" label-position="left">
                <el-form-item label="高级">
                    <el-checkbox v-model="clean">清洗模式</el-checkbox>
                    <span class="u-warning"> <i class="el-icon-warning-outline"></i> 仅保留创建新角色时可用项，如提示非法数据也请尝试开启该模式 </span>
                </el-form-item>
            </el-form>
        </div>
        <div class="c-facedata-btns">
            <el-button class="u-btn" type="primary" @click="buildData('std')" icon="el-icon-receiving">导出正式服</el-button>
            <el-button class="u-btn" type="warning" @click="buildData('origin')" icon="el-icon-receiving">导出怀旧服</el-button>
        </div>
    </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import {
    __ossMirror,
    __iconPath,
    __ossRoot,
} from "@jx3box/jx3box-common/data/jx3box.json";
import fixOldData from "./fixOldData.js";

import group from "../assets/data/group.json";
import dict from "../assets/data/dict.json";
import decal_group from "../assets/data/decal_group.json";
import decal_origin from "../assets/data/decal_origin.json";
import decal_std from "../assets/data/decal_std.json";
import decal_prop from "../assets/data/decal_prop.json";
import bone_range from "../assets/data/bone_range.json";
import bone_default from "../assets/data/bone_default.json";
import decal_default from "../assets/data/decal_default.json";
import versions from "../assets/data/version.json";

import { format } from "lua-json";
import { saveAs } from "file-saver";
import { dumpFace } from "./faceParser.js";

export default {
    name: "Facedat",
    props: ["data", "lock"],
    data: function() {
        return {
            active: "eye",

            // 数据
            body_type: "",
            facedata: "",

            // 骨骼
            group,
            dict,
            bone_range,

            // 妆容
            decal_group,

            // 导出设置
            clean: false,
            version: "std",

            decalmap: '',

            // test
            // data : JSON.stringify(olddata)
        };
    },
    computed: {
        ready: function() {
            return !!(this.facedata && this.decalmap);
        },
        cleandata: function() {
            if (this.clean && this.facedata) {
                let _cleandata = _.cloneDeep(this.facedata);
                for (let key in _cleandata.tDecal) {
                    let CanUseInCreate = this.showDecalFree(key, _cleandata?.tDecal[key]["nShowID"]);
                    if (!CanUseInCreate) {
                        _cleandata.tDecal[key]["nShowID"] = decal_default[key]["nShowID"];
                    }
                }
                return _cleandata;
            } else {
                return this.facedata;
            }
        },
        // 自动检测数据版本
        client: function() {
            let _nMajorVersion = this.facedata?.nMajorVersion;
            if (_nMajorVersion == 1 || !_nMajorVersion) {
                return "std";
            } else {
                return "origin";
            }
        },
        /* decalmap: function() {
            if (this.client == "std" || !this.client) {
                return decal_std;
            } else {
                return decal_origin;
            }
        }, */
        output_std: function() {
            // 1.默认需要修订版本号与客户端版本
            let data = this.amendVersion("std");
            // 2.补全骨骼缺失数据
            data.tBone = this.amendBone(data.tBone);
            // 3.补全完整数据结构
            // 如果没有开启清洗也需要对数据结构进行补充，以防上传的是古老的数据（缺失部分后加的属性）
            // 同时部分古老数据即使存在该属性，但部分2级属性也是缺失的
            // data.tDecal = this.amendDecal(data.tDecal)

            // 废弃：如果开启了清洗直接回档整体默认贴花部分
            // 正式服数据包含全部属性（shadow1~4），且有额外属性值（fValue1~3）
            // 直接取一个demo数据，以防上传的是怀旧服数据缺失部分属性
            if (this.clean) {
                data.tDecal = _.cloneDeep(decal_default);
            }

            // 废弃：如果是清洗模式，还需要仅保留新建角色时存在的属性（移除shadow1~4等）
            // if (this.clean){
            //     for(let key in data.tDecal){
            //         if (!decal_group.origin.includes(key)) {
            //             delete data.tDecal[key];
            //         }
            //     }
            // }
            return data;
        },
        output_origin: function() {
            // 1.默认需要修订版本号与客户端版本
            let data = this.amendVersion("origin");
            // 2.补全骨骼缺失数据
            data.tBone = this.amendBone(data.tBone);

            // 3.贴花数据全部复位（怀旧服商城暂未上线）
            for (let key in data.tDecal) {
                if (decal_group.origin.includes(key)) {
                    // 3.2重置color和show_id
                    data.tDecal[key]["nColorID"] = decal_default[key]["nColorID"];
                    data.tDecal[key]["nShowID"] = decal_default[key]["nShowID"];
                    // 3.3移除正式服特有属性（fValue1~3）
                    for (let prop in data.tDecal[key]) {
                        if (!decal_prop.origin.includes(prop)) {
                            delete data.tDecal[key][prop];
                        }
                    }
                    // 3.1首先移除正式服特有的部分属性（shadow1~4）
                } else {
                    delete data.tDecal[key];
                }
            }
            return data;
        },
        output: function() {
            let table = {};
            let data = this.version == "origin" ? this.output_origin : this.output_std;
            try {
                table = "return " + format(data, { eol: "", spaces: 0 }).slice(6);
            } catch (e) {
                console.log("导出转换失败");
                console.log(e);
            }
            return table;
        },
        total_coin: function() {
            let sum = 0;
            for (const [_, key] of Object.entries(this.group["decal"])) if (this.cleandata["tDecal"][key]) sum += this.showDecalPrice(key, this.cleandata["tDecal"][key]["nShowID"]);
            return sum;
        },
    },
    watch: {
        data: {
            deep: true,
            handler: function(newdata) {
                this.render();
            },
        },
        cleandata: {
            deep: true,
            handler: function() {
                this.$forceUpdate();
            },
        },
        client: {
            immediate: true,
            handler: function(val) {
                this.fetchDecal();
            },
        },
    },
    methods: {
        // 数据构建
        render: function() {
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
        getDecalName: function(key, val) {
            return _.get(this.decalmap[this.body_type][dict[key]["type"]][val], "name") || "无";
        },
        getDecalIcon: function(key, val) {
            let iconid = _.get(this.decalmap[this.body_type][dict[key]["type"]][val], "iconid");
            if (iconid) {
                return __iconPath + "icon/" + iconid + ".png";
            } else {
                return __iconPath + "icon/" + "undefined" + ".png";
            }
        },
        showDecalFree: function(key, val) {
            return ~~this.decalmap?.[this.body_type]?.[dict[key]?.type]?.[val]?.CanUseInCreate;
        },
        showDecalPrice: function(key, val) {
            return ~~this.decalmap?.[this.body_type]?.[dict[key]?.type]?.[val]?.CoinPrice;
        },
        checkdecal_prop: function(key) {
            return decal_group.origin.includes(key);
        },

        // 按钮
        buildData: function(v) {
            this.version = v;
            let outputWithHeader = dumpFace(this.output);
            let blob = new Blob([outputWithHeader], {
                type: "application/dat;charset=utf-8",
            });
            saveAs(blob, Date.now() + ".dat");
        },

        // 数据修正
        amendVersion: function(v) {
            let data = _.cloneDeep(this.cleandata);
            data.nDecorationID = 0;
            data.nMajorVersion = versions[v]["nMajorVersion"];
            data.nVersion = versions[v]["nVersion"];
            return data;
        },
        amendBone: function(data) {
            let _bone = _.cloneDeep(bone_default);
            let _fixbone = Object.assign(_bone, data);
            return _fixbone;
        },
        amendDecal: function(data) {
            let _decal = _.cloneDeep(decal_default);
            for (let key in decal_default) {
                // 不存在补全属性
                if (!data[key]) {
                    data[key] = _.cloneDeep(decal_default[key]);
                    // 存在则补全子属性
                } else {
                    data[key] = Object.assign(decal_default[key], data[key]);
                }
            }
            return data;
        },
        fetchDecal: function (client = 'std') {
            let url = client === 'std' ? `${__ossMirror}data/face/decal_std.json` : `${__ossMirror}data/face/decal_origin.json`;
            try {
                // sessionStorage
                if (client === 'std') {
                    const decalmap = JSON.parse(sessionStorage.getItem('decal_std'));
                    if (decalmap) {
                        this.decalmap = decalmap;
                        return;
                    } else {
                        axios.get(url).then((res) => {
                            this.decalmap = res.data;
                            sessionStorage.setItem('decal_std', JSON.stringify(res.data));
                        });
                    }
                } else {
                    const decalmap = JSON.parse(sessionStorage.getItem('decal_origin'));
                    if (decalmap) {
                        this.decalmap = decalmap;
                        return;
                    } else {
                        axios.get(url).then((res) => {
                            this.decalmap = res.data;
                            sessionStorage.setItem('decal_origin', JSON.stringify(res.data));
                        });
                    }
                }
            } catch (e) {
                this.decalmap = '';
                console.log(e);
            }
        }
    },
    mounted: function() {
        this.render();
    },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>


