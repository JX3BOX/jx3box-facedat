<template>
  <div style="max-width: 980px; margin: 100px auto">
    <Upload @success="handleSuccess" />
    <Facedat v-if="isFace" :data="json" :lock="false" />
    <Bodydat v-if="isBody" :data="json" :lock="false" />
  </div>
</template>

<script>
import Facedat from "./Facedat";
import Bodydat from "./Bodydat";
import Upload from "./Upload";
export default {
  props: [],
  data: function () {
    return {
      type: "",
      data: "",
    };
  },
  computed: {
    json: function () {
      return this.data && this.data.json;
    },
    isFace: function () {
      return this.data.type === "face";
    },
    isBody: function () {
      return this.data.type === "body";
    },
  },
  methods: {
    handleSuccess: function (data) {
      this.data = data;
    },
  },
  mounted: function () {},
  components: {
    Facedat,
    Bodydat,
    Upload,
  },
};
</script>
