<template>
    <div class="c-facedat-upload">
        <div class="u-upload" v-if="support">
            <template v-if="!done">
                <input class="u-input" type="file" id="face_file" @change="uploadData" />
                <el-button
                    class="u-btn"
                    type="primary"
                    @click="selectData"
                    icon="el-icon-upload2"
                >上传脸型数据</el-button>
                <a class="u-help" href="/tool/746" target="_blank">
                    <i class="el-icon-collection"></i> 游戏脸型导入导出指南
                </a>
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
            description="你的浏览器太老旧不支持本地解析,请更换chrome或其它现代浏览器"
            show-icon
        ></el-alert>
    </div>
</template>

<script>
import { parse } from "lua-json";
import Bus from "./bus.js";
export default {
    name: "Upload",
    props: [],
    components: {},
    data: function () {
        return {
            support: true,

            file: "", //文件对象
            lua: "", //lua table
            json: "", //json data
            object: "", //js object

            done: false,
        };
    },
    computed: {
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
        // 解析数据
        parseData: function (bin) {
            if (!bin) return; //空数据不解析

            const vm = this;

            let fr = new FileReader();
            fr.readAsText(bin);
            fr.onload = function (e) {
                console.log("读取成功...开始执行分析...");

                let origin = e.target.result;
                let lua = "return" + origin.slice(origin.indexOf("{"));
                vm.lua = lua; //lua table

                try {
                    vm.object = parse(lua);
                    vm.json = JSON.stringify(vm.object);
                    vm.$notify({
                        title: "成功",
                        message: "脸型数据解析成功",
                        type: "success",
                    });

                    vm.done = true;
                    vm.$emit("success", {
                        file: vm.file,
                        lua: vm.lua,
                        json: vm.json,
                        object: vm.object,
                    });
                } catch (e) {
                    vm.$notify.error({
                        title: "错误",
                        message: "无法解析脸型数据",
                    });
                    vm.$emit("fail", {
                        file: vm.file,
                        lua: vm.lua,
                    });
                }
            };
            fr.onerror = function (e) {
                vm.$notify.error({
                    title: "错误",
                    message: "文件读取异常",
                });
            };
        },
        // 重置上传
        resetData: function () {
            this.done = false;

            this.file = "";
            this.lua = "";
            this.json = "";
            this.object = "";
            this.$emit("success", {
                file: "",
                lua: "",
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