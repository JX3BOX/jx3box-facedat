<template>
    <div class="c-facedat-upload">
        <div class="u-upload" v-if="support">
            <template v-if="!done">
                <input class="u-input" type="file" id="face_file" accept=".dat,.jx3dat,.ini" @change="uploadData" />
                <el-button class="u-btn" type="primary" @click="selectData" icon="el-icon-upload2">{{
                    btnText
                }}</el-button>
                <slot name="guide">
                    <a v-if="type === 'face'" class="u-help" href="/tool/746" target="_blank">
                        <i class="el-icon-collection"></i> 游戏脸型导入导出指南
                    </a>
                </slot>
            </template>
            <template v-else>
                <div class="u-result">
                    <el-button class="u-reset" @click="resetData" icon="el-icon-refresh-left">清空重置</el-button>
                    <el-alert :title="'当前文件为：' + filename" type="success" show-icon></el-alert>
                </div>
            </template>
        </div>
        <el-alert
            v-else
            class="u-notsupport"
            title="浏览器不支持"
            type="warning"
            description="你的浏览器太老旧不支持本地读取,请更换chrome或其它现代浏览器"
            show-icon
        ></el-alert>
    </div>
</template>

<script>
import types from "../assets/data/index.json";
import { load } from "./DataRouter";

export default {
    name: "Upload",
    props: {
        type: {
            type: String,
            default: "",
        },
    },
    components: {},
    data: function () {
        return {
            support: true,

            parsedType: "", //解析出的类型
            file: "", //文件对象
            json: "", //json data
            object: "", //js object

            done: false,
            types: types.bodyMap,

            fileTypeNames: {
                face: "写意脸型",
                face_v2: "写实脸型",
                face_ini: "编辑器脸型",
                body: "体型",
            },
        };
    },
    computed: {
        btnText() {
            let txt = "上传脸型/体型数据";
            if (this.type === "face") {
                txt = "上传脸型数据";
            }
            if (this.type === "body") {
                txt = "上传体型数据";
            }
            return txt;
        },
        filename: function () {
            return this.file && this.file.name;
        },
    },
    methods: {
        // 上传数据
        selectData: function (i) {
            let fileInput = document.getElementById("face_file");
            fileInput.dispatchEvent(new MouseEvent("click"));
        },
        uploadData: function (e) {
            let file = e.target.files[0];
            this.file = file;
            this.parseData(file);
        },
        // 读取与读取数据
        parseData: function (file) {
            if (!file) return; //空数据不读取
            const vm = this;

            // 读入 File 转 ArrayBuffer 进行读取
            let fr = new FileReader();
            fr.onload = function (e) {
                console.log("文件读取成功...开始执行分析...");
                const result = load(e.target.result);
                if (!result) {
                    return vm.$notify.error({
                        title: "错误",
                        message: "数据类型解析失败",
                    });
                }

                if (result.type.startsWith("face") && vm.type && vm.type !== "face") {
                    return vm.$notify.error({
                        title: "错误",
                        message: "请导入脸型数据",
                    });
                }
                if (result.type === "body" && vm.type && vm.type !== "body") {
                    return vm.$notify.error({
                        title: "错误",
                        message: "请导入体型数据",
                    });
                }

                vm.parsedType = result.type;
                vm.object = result.data;

                // 读取成功才分析
                if (vm.object) {
                    try {
                        vm.json = JSON.stringify(vm.object);
                        console.log();
                        vm.$notify({
                            title: "成功",
                            message: `${vm.types[vm.object.nRoleType.toString()]?.label || ""}${
                                vm.fileTypeNames[vm.parsedType]
                            }数据读取成功`,
                            type: "success",
                        });
                        vm.done = true;
                        vm.$emit("success", {
                            type: vm.parsedType,
                            file: vm.file,
                            json: vm.json,
                            object: vm.object,
                        });
                    } catch (e) {
                        console.log(e);
                        vm.$notify.error({
                            title: "错误",
                            message: "无法读取数据",
                        });
                        vm.$emit("fail", {
                            file: vm.file,
                        });
                    }
                }
            };
            fr.onerror = function (e) {
                vm.$notify.error({
                    title: "错误",
                    message: "文件读取异常",
                });
            };
            fr.readAsArrayBuffer(file);
        },
        // 重置上传
        resetData: function () {
            this.done = false;

            this.file = "";
            this.json = "";
            this.object = "";
            this.$emit("success", {
                file: "",
                json: "",
                object: "",
            });
        },
    },
    filters: {},
    created: function () {},
    mounted: function () {
        this.support = !!window.FileReader;
    },
};
</script>

<style lang="less">
.c-facedat-upload {
    .u-tip {
        .fz(12px);
        color: #999;
    }
    .mt(20px);
    .u-input {
        .none;
    }
    .u-upload {
        .x;
    }
    .u-help {
        .fz(12px,3);
        color: @color-link;
        .underline(@color-link);
        i {
            .fz(14px);
            .y(-1px);
        }
    }
    .u-btn {
        .db;
        margin: 0 auto;
        .size(200px,50px);
    }
    .u-file {
        .fz(14px,2);
        color: #49c10f;
        .bold;
    }
    .u-reset {
        .mb(10px);
    }
}
</style>
