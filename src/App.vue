<template>
    <div style="max-width:980px;margin:100px auto;">
        <Upload @success="handleSuccess"/>
        <Facedat :data="json" :lock="false"/>
    </div>
</template>

<script>
import Facedat from "./Facedat";
import Upload from "./Upload";
export default {
    props: [],
    data: function () {
        return {
            data: "",
        };
    },
    computed: {
        json : function (){
            return this.data && this.data.json
        }
    },
    methods: {
        handleSuccess : function (data){
            this.data = data
        },
    },
    mounted: function () {
    },
    components: {
        Facedat,
        Upload
    },
};
</script>
