<template>
    <!-- eslint-disable-next-line vue/no-mutating-props -->
    <div class="jx3box-facedat">
        <div class="c-facedat-tab">
            <el-radio-group v-model="active">
                <el-radio-button class="u-filter" value="eye">{{ fdT("facedat.face.old.tabs.eye") }}</el-radio-button>
                <el-radio-button class="u-filter" value="mouth">{{ fdT("facedat.face.old.tabs.mouth") }}</el-radio-button>
                <el-radio-button class="u-filter" value="nose">{{ fdT("facedat.face.old.tabs.nose") }}</el-radio-button>
                <el-radio-button class="u-filter" value="face">{{ fdT("facedat.face.old.tabs.face") }}</el-radio-button>
                <el-radio-button class="u-filter" value="decals">{{ fdT("facedat.face.old.tabs.decals") }}</el-radio-button>
            </el-radio-group>
            <slot></slot>
        </div>
        <div class="c-facedat-preivew">
            <div class="c-facedat-group" v-show="active === 'eye'">
                <ul class="u-list">
                    <li v-for="(key, i) in group['eye']" :key="key + i">
                        <label>{{ oldFieldLabel(key) }}</label>
                        <span>{{ facedata["tBone"][key] }}</span>
                        <slider v-if="lock" class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" :value="facedata['tBone'][key]">
                        </slider>
                        <el-slider v-else class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" v-model="facedata['tBone'][key]"
                            :disabled="lock"></el-slider>
                    </li>
                </ul>
            </div>
            <div class="c-facedat-group" v-show="active === 'mouth'">
                <ul class="u-list">
                    <li v-for="(key, i) in group['mouth']" :key="key + i">
                        <label>{{ oldFieldLabel(key) }}</label>
                        <span>{{ facedata["tBone"][key] }}</span>
                        <slider v-if="lock" class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" :value="facedata['tBone'][key]">
                        </slider>
                        <el-slider v-else class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" v-model="facedata['tBone'][key]"
                            :disabled="lock"></el-slider>
                    </li>
                </ul>
            </div>
            <div class="c-facedat-group" v-show="active === 'nose'">
                <ul class="u-list">
                    <li v-for="(key, i) in group['nose']" :key="key + i">
                        <label>{{ oldFieldLabel(key) }}</label>
                        <span>{{ facedata["tBone"][key] }}</span>
                        <slider v-if="lock" class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" :value="facedata['tBone'][key]">
                        </slider>
                        <el-slider v-else class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" v-model="facedata['tBone'][key]"
                            :disabled="lock"></el-slider>
                    </li>
                </ul>
            </div>
            <div class="c-facedat-group" v-show="active === 'face'">
                <ul class="u-list">
                    <li v-for="(key, i) in group['face']" :key="key + i">
                        <label>{{ oldFieldLabel(key) }}</label>
                        <span>{{ facedata["tBone"][key] }}</span>
                        <slider v-if="lock" class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" :value="facedata['tBone'][key]">
                        </slider>
                        <el-slider v-else class="u-range" :min="bone_range[body_type][dict[key]['type']]['min']"
                            :max="bone_range[body_type][dict[key]['type']]['max']" v-model="facedata['tBone'][key]"
                            :disabled="lock"></el-slider>
                    </li>
                </ul>
            </div>
            <div class="m-facedat-decals" id="newDecals" v-show="active === 'decals'">
                <div class="c-facedat-group" v-for="(key, i) in group['decal']" :key="key + i">
                    <template v-if="cleandata['tDecal'][key]">
                        <ul class="u-decals">
                            <li v-show="!clean || checkdecal_prop(key)">
                                <div class="u-title">
                                    {{ oldFieldLabel(key, true) }}
                                </div>

                                <span class="u-dname"><img class="u-pic" :alt="decalDb.getDecalName(key, cleandata['tDecal'][key]['nShowID'])"
                                        :src="decalDb.getDecalIcon(key, cleandata['tDecal'][key]['nShowID'])" />{{ decalDb.getDecalName(key, cleandata["tDecal"][key]["nShowID"]) }}</span>
                                <span class="u-dflip"
                                    v-if="decalDb.getDecalIsFlip(key, cleandata['tDecal'][key]['nShowID'])">({{ fdT("facedat.common.flipped") }})</span>
                                <span class="u-dcolor">({{ fdT("facedat.common.color", { value: cleandata["tDecal"][key]["nColorID"] }) }})</span>
                                <span class="u-free">
                                    <template v-if="decalDb.getDecalIsFree(key, cleandata['tDecal'][key]['nShowID'])">
                                        <el-icon>
                                            <SuccessFilled />
                                        </el-icon>
                                        {{ fdT("facedat.face.old.availableOnCreate") }}</template>
                                </span>
                                <span class="u-price"
                                    v-if="decalDb.getDecalPrice(key, cleandata['tDecal'][key]['nShowID'])">
                                    <el-icon>
                                        <Coin />
                                    </el-icon>
                                    {{ decalDb.getDecalPrice(key, cleandata["tDecal"][key]["nShowID"]) }}
                                    {{ fdT("facedat.common.coin") }}
                                </span>
                            </li>
                        </ul>
                    </template>
                </div>
                <div class="c-facedat-group">
                    <ul class="u-decals">
                        <li>
                            <div class="u-title">{{ fdT("facedat.common.decoration") }}</div>

                            <span class="u-dname"><img class="u-pic" :alt="decalDb.getDecorationName(cleandata['nDecorationID'])"
                                    :src="decalDb.getDecorationIcon(cleandata['nDecorationID'])" />{{
                                        decalDb.getDecorationName(cleandata["nDecorationID"])
                                    }}</span>
                            <span class="u-dname"></span>
                            <span class="u-dname"></span>
                            <span class="u-price" v-if="decalDb.showDecorationPrice(cleandata['nDecorationID'])">
                                <el-icon>
                                    <Coin />
                                </el-icon>
                                {{ decalDb.showDecorationPrice(cleandata["nDecorationID"]) }}
                                {{ fdT("facedat.common.coin") }}
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="c-facedat-group">
                    <ul class="u-decals">
                        <div class="u-title">{{ fdT("facedat.common.total") }}</div>
                        <span class="u-total u-price"><el-icon>
                                <Coin />
                            </el-icon> <b>{{ decalDb.getTotalPrice(cleandata) }}</b> {{ fdT("facedat.common.coin") }}</span>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/* eslint-disable vue/no-mutating-props */
import { Coin, SuccessFilled } from "@element-plus/icons-vue";
import Slider from "./Slider.vue";
import group from "../assets/data/face/group.json";
import dict from "../assets/data/face/dict.json";
import decal_group from "../assets/data/face/decal_group.json";
import bone_range from "../assets/data/face/bone_range.json";
import facedatI18nMixin from "./locale/mixin";
export default {
    name: "Jx3boxFacedatOldFace",
    mixins: [facedatI18nMixin],
    props: ["facedata", "lock", "decalDb", "body_type", "clean", "cleandata"],
    components: {
        Slider,
        Coin,
        SuccessFilled,
    },
    data() {
        return {
            tab_type: "",
            active: "eye",
            subActive: {
                mouth: "整体",
                eye: "整体",
                nose: "整体",
                decals: "底妆",
                contour: "额头",
                eyebrow: "整体",
            },
            group,
            dict,
            bone_range,
        };
    },
    methods: {
        oldFieldLabel(key, swapIris = false) {
            let displayKey = key;
            if (swapIris && key === "IRIS_RIGHT") displayKey = "IRIS_LEFT";
            if (swapIris && key === "IRIS_LEFT") displayKey = "IRIS_RIGHT";
            return this.fdT(`facedat.face.old.fields.${displayKey}`, {}, dict[displayKey]?.desc || key);
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
