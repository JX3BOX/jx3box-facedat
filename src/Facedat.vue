<template>
    <div class="jx3box-facedat c-facedat" v-if="ready">
        <NewFace :facedata="facedata" :body_type="body_type" :cleandata="cleandata" :clean="clean" :lock="lock"
            :decalDb="decalDb" :locale="facedatLocale" v-if="decalDb && facedata.bNewFace">
        </NewFace>
        <OldFace :facedata="facedata" :body_type="body_type" :cleandata="cleandata" :clean="clean" :lock="lock"
            :decalDb="decalDb" :locale="facedatLocale" v-if="decalDb && !facedata.bNewFace">
            <button type="button" class="u-clean-button" @click="
                clean = true;
            visible = !visible;
            ">
                {{ fdT("facedat.face.actions.clean") }}
            </button>
        </OldFace>
        <el-dialog :title="fdT('facedat.face.actions.clean')" class="m-data-clean" v-model="visible" @close="clean = false">
            <div class="m-button">
                <el-button class="u-btn" type="primary" @click="buildData('std')" :icon="Download">{{ fdT("facedat.face.actions.exportStd") }}</el-button>
                <el-button class="u-btn" type="warning" @click="buildData('origin')" :icon="Download">{{ fdT("facedat.face.actions.exportOrigin") }}</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { markRaw } from "vue";
import _ from "lodash";
import { ElNotification } from "element-plus";
import { Download } from "@element-plus/icons-vue";
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
import facedatI18nMixin from "./locale/mixin";
export default {
    name: "Jx3boxFacedat",
    mixins: [facedatI18nMixin],
    props: ["data", "lock", "tab_type"],

    data: function () {
        return {
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
            // Element Plus 图标
            Download: markRaw(Download),
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
        output_std: function () {
            // 1.默认需要修订版本号与客户端版本
            let data = this.amendVersion("std");
            // 2.补全骨骼缺失数据
            data.tBone = this.amendBone(data.tBone);
            // 3.补全完整数据结构
            if (this.clean) {
                data.tDecal = _.cloneDeep(decal_default);
            }
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
                } else {
                    delete data.tDecal[key];
                }
            }
            return data;
        },
        output: function () {
            const data = this.version == "origin" ? this.output_origin : this.output_std;
            return "return " + format(data, { eol: "", spaces: 0 }).slice(6);
        },
    },
    watch: {
        data: {
            immediate: true,
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
                this.body_type = "";
                this.facedata = "";
                this.decalDb = null;
                return;
            }

            // json 转为 object
            try {
                let facedata = this.data.object;
                // 旧版数据
                this.body_type = facedata.status ? facedata.misc[0]["value"] : facedata.nRoleType;
                this.facedata = facedata.status ? fixOldData(facedata) : facedata;
                this.decalDb = new DecalDatabase(this.client, this.facedata.bNewFace, {
                    t: (key, params, fallback) => this.fdT(key, params, fallback),
                });
                this.decalDb.setBodyType(this.body_type);
            } catch {
                this.facedata = "";
                this.decalDb = null;
                // Vue 3 使用 ElNotification 替代 this.$notify
                ElNotification.error({
                    title: this.fdT("facedat.notification.errorTitle"),
                    message: this.fdT("facedat.notification.faceParseFailed"),
                });
            }
        },

        // 按钮
        buildData: function (v) {
            try {
                this.version = v;
                const outputWithHeader = KData.dump(this.output);
                const blob = new Blob([outputWithHeader], {
                    type: "application/dat;charset=utf-8",
                });
                saveAs(blob, Date.now() + ".dat");
            } catch {
                ElNotification.error({
                    title: this.fdT("facedat.notification.errorTitle"),
                    message: this.fdT("facedat.notification.exportFailed"),
                });
            }
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
                    _decal[key] = _.cloneDeep(decal_default[key]);
                    // 存在则补全子属性
                } else {
                    _decal[key] = Object.assign(_decal[key], data[key]);
                }
            }
            return _decal;
        },
        checkdecal_prop: function (key) {
            return decal_group.origin.includes(key);
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>
