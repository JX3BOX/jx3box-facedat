<template>
    <!-- eslint-disable-next-line vue/no-mutating-props -->
    <div class="jx3box-facedat">
        <div class="c-facedat-tab">
            <el-radio-group v-model="active">
                <el-radio-button class="u-filter" value="contour">{{ fdT("facedat.face.new.tabs.contour") }}</el-radio-button>
                <el-radio-button class="u-filter" value="eyebrow">{{ fdT("facedat.face.new.tabs.eyebrow") }}</el-radio-button>
                <el-radio-button class="u-filter" value="eye">{{ fdT("facedat.face.new.tabs.eye") }}</el-radio-button>
                <el-radio-button class="u-filter" value="nose">{{ fdT("facedat.face.new.tabs.nose") }}</el-radio-button>
                <el-radio-button class="u-filter" value="mouth">{{ fdT("facedat.face.new.tabs.mouth") }}</el-radio-button>
                <el-radio-button class="u-filter" value="decals">{{ fdT("facedat.face.new.tabs.decals") }}</el-radio-button>
            </el-radio-group>
            <slot></slot>
        </div>
        <div class="c-facedat-preivew">
            <div class="c-facedat-group" v-show="active === 'contour'">
                <el-tabs v-model="subActive.contour" :type="tab_type">
                    <el-tab-pane :label="newFaceLabel(item)" :name="item" v-for="(item, index) in Object.keys(new_face_dict['轮廓'])"
                        :key="index">
                        <ul class="u-list u-new" v-for="(subItem, itemIndex) in Object.keys(new_face_dict['轮廓'][item])"
                            :key="itemIndex">
                            <template v-if="subItem === 'root'">
                                <li v-for="(key, i) in new_face_dict['轮廓'][item].root" :key="key + i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                            <li v-if="subItem !== 'root'" class="u-sub-title">{{ newFaceLabel(subItem) }}</li>
                            <template v-if="subItem !== 'root'">
                                <li v-for="(key, i) in new_face_dict['轮廓'][item][subItem]" :key="i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="c-facedat-group" v-show="active === 'eyebrow'">
                <el-tabs v-model="subActive.eyebrow" :type="tab_type">
                    <el-tab-pane :label="newFaceLabel(item)" :name="item" v-for="(item, index) in Object.keys(new_face_dict['眉毛'])"
                        :key="index">
                        <ul class="u-list u-new" v-for="(subItem, itemIndex) in Object.keys(new_face_dict['眉毛'][item])"
                            :key="itemIndex">
                            <template v-if="subItem === 'root'">
                                <li v-for="(key, i) in new_face_dict['眉毛'][item].root" :key="key + i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                            <li v-if="subItem !== 'root'" class="u-sub-title">{{ newFaceLabel(subItem) }}</li>
                            <template v-if="subItem !== 'root'">
                                <li v-for="(key, i) in new_face_dict['眉毛'][item][subItem]" :key="i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="c-facedat-group" v-show="active === 'eye'">
                <el-tabs v-model="subActive.eye" :type="tab_type">
                    <el-tab-pane :label="newFaceLabel(item)" :name="item" v-for="(item, index) in Object.keys(new_face_dict['眼部'])"
                        :key="index">
                        <ul class="u-list u-new" v-for="(subItem, itemIndex) in Object.keys(new_face_dict['眼部'][item])"
                            :key="itemIndex">
                            <template v-if="subItem === 'root'">
                                <li v-for="(key, i) in new_face_dict['眼部'][item].root" :key="key + i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                            <li v-if="subItem !== 'root'" class="u-sub-title">{{ newFaceLabel(subItem) }}</li>
                            <template v-if="subItem !== 'root'">
                                <li v-for="(key, i) in new_face_dict['眼部'][item][subItem]" :key="i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="c-facedat-group" v-show="active === 'nose'">
                <el-tabs v-model="subActive.nose" :type="tab_type">
                    <el-tab-pane :label="newFaceLabel(item)" :name="item" v-for="(item, index) in Object.keys(new_face_dict['鼻子'])"
                        :key="index">
                        <ul class="u-list u-new" v-for="(subItem, itemIndex) in Object.keys(new_face_dict['鼻子'][item])"
                            :key="itemIndex">
                            <template v-if="subItem === 'root'">
                                <li v-for="(key, i) in new_face_dict['鼻子'][item].root" :key="key + i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                            <li v-if="subItem !== 'root'" class="u-sub-title">{{ newFaceLabel(subItem) }}</li>
                            <template v-if="subItem !== 'root'">
                                <li v-for="(key, i) in new_face_dict['鼻子'][item][subItem]" :key="i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="c-facedat-group" v-show="active === 'mouth'">
                <el-tabs v-model="subActive.mouth" :type="tab_type">
                    <el-tab-pane :label="newFaceLabel(item)" :name="item" v-for="(item, index) in Object.keys(new_face_dict['嘴部'])"
                        :key="index">
                        <ul class="u-list u-new" v-for="(subItem, itemIndex) in Object.keys(new_face_dict['嘴部'][item])"
                            :key="itemIndex">
                            <template v-if="subItem === 'root'">
                                <li v-for="(key, i) in new_face_dict['嘴部'][item].root" :key="key + i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                            <li v-if="subItem !== 'root'" class="u-sub-title">{{ newFaceLabel(subItem) }}</li>
                            <template v-if="subItem !== 'root'">
                                <li v-for="(key, i) in new_face_dict['嘴部'][item][subItem]" :key="i">
                                    <label>{{ newFaceLabel(key.BoneName) }}</label>
                                    <span>{{ facedata["tBone"][key.BoneType] }}</span>
                                    <Slider v-if="lock" class="u-range kk" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :label="newFaceLabel(key.BoneName)">
                                    </Slider>
                                    <el-slider v-else class="u-range" :min="-128" :max="128"
                                        v-model="facedata['tBone'][key.BoneType]" :disabled="lock"></el-slider>
                                </li>
                            </template>
                        </ul>
                    </el-tab-pane>
                </el-tabs>
            </div>
            <div class="c-facedat-group" id="decals" v-show="active === 'decals'">
                <el-tabs v-model="subActive.decals" :type="tab_type">
                    <el-tab-pane :label="newDecalGroupLabel(item)" :name="item" v-for="(item, index) in Object.keys(new_decal_group['妆容'])"
                        :key="index">
                        <template v-for="(subItem, itemIndex) in new_decal_group['妆容'][item]" :key="itemIndex">
                            <ul v-if="facedata.tDecal[subItem.DecalsType].bUse" class="u-decals">
                            <li class="u-decal-item">
                                <div class="u-decal-main">
                                    <img class="u-pic" :alt="decalDb.getDecalName(subItem.DecalsType, facedata.tDecal[subItem.DecalsType]['nShowID'], true)" :src="decalDb.getDecalIcon(
                                        subItem.DecalsType,
                                        facedata.tDecal[subItem.DecalsType]['nShowID'],
                                        true
                                    )
                                        " />
                                    <div class="u-decal-copy">
                                        <strong class="u-decal-name">
                                            {{
                                                decalDb.getDecalName(
                                                    subItem.DecalsType,
                                                    facedata.tDecal[subItem.DecalsType]["nShowID"],
                                                    true
                                                )
                                            }}
                                        </strong>
                                        <span class="u-dname">
                                            {{ fdT("facedat.common.colorNumber", { value: facedata.tDecal[subItem.DecalsType].nColorID }) }}
                                        </span>
                                    </div>
                                </div>
                                <div class="u-decal-details">
                                    <span class="u-decals-params is-param-1">
                                        <span>{{ newFaceLabel(subItem.Name1) }}</span>
                                        <span>{{ facedata.tDecal[subItem.DecalsType].fValue1.toFixed(2) }}</span>
                                    </span>
                                    <span class="u-decals-params is-param-2" v-if="!subItem.bValueXY && subItem.bShowScroll2">
                                        <span>{{ newFaceLabel(subItem.Name2) }}</span>
                                        <span>{{ facedata.tDecal[subItem.DecalsType].fValue2.toFixed(2) }}</span>
                                    </span>
                                    <span class="u-decals-params is-param-3" v-if="!subItem.bValueXY && subItem.bShowScroll3">
                                        <span>{{ newFaceLabel(subItem.Name3) }}</span>
                                        <span>{{ facedata.tDecal[subItem.DecalsType].fValue3.toFixed(2) }}</span>
                                    </span>
                                    <span class="u-decals-params is-param-2" v-if="subItem.bValueXY">
                                        <span>{{ fdT("facedat.common.xCoordinate") }}</span>
                                        <span>{{ facedata.tDecal[subItem.DecalsType].fValue2.toFixed(2) }}</span>
                                    </span>
                                    <span class="u-decals-params is-param-3" v-if="subItem.bValueXY">
                                        <span>{{ fdT("facedat.common.yCoordinate") }}</span>
                                        <span>{{ facedata.tDecal[subItem.DecalsType].fValue3.toFixed(2) }}</span>
                                    </span>
                                </div>
                                <span class="u-price" v-if="
                                        decalDb.getDecalPrice(
                                            subItem.DecalsType,
                                            facedata.tDecal[subItem.DecalsType]['nShowID'],
                                            true
                                        )
                                    ">
                                    <el-icon>
                                        <Coin />
                                    </el-icon>
                                    {{
                                        decalDb.getDecalPrice(
                                            subItem.DecalsType,
                                            facedata.tDecal[subItem.DecalsType]["nShowID"],
                                            true
                                        )
                                    }}
                                    {{ fdT("facedat.common.coin") }}
                                </span>
                            </li>
                            </ul>
                        </template>
                    </el-tab-pane>
                </el-tabs>
                <div class="c-facedat-group">
                    <div class="u-decals u-decals-total">
                        <span class="u-title">{{ fdT("facedat.common.total") }}</span>
                        <span class="u-total u-price"><el-icon><Coin /></el-icon>
                            <b>{{ decalDb.getTotalPrice(facedata, true) }}</b> {{ fdT("facedat.common.coin") }}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import { Coin } from "@element-plus/icons-vue";
