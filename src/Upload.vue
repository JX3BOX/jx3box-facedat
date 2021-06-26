<template>
    <div class="c-facedat-upload">
        <el-form
            class="c-facedat-upload-form"
            ref="form"
            label-width="80px"
            :label-position="labelPosition"
        >
            <el-form-item label="版本">
                <el-radio-group v-model="client">
                    <el-radio label="std">正式服</el-radio>
                    <el-radio label="origin">怀旧服</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="高级">
                <el-checkbox v-model="clean">清洗付费部位</el-checkbox>
                <span class="u-tip">
                    （
                    <i class="el-icon-warning-outline"></i> 仅保留创建新角色时可用项）
                </span>
            </el-form-item>
        </el-form>
        <div class="c-facedat-upload-primary">
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
                    <el-button
                        class="u-btn"
                        type="info"
                        @click="resetData"
                        icon="el-icon-refresh-left"
                    >清空重置</el-button>
                    <p class="u-file">{{ filename }}</p>
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
    </div>
</template>

<script>
const { parse } = require("lua-json");
export default {
    name: "UploadFacedat",
    props: [],
    components: {},
    data: function () {
        return {
            client: "std",
            clean: false,

            labelPosition: "left",
            support: true,

            file : '',  //文件对象
            lua : '',   //lua table
            json : '',  //json data
            object : '',  //js object

            done : false
        };
    },
    computed: {
        filename : function (){
            return this.file && this.file.name
        }
    },
    methods: {
        // 重置数据
        resetData : function (){
            this.done = false  
        },
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

            if(!bin) return //空数据不解析

            const vm = this;

            let fr = new FileReader();
            fr.readAsText(bin);
            fr.onload = function (e) {
                console.log("读取成功...开始执行分析...");

                let origin = e.target.result;
                let lua = "return" + origin.slice(origin.indexOf("{"));
                this.lua = lua      //lua table

                try {
                    vm.object = parse(lua)
                    vm.json = JSON.stringify(vm.data);
                    vm.$notify({
                        title: "成功",
                        message: "脸型数据解析成功",
                        type: "success",
                    });

                    vm.done = true
                    this.$emit('success',{
                        file : vm.file,
                        lua : vm.lua,
                        json : vm.json,
                        object : vm.object,
                        client : vm.client,
                        clean : vm.clean
                    })

                } catch (e) {
                    vm.$notify.error({
                        title: "错误",
                        message: "无法解析脸型数据",
                    });
                    this.$emit('fail',{
                        file : vm.file,
                        lua : vm.lua
                    })
                }
            };
            fr.onerror = function (e) {
                vm.$notify.error({
                    title: "错误",
                    message: "文件读取异常",
                });
            };
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
}
.c-facedat-upload-form {
    border: 1px dashed @border-hr;
    padding: 20px;
    background-color: @bg-light;

    .el-form-item__label {
        color: #999;
    }
}
.c-facedat-upload-primary {
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
        i{
            .fz(14px);
            .y(-1px);
        }
    }
    .u-btn {
        .db;
        margin: 0 auto;
        .size(200px,50px);
    }
    .u-file{
        .fz(14px,2);
        color: #49c10f;
        .bold;
    }
}
</style>