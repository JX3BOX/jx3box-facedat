<template>
  <div>
    <div class="c-facedat-tab">
      <el-radio-group v-model="active">
        <el-radio-button class="u-filter" label="contour">轮廓</el-radio-button>
        <el-radio-button class="u-filter" label="eyebrow">眉毛</el-radio-button>
        <el-radio-button class="u-filter" label="eye">眼部</el-radio-button>
        <el-radio-button class="u-filter" label="nose">鼻子</el-radio-button>
        <el-radio-button class="u-filter" label="mouth">嘴部</el-radio-button>
        <el-radio-button class="u-filter" label="decals">妆容</el-radio-button>
      </el-radio-group>
      <slot></slot>
    </div>
    <div class="c-facedat-preivew">
      <div class="c-facedat-group" v-show="active === 'contour'">
        <el-tabs v-model="subActive.contour" :type="tab_type">
          <el-tab-pane
            :label="item"
            :name="item"
            v-for="(item, index) in Object.keys(new_face_dict['轮廓'])"
            :key="index"
          >
            <ul
              class="u-list u-new"
              v-for="(subItem, itemIndex) in Object.keys(new_face_dict['轮廓'][item])"
              :key="itemIndex"
            >
              <template v-if="subItem === 'root'">
                <li v-for="(key, i) in new_face_dict['轮廓'][item].root" :key="key + i">
                  <label @click="clog(facedata['tBone'][key.BoneType])">{{
                    key.BoneName
                  }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
              <li v-if="subItem !== 'root'" class="u-sub-title">{{ subItem }}</li>
              <template v-if="subItem !== 'root'">
                <li v-for="(key, i) in new_face_dict['轮廓'][item][subItem]" :key="i">
                  <label>{{ key.BoneName }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="c-facedat-group" v-show="active === 'eyebrow'">
        <el-tabs v-model="subActive.eyebrow" :type="tab_type">
          <el-tab-pane
            :label="item"
            :name="item"
            v-for="(item, index) in Object.keys(new_face_dict['眉毛'])"
            :key="index"
          >
            <ul
              class="u-list u-new"
              v-for="(subItem, itemIndex) in Object.keys(new_face_dict['眉毛'][item])"
              :key="itemIndex"
            >
              <template v-if="subItem === 'root'">
                <li v-for="(key, i) in new_face_dict['眉毛'][item].root" :key="key + i">
                  <label @click="clog(facedata['tBone'][key.BoneType])">{{
                    key.BoneName
                  }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
              <li v-if="subItem !== 'root'" class="u-sub-title">{{ subItem }}</li>
              <template v-if="subItem !== 'root'">
                <li v-for="(key, i) in new_face_dict['眉毛'][item][subItem]" :key="i">
                  <label>{{ key.BoneName }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="c-facedat-group" v-show="active === 'eye'">
        <el-tabs v-model="subActive.eye" :type="tab_type">
          <el-tab-pane
            :label="item"
            :name="item"
            v-for="(item, index) in Object.keys(new_face_dict['眼部'])"
            :key="index"
          >
            <ul
              class="u-list u-new"
              v-for="(subItem, itemIndex) in Object.keys(new_face_dict['眼部'][item])"
              :key="itemIndex"
            >
              <template v-if="subItem === 'root'">
                <li v-for="(key, i) in new_face_dict['眼部'][item].root" :key="key + i">
                  <label @click="clog(facedata['tBone'][key.BoneType])">{{
                    key.BoneName
                  }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
              <li v-if="subItem !== 'root'" class="u-sub-title">{{ subItem }}</li>
              <template v-if="subItem !== 'root'">
                <li v-for="(key, i) in new_face_dict['眼部'][item][subItem]" :key="i">
                  <label>{{ key.BoneName }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="c-facedat-group" v-show="active === 'nose'">
        <el-tabs v-model="subActive.nose" :type="tab_type">
          <el-tab-pane
            :label="item"
            :name="item"
            v-for="(item, index) in Object.keys(new_face_dict['鼻子'])"
            :key="index"
          >
            <ul
              class="u-list u-new"
              v-for="(subItem, itemIndex) in Object.keys(new_face_dict['鼻子'][item])"
              :key="itemIndex"
            >
              <template v-if="subItem === 'root'">
                <li v-for="(key, i) in new_face_dict['鼻子'][item].root" :key="key + i">
                  <label @click="clog(facedata['tBone'][key.BoneType])">{{
                    key.BoneName
                  }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
              <li v-if="subItem !== 'root'" class="u-sub-title">{{ subItem }}</li>
              <template v-if="subItem !== 'root'">
                <li v-for="(key, i) in new_face_dict['鼻子'][item][subItem]" :key="i">
                  <label>{{ key.BoneName }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="c-facedat-group" v-show="active === 'mouth'">
        <el-tabs v-model="subActive.mouth" :type="tab_type">
          <el-tab-pane
            :label="item"
            :name="item"
            v-for="(item, index) in Object.keys(new_face_dict['嘴部'])"
            :key="index"
          >
            <ul
              class="u-list u-new"
              v-for="(subItem, itemIndex) in Object.keys(new_face_dict['嘴部'][item])"
              :key="itemIndex"
            >
              <template v-if="subItem === 'root'">
                <li v-for="(key, i) in new_face_dict['嘴部'][item].root" :key="key + i">
                  <label @click="clog(facedata['tBone'][key.BoneType])">{{
                    key.BoneName
                  }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
              <li v-if="subItem !== 'root'" class="u-sub-title">{{ subItem }}</li>
              <template v-if="subItem !== 'root'">
                <li v-for="(key, i) in new_face_dict['嘴部'][item][subItem]" :key="i">
                  <label>{{ key.BoneName }}</label>
                  <span>{{ facedata["tBone"][key.BoneType] }}</span>
                  <slider
                    v-if="lock"
                    class="u-range"
                    :min="-128"
                    :max="128"
                    :value="facedata['tBone'][key.BoneType]"
                  ></slider>
                  <el-slider
                    v-else
                    class="u-range"
                    :min="-128"
                    :max="128"
                    v-model="facedata['tBone'][key]"
                    :disabled="lock"
                  ></el-slider>
                </li>
              </template>
            </ul>
          </el-tab-pane>
        </el-tabs>
      </div>
      <div class="c-facedat-group" id="decals" v-show="active === 'decals'">
        <el-tabs v-model="subActive.decals" :type="tab_type">
          <el-tab-pane
            :label="item"
            :name="item"
            v-for="(item, index) in Object.keys(new_decal_group['妆容'])"
            :key="index"
          >
              <ul v-for="(subItem, itemIndex) in new_decal_group['妆容'][item]" :key="itemIndex" class="u-decals">
                <li v-if="facedata.tDecal[subItem.DecalsType].bUse">
                  <div class="u-title">
                    <img
                      class="u-pic"
                      :src="
                        decalDb.getDecalIcon(
                          subItem.DecalsType,
                          facedata.tDecal[subItem.DecalsType]['nShowID'],
                          true
                        )
                      "
                    />
                    {{
                      decalDb.getDecalName(
                        subItem.DecalsType,
                        facedata.tDecal[subItem.DecalsType]["nShowID"],
                        true
                      )
                    }}
                  </div>
                  <span class="u-dname">
                    <!--                      增加一个 color图标-->
                    {{ facedata.tDecal[subItem.DecalsType].nColorID + "号" }}</span
                  >
                  <span class="u-decals-params">
                    <span>{{ subItem.Name1 }}</span>
                    <span>{{
                      facedata.tDecal[subItem.DecalsType].fValue1.toFixed(2)
                    }}</span>
                  </span>
                  <span class="u-decals-params" v-if="!subItem.bValueXY">
                    <template v-if="subItem.bShowScroll2">
                      <span>{{ subItem.Name2 }}</span>
                      <span>{{
                        facedata.tDecal[subItem.DecalsType].fValue2.toFixed(2)
                      }}</span>
                    </template>
                  </span>
                  <span class="u-decals-params" v-if="!subItem.bValueXY">
                    <template v-if="subItem.bShowScroll3">
                      <span>{{ subItem.Name3 }}</span>
                      <span>{{
                        facedata.tDecal[subItem.DecalsType].fValue3.toFixed(2)
                      }}</span>
                    </template>
                  </span>
                  <span class="u-decals-params" v-if="subItem.bValueXY">
                    <span>X坐标</span>
                    <span>{{
                      facedata.tDecal[subItem.DecalsType].fValue3.toFixed(2)
                    }}</span>
                  </span>
                  <span class="u-decals-params" v-if="subItem.bValueXY">
                    <span>Y坐标</span>
                    <span>{{
                      facedata.tDecal[subItem.DecalsType].fValue3.toFixed(2)
                    }}</span>
                  </span>
                  <span class="u-price">
                    <template
                      v-if="
                        decalDb.getDecalPrice(
                          subItem.DecalsType,
                          facedata.tDecal[subItem.DecalsType]['nShowID'],
                          true
                        )
                      "
                    >
                      <i class="el-icon-coin"></i>
                      {{
                        decalDb.getDecalPrice(
                          subItem.DecalsType,
                          facedata.tDecal[subItem.DecalsType]["nShowID"],
                          true
                        )
                      }}
                      通宝</template
                    >
                  </span>
                </li>
              </ul>
          </el-tab-pane>
        </el-tabs>
        <div class="c-facedat-group">
          <ul class="u-decals">
            <span class="u-title">总计</span>
            <span class="u-total u-price"
              ><i class="el-icon-coin"></i>
              <b>{{ decalDb.getTotalPrice(facedata, true) }}</b> 通宝</span
            >
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Slider from "./Slider.vue";
import new_face_dict from "../assets/data/newface/ui.json";
import new_decal_group from "../assets/data/newface/decal.json";
import new_decal_type from "../assets/data/newface/decal_v2.json";
export default {
  name: "NewFace",
  props: ["facedata", "lock", "decalDb", "body_type", "clean"],
  components: {
    Slider,
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
      new_decal_type,
    };
  },

  mounted() {
    console.log(this.decalDb);
  },

  computed: {
    cleandata: function () {
      if (this.clean && this.facedata) {
        let _cleandata = _.cloneDeep(this.facedata);
        _cleandata.nDecorationID = 0;
        for (let key in _cleandata.tDecal) {
          let CanUseInCreate = this.decalDb.getDecalIsFree(
            key,
            _cleandata.tDecal[key]["nShowID"],
            true
          );
          console.log(CanUseInCreate);
          if (!CanUseInCreate) {
            _cleandata.tDecal[key]["nShowID"] = decal_default[key]["nShowID"];
          }
        }
        return _cleandata;
      } else {
        return this.facedata;
      }
    }
  },
  methods: {},
};
</script>

<style lang="less">
.c-facedat-tab {
  .mt(20px);
  .mb(20px);
  .u-filter {
    white-space: nowrap;
    vertical-align: middle;
    .el-button,
    .el-checkbox-button__inner,
    .el-radio-button__inner {
      .fz(16px, 33px);
      padding: 0 20px 0 20px;
      margin: 0 10px 0 10px;
      .db;
      .r(30px);
      color: #8D8D8D;
      border: 1px solid #fff;
      background-color: #fff;
      .bold(400);
      &:hover {
        color: #fff;
        background-color: #6B52FF;
        border-color: #6B52FF;
        .bold(400);
      }
    }
    .el-radio-button__orig-radio:checked + .el-radio-button__inner {
      background-color: #6B52FF;
      border-color: #6B52FF;
      color: #fff;
      .bold(400);
    }
  }
}
.el-tabs__header{
  border-color: transparent !important;
}
.el-tabs__nav{
  .w(100%);
  border-color: transparent !important;
  .el-tabs__item{
    .size(64px, 30px);
    .fz(14px, 30px);
    margin: 0 10px 0 10px;
    padding: 0px !important;
    text-align: center;
    .dbi;
    .r(5px);
    color: #8D8D8D;
    border: 1px solid #f3f3f3 !important;
    background-color: #f3f3f3;
    .bold(400);
    &:hover {
      color: #fff;
      background-color: #6B52FF;
      border-color: #6B52FF;
      .bold(400);
    }
    &.is-active{
      color: #fff;
      background-color: #6B52FF;
      border-color: #6B52FF;
      .bold(400);
    }
  }
  &:after {
    background-color: transparent !important;
  }
}
</style>