import Slider from "./Slider.vue";
import new_face_dict from "../assets/data/newface/ui.json";
import new_decal_group from "../assets/data/newface/decal.json";
import facedatI18nMixin from "./locale/mixin";
import { getNewDecalGroupKey, getNewFaceLabelKey } from "./locale/keys";
export default {
    name: "NewFace",
    mixins: [facedatI18nMixin],
    props: ["facedata", "lock", "decalDb", "body_type", "clean", "cleandata"],
    components: {
        Slider,
        Coin,
    },
    data() {
        return {
            tab_type: "card",
            active: "contour",
            subActive: {
                mouth: "整体",
                eye: "整体",
                nose: "整体",
                decals: "底妆",
                contour: "额头",
                eyebrow: "整体",
            },
            new_face_dict,
            new_decal_group,
        };
    },
    methods: {
        newFaceLabel(label) {
            const key = getNewFaceLabelKey(label);
            return key ? this.fdT(`facedat.terms.${key}`, {}, label) : label;
        },
        newDecalGroupLabel(label) {
            const key = getNewDecalGroupKey(label);
            return key ? this.fdT(`facedat.face.new.decalGroups.${key}`, {}, label) : label;
        },
    },
};
</script>

<style lang="less">
@import "../assets/css/facedat.less";
</style>
