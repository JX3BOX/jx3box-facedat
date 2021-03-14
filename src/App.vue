<template>
    <div>
        <Facedat :data="data" />
    </div>
</template>

<script>
import Facedat from './Facedat'
// import demo from "../demo/old.json";
import demo from "../demo/new.json";
export default {
    props: [],
    data: function() {
        return {
            data: JSON.stringify(demo),
        };
    },
    computed: {},
    methods: {},
    mounted: function() {},
    components: {
        Facedat
    },
};
</script>
