<template>
    <div class="jx3box-facedat-upload c-facedat-upload">
        <div class="u-upload" v-if="support">
            <template v-if="!done">
                <input ref="fileInput" class="u-input" type="file" accept=".dat,.jx3dat,.ini" @change="uploadData" />
                <el-button class="u-btn" type="primary" @click="selectData" :icon="Upload">{{
                    btnText
                }}</el-button>
                <slot name="guide">
                    <a v-if="type === 'face'" class="u-help" href="/tool/746" target="_blank" rel="noopener noreferrer">
                        <el-icon>
                            <Collection />
                        </el-icon> {{ fdT("facedat.upload.guide") }}
                    </a>
                </slot>
            </template>
            <template v-else>
                <div class="u-result">
                    <el-button class="u-reset" @click="resetData" :icon="RefreshLeft">{{ fdT("facedat.upload.reset") }}</el-button>
                    <el-alert :title="fdT('facedat.upload.currentFile', { filename })" type="success" show-icon></el-alert>
                </div>
            </template>
        </div>
        <el-alert v-else class="u-notsupport" :title="fdT('facedat.upload.unsupportedTitle')" type="warning"
            :description="fdT('facedat.upload.unsupportedDescription')" show-icon></el-alert>
    </div>
</template>

<script>
import { markRaw } from "vue";
import { ElNotification } from "element-plus";
import { Upload, RefreshLeft, Collection } from "@element-plus/icons-vue";
import types from "../assets/data/index.json";
import { load } from "./DataRouter";
import facedatI18nMixin from "./locale/mixin";

export default {
    name: "Jx3boxUpload",
    mixins: [facedatI18nMixin],
    emits: ["success", "fail"],
    props: {
        type: {
            type: String,
            default: "",
        },
    },
    components: { Collection },
    data: function () {
        return {
            support: true,

            parsedType: "", //解析出的类型
            file: "", //文件对象
            json: "", //json data
            object: "", //js object

            done: false,
            types: types.bodyMap,

            // Element Plus 图标
            Upload: markRaw(Upload),
            RefreshLeft: markRaw(RefreshLeft),
        };
    },
    computed: {
        btnText() {
            if (this.type === "face") return this.fdT("facedat.upload.selectFace");
            if (this.type === "body") return this.fdT("facedat.upload.selectBody");
            return this.fdT("facedat.upload.selectAny");
        },
        filename: function () {
            return this.file && this.file.name;
        },
    },
    methods: {
        // 上传数据
        selectData: function () {
            this.$refs.fileInput?.click();
        },
        uploadData: function (e) {
            const file = e.target.files?.[0];
            if (!file) return;
            this.file = file;
            this.parseData(file);
        },
        // 读取与读取数据
        parseData: function (file) {
            if (!file) return; //空数据不读取
            const vm = this;

            // 读入 File 转 ArrayBuffer 进行读取
            const fr = new FileReader();
            fr.onload = function (e) {
                try {
                    const result = load(e.target.result);
                    if (!result) {
                        ElNotification.error({
                            title: vm.fdT("facedat.notification.errorTitle"),
                            message: vm.fdT("facedat.notification.parseFailed"),
                        });
                        vm.$emit("fail", { file: vm.file });
                        return;
                    }

                    if (vm.type === "face" && !result.type.startsWith("face")) {
                        ElNotification.error({
                            title: vm.fdT("facedat.notification.errorTitle"),
                            message: vm.fdT("facedat.notification.requireFace"),
                        });
                        vm.$emit("fail", { file: vm.file });
                        return;
                    }
                    if (vm.type === "body" && result.type !== "body") {
                        ElNotification.error({
                            title: vm.fdT("facedat.notification.errorTitle"),
                            message: vm.fdT("facedat.notification.requireBody"),
                        });
                        vm.$emit("fail", { file: vm.file });
                        return;
                    }

                    vm.parsedType = result.type;
                    vm.object = result.data;
                    if (!vm.object) throw new Error("Missing parsed data");

                    vm.json = JSON.stringify(vm.object);
                    const roleType = vm.object.nRoleType?.toString();
                    ElNotification({
                        title: vm.fdT("facedat.notification.successTitle"),
                        message: vm.fdT("facedat.notification.readSuccess", {
                            role: vm.fdT(
                                `facedat.common.roles.${roleType}`,
                                {},
                                vm.types[roleType]?.label || ""
                            ),
                            type: vm.fdT(`facedat.common.fileTypes.${vm.parsedType}`, {}, vm.parsedType),
                        }),
                        type: "success",
                    });
                    vm.done = true;
                    vm.$emit("success", {
                        type: vm.parsedType,
                        file: vm.file,
                        json: vm.json,
                        object: vm.object,
                    });
                } catch {
                    ElNotification.error({
                        title: vm.fdT("facedat.notification.errorTitle"),
                        message: vm.fdT("facedat.notification.cannotRead"),
                    });
                    vm.$emit("fail", { file: vm.file });
                }
            };
            fr.onerror = function () {
                ElNotification.error({
                    title: vm.fdT("facedat.notification.errorTitle"),
                    message: vm.fdT("facedat.notification.fileReadError"),
                });
                vm.$emit("fail", { file: vm.file });
            };
            fr.readAsArrayBuffer(file);
        },
        // 重置上传
        resetData: function () {
            this.done = false;

            this.file = "";
            this.parsedType = "";
            this.json = "";
            this.object = "";
            if (this.$refs.fileInput) this.$refs.fileInput.value = "";
            this.$emit("success", {
                file: "",
                json: "",
                object: "",
            });
        },
    },
    mounted: function () {
        this.support = !!window.FileReader;
    },
};
</script>

<style lang="less">
@import "../assets/css/tokens.less";

.c-facedat-upload {
    .u-tip {
        .fz(12px);
        color: var(--jx3-facedat-color-text-secondary);
    }

    .mt(20px);

    .u-input {
        .none;
    }

    .u-upload {
        .x;
    }

    .u-help {
        .fz(12px, 3);
        display: inline-flex;
        align-items: center;
        gap: 4px;
        max-width: 100%;
        color: var(--jx3-facedat-color-primary);
        text-decoration: underline;

        i {
            .fz(14px);
            .y(-1px);
        }
    }

    .u-btn {
        .db;
        margin: 0 auto;
        width: min(100%, 320px);
        min-height: 50px;
    }

    .u-file {
        .fz(14px, 2);
        color: var(--jx3-facedat-color-success);
        .bold;
    }

    .u-reset {
        .mb(10px);
    }

    .u-result {
        min-width: 0;
    }

    .el-alert {
        min-width: 0;
    }
}

@media screen and (max-width: 720px) {
    .c-facedat-upload {
        margin-top: 12px;

        .u-btn,
        .u-reset {
            min-height: 44px;
        }

        .u-reset {
            width: 100%;
        }

        .u-help {
            padding: 8px 0;
            line-height: 1.5;
        }
    }
}
</style>
