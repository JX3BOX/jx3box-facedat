<template>
    <div class="c-facedat" v-if="facedata">
        <el-tabs v-model="active" type="card">
            <el-tab-pane label="眼部轮廓" name="eye">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(eye, i) in eyes" :key="eye + i">
                            <label>{{ eye.desc }}</label>
                            <span>{{ eye.value }}</span>
                            <input
                                type="range"
                                :min="eye.min"
                                :max="eye.max"
                                :value="eye.value"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="嘴部轮廓" name="mouth">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(mouth, i) in mouthes" :key="mouth + i">
                            <label>{{ mouth.desc }}</label>
                            <span>{{ mouth.value }}</span>
                            <input
                                type="range"
                                :min="mouth.min"
                                :max="mouth.max"
                                :value="mouth.value"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="鼻子轮廓" name="nose">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(nose, i) in noses" :key="nose + i">
                            <label>{{ nose.desc }}</label>
                            <span>{{ nose.value }}</span>
                            <input
                                type="range"
                                :min="nose.min"
                                :max="nose.max"
                                :value="nose.value"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="脸部轮廓" name="face">
                <div class="c-facedat-group">
                    <ul class="u-list">
                        <li v-for="(face, i) in faces" :key="face + i">
                            <label>{{ face.desc }}</label>
                            <span>{{ face.value }}</span>
                            <input
                                type="range"
                                :min="face.min"
                                :max="face.max"
                                :value="face.value"
                                disabled
                            />
                        </li>
                    </ul>
                </div>
            </el-tab-pane>
            <el-tab-pane label="贴花" name="decal">
                <div class="m-facedat-decals" id="decals">
                    <div
                        class="c-facedat-group"
                        v-for="(decal, i) in decals"
                        :key="decal + i"
                    >
                        <h2 class="u-title">{{ decal.desc }}</h2>
                        <ul class="u-decals">
                            <li>
                                <img
                                    class="u-pic"
                                    :src="getDecalIcon(decal)"
                                    :title="decal.dname"
                                    :alt="decal.dname"
                                />
                                <span class="u-dname">{{
                                    getDecalName(decal)
                                }}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import _ from 'lodash'
import {
    __ossMirror,
    __iconPath,
    __ossRoot,
} from "@jx3box/jx3box-common/js/jx3box.json";
import decalmap from "@jx3box/jx3box-data/data/face/facedecals.json";
import format from "./format";
// import demo from "../demo/old.json";
// import demo from "../demo/new.json";
export default {
    name: "Facedat",
    props: ["data"],
    data: function () {
        return {
            active: "eye",

            eyes: [],
            mouthes: [],
            noses: [],
            faces: [],
            decals: [],

            facedata : this.data,
            role: "",
        };
    },
    computed : {
    },
    watch : {
        data : function (newdata){
            this.facedata = newdata
            this.render()
        }
    },
    methods: {
        getDecalName: function (item) {
            return  _.get(decalmap[this.role][item.type][item.value],"name") || '无';
        },
        getDecalIcon: function (item) {
            let iconid = _.get(decalmap[this.role][item.type][item.value],"iconid");
            if(iconid){
                return __iconPath + "icon/" + iconid + ".png";
            }else{
                return __iconPath + "icon/" + 'undefined' + ".png";
            }
            
        },
        render : function (){
            try{
                let facedata = JSON.parse(this.facedata);
                // 旧版数据
                if (facedata.status) {
                    this.role = facedata.misc[0]["value"];
                    // 新版数据
                } else {
                    this.role = facedata.nRoleType;
                    facedata = format(facedata);
                }

                this.eyes = facedata.eye;
                this.mouthes = facedata.mouth;
                this.noses = facedata.nose;
                this.faces = facedata.face;
                this.decals = facedata.decal;

            }catch(e){
                this.facedata = ''
                this.$notify.error({
                    title: "错误",
                    message: "脸型数据无法解析",
                });
            }
        }
    },
    mounted : function (){
        this.render()
    }
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>