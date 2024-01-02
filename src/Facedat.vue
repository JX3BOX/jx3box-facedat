<template>
    <div class="c-facedat" v-if="ready">
        <NewFace
            :facedata="facedata"
            :body_type="body_type"
            :cleandata="cleandata"
            :clean="clean"
            :lock="lock"
            :decalDb="decalDb"
            v-if="decalDb && facedata.bNewFace"
        >
        </NewFace>
        <OldFace
            :facedata="facedata"
            :body_type="body_type"
            :cleandata="cleandata"
            :clean="clean"
            :lock="lock"
            :decalDb="decalDb"
            v-if="decalDb && !facedata.bNewFace"
        >
            <div
                class="u-clean-button"
                @click="
                    clean = true;
                    visible = !visible;
                "
            >
                数据清洗
            </div>
        </OldFace>
        <!--    <div class="c-facedat-setting">-->
        <!--      <el-form-->
        <!--        class="c-facedat-setting-form"-->
        <!--        ref="form"-->
        <!--        label-width="80px"-->
        <!--        label-position="left"-->
        <!--      >-->
        <!--        <el-form-item label="高级">-->
        <!--          <el-checkbox v-model="clean">清洗模式</el-checkbox>-->
        <!--          <span class="u-warning">-->
        <!--            <i class="el-icon-warning-outline"></i>-->
        <!--            仅保留创建新角色时可用项，如提示非法数据也请尝试开启该模式-->
        <!--          </span>-->
        <!--        </el-form-item>-->
        <!--      </el-form>-->
        <!--    </div>-->
        <el-dialog title="数据清洗" custom-class="m-data-clean" :visible.sync="visible" @close="clean = false">
            <div class="m-button">
                <el-button class="u-btn" type="primary" @click="buildData('std')" icon="el-icon-receiving"
                    >导出正式服</el-button
                >
                <el-button class="u-btn" type="warning" @click="buildData('origin')" icon="el-icon-receiving"
                    >导出怀旧服</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import _ from "lodash";
import axios from "axios";
import { __ossMirror, __iconPath, __ossRoot } from "@jx3box/jx3box-common/data/jx3box.json";
import fixOldData from "./fixOldData.js";
import decal_group from "../assets/data/face/decal_group.json";
import decal_prop from "../assets/data/face/decal_prop.json";
import bone_default from "../assets/data/face/bone_default.json";
import decal_default from "../assets/data/face/decal_default.json";
import versions from "../assets/data/face/version.json";

import { DecalDatabase } from "./DecalDatabase";
import { format } from "lua-json";
import { saveAs } from "file-saver";
import * as KData from "./KData";

import NewFace from "./NewFace";
import OldFace from "./OldFace";
export default {
    name: "Facedat",
    props: ["data", "lock", "tab_type"],

    data: function () {
        return {
            active: "eye",
            subActive: {
                mouth: "整体",
                eye: "整体",
                nose: "整体",
                decals: "底妆",
                contour: "额头",
                eyebrow: "整体",
            },
            // 数据
            body_type: "",
            facedata: "",
            visible: false,
            // 骨骼

            // 妆容

            // 导出设置
            clean: false,
            version: "std",

            decalDb: null,
            decalMap: "",
            decorationMap: "",
            totalPrice: "",
            // test
            // data
        };
    },
    components: {
        NewFace,
        OldFace,
    },
    computed: {
        ready: function () {
            return !!(this.facedata && this.decalDb.ready());
        },
        cleandata: function () {
            if (this.clean && this.facedata) {
                let _cleandata = _.cloneDeep(this.facedata);
                _cleandata.nDecorationID = 0;
                for (let key in _cleandata.tDecal) {
                    let CanUseInCreate = this.decalDb.getDecalIsFree(key, _cleandata.tDecal[key]["nShowID"]);
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
        client: function () {
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
        output_std: function () {
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
        output_origin: function () {
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
        output: function () {
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
        client: {
            immediate: true,
            handler: function (val) {
                let facedata = this.data.object;
                this.decalDb = new DecalDatabase(this.client, facedata.bNewFace);
            },
        },
    },
    methods: {
        // 数据构建
        render: function () {
            // 是否为空
            if (!this.data) {
                this.body_type = "";
                this.facedata = "";
                return;
            }

            // json 转为 object
            try {
                let facedata = this.data.object;
                // 旧版数据
                this.body_type = facedata.status ? facedata.misc[0]["value"] : facedata.nRoleType;
                this.decalDb.setBodyType(this.body_type);
                this.facedata = facedata.status ? fixOldData(facedata) : facedata;
                if (!this.facedata.bNewFace) {
                    this.totalPrice = this.decalDb.getTotalPrice(this.cleandata);
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

        // 按钮
        buildData: function (v) {
            this.version = v;
            let outputWithHeader = KData.dump(this.output);
            let blob = new Blob([outputWithHeader], {
                type: "application/dat;charset=utf-8",
            });
            saveAs(blob, Date.now() + ".dat");
        },

        // 数据修正
        amendVersion: function (v) {
            let data = _.cloneDeep(this.cleandata);
            data.nDecorationID = v === "origin" ? 0 : data.nDecorationID;
            data.nMajorVersion = versions[v]["nMajorVersion"];
            data.nVersion = versions[v]["nVersion"];
            return data;
        },
        amendBone: function (data) {
            let _bone = _.cloneDeep(bone_default);
            let _fixbone = Object.assign(_bone, data);
            return _fixbone;
        },
        amendDecal: function (data) {
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
        checkdecal_prop: function (key) {
            return decal_group.origin.includes(key);
        },
        clog(i) {
            console.log(i);
        },
        getNewDecal(decalType) {
            return new_decal_type[this.facedata.nRoleType][decalType][this.facedata.tDecal[decalType]["nShowID"]];
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
