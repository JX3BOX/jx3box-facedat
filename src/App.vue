<template>
    <div style="max-width: 980px; margin: 100px auto">
        <Upload @success="handleSuccess" />
        <Facedat v-if="isFace" :data="this.data" :lock="true" />
        <Bodydat v-if="isBody" :data="this.data" :lock="false" />
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
            data: "",
            value: 0,
        };
    },
    computed: {
        isFace: function () {
            return this.data.type?.startsWith("face");
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
