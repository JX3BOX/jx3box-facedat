<template>
    <div style="max-width:980px;margin:100px auto;">
        <Upload @success="handleSuccess" @update="handlerParams"/>
        <Facedat :data="json" :client="client" :clean="clean"/>
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
            clean : false,
            client : 'std'
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
        handlerParams : function (params){
            this.clean = params.clean
            this.client = params.client
        }
    },
    mounted: function () {
    },
    components: {
        Facedat,
        Upload
    },
};
</script>
