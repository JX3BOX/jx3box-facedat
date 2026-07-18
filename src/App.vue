<template>
    <main class="p-facedat-demo">
        <Upload @success="handleSuccess" />
        <Facedat v-if="isFace" :data="data" :lock="true" />
        <Bodydat v-if="isBody" :data="data" :lock="false" />
    </main>
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

<style lang="less">
.p-facedat-demo {
    width: min(calc(100% - 32px), 980px);
    margin: 48px auto;
}

@media screen and (max-width: 720px) {
    .p-facedat-demo {
        width: min(calc(100% - 24px), 980px);
        margin: 20px auto;
    }
}
</style>
