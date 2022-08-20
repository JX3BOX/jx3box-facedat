<template>
    <div class="c-facedat-upload">
        <div class="u-upload" v-if="support">
            <template v-if="!done">
                <input class="u-input" type="file" id="face_file" accept=".dat,.jx3dat,.ini" @change="uploadData" />
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
import { parse as luaParse } from "lua-json";
import { parse as iniParse } from "ini";
import { buf as CRC32, str } from "crc-32";
import { convertIni } from "./iniConverter.js";
import Bus from "./bus.js";
export default {
    name: "Upload",
    props: [],
    components: {},
    data: function () {
        return {
            support: true,

            file: "", //文件对象
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
            const gbkEncoder = new TextEncoder("gbk");
            const gbkDecoder = new TextDecoder("gbk");

            let fr = new FileReader();
            fr.readAsArrayBuffer(bin);
            fr.onload = function (e) {
                console.log("读取成功...开始执行分析...");
                let stream = e.target.result;

                /* Parsing */
                try {
                    const sig = new Uint8Array(stream, 2, 2);
                    /* KD header */
                    if (sig[0] == 0x44 && sig[1] == 0x4B) { // "DK"
                        console.log("File is LuaTable with header");
                        const hashFlag = new Uint8Array(stream, 0, 1)[0];
                        const compressFlag = new Uint8Array(stream, 1, 1)[0];
                        if (compressFlag != 0x4E) { // "N"
                            console.log("Unknown compression method: " + compressFlag);
                            throw new Error("Compressed data is not supported");
                        }
                        const hash = new DataView(stream).getInt32(4, true);
                        const length1 = new DataView(stream).getInt32(8, true);
                        const length2 = new DataView(stream).getInt32(12, true);
                        const remainingLen = stream.byteLength - 16;
                        if (length1 != length2 || remainingLen != length1 || remainingLen != length2) {
                            console.log("Length mismatch: L1=" + length1 + " L2=" + length2 + " Actual=" + remainingLen);
                            setTimeout(() => vm.$notify.warn({
                                title: "警告",
                                message: "数据长度有误，将继续尝试解析",
                                type: "warning",
                            }), 0);
                        }
                        let payload = new Uint8Array(stream, 16, remainingLen);
                        if (hashFlag != 0x4E) { // "N", has hashing
                            let payloadHash = null;
                            if (hashFlag == 0x43) {  // "C"
                                payloadHash = CRC32(payload);
                            }
                            // Compare hash
                            if (hash != payloadHash) {
                                console.log("Hash mismatch: " + hash + " Actual=" + payloadHash);
                                setTimeout(() => vm.$notify.warning({
                                    title: "警告",
                                    message: "数据校验有误，将继续尝试解析",
                                    type: "warning",
                                }), 0);
                            }
                        }
                        payload = gbkDecoder.decode(payload);
                        vm.object = luaParse("return" + payload.slice(payload.indexOf("{")));
                    }
                    /* without header */
                    else {
                        console.log("No KD header detected");
                        const payload = gbkDecoder.decode(stream);
                        const luaData = luaParse("return" + payload.slice(payload.indexOf("{")));
                        if (luaData.length != 0) {
                            vm.object = luaData;
                            console.log("File is LuaTable without header");
                        }
                        else {
                            vm.object = convertIni(iniParse(payload));
                            console.log("File is INI");
                        }
                    }
                } catch (ex) {
                    console.log(ex);
                    vm.$notify.error({
                        title: "错误",
                        message: "无法解析脸型数据",
                    });
                    vm.$emit("fail", {
                        file: vm.file,
                    });
                }
                /* Parsing End */

                // 读取成功才分析
                if (vm.object) {
                    try {
                        vm.json = JSON.stringify(vm.object);
                        vm.$notify({
                            title: "成功",
                            message: "脸型数据解析成功",
                            type: "success",
                        });
                        vm.done = true;
                        vm.$emit("success", {
                            file: vm.file,
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