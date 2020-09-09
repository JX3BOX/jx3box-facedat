import Facedat from './src/Facedat.vue'

const components = {
    Facedat,
}

const install = function (Vue, Option) {
     Object.keys(components).forEach((key) => {
        Vue.component(components[key].name, components[key])
    })
}

export default {
    install
}