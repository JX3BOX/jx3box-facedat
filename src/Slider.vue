<template>
    <!-- 滑动条组件 -->
    <div class="slider-container">
        <div class="slider-runway" ref="slider" :style="bgStyle">
            <div class="slide-bar" :style="sliderStyle"></div>
        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            width: 0,
            height: 0,
        };
    },
    computed: {
        center() {
            return (this.max + this.min) / 2;
        },
        bgStyle() {
            const width = this.width;
            const height = this.height;
            const larWidth = (1 / 2) * width - (2 / 5) * height - (1 / 2) * height;
            const centerX = larWidth + (2 / 5) * height;
            let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="0" width="${larWidth}" height="${height}" rx="${height / 2}" fill="#E8E8E8"/>
          <rect x="${centerX}" width="${height}" height="${height}" rx="${height / 2}" fill="#E8E8E8"/>
          <rect x="${width - larWidth}" width="${larWidth}" height="${height}" rx="${height / 2}" fill="#E8E8E8"/>
      </svg>`;
            return `background:url('data:image/svg+xml;base64,${window.btoa(unescape(encodeURIComponent(svg)))}')`;
        },
        sliderStyle() {
            const height = this.height;
            if (Math.abs(this.center - this.value) < 1) {
                return `width:  ${height}px !important; left: calc(50% - ${
                    (1 / 2) * height
                }px) !important;background: #6B52FF;border-radius: 10px;`;
            } else if (this.center - this.value < 0) {
                const width = (this.value - this.center) / (this.max - this.min);
                return `width:  calc(${width * 100}% - ${
                    (2 / 5) * height + (1 / 2) * height
                }px) !important; left: calc(50% + ${
                    (2 / 5) * height + (1 / 2) * height
                }px) !important;background: linear-gradient(89.73deg, #C2DAFF 0.23%, rgba(107, 82, 255, 0.1) 0.24%, #6B52FF 100%);border-radius: 10px;`;
            } else if (this.center - this.value > 0) {
                const width = (this.center - this.value) / (this.max - this.min);
                return `width: calc(${width * 100}% - ${(2 / 5) * height + (1 / 2) * height}px) !important; left: ${
                    50 - width * 100
                }% !important;background: linear-gradient(89.73deg, #6B52FF 0.23%, rgba(107, 82, 255, 0.1) 100%);border-radius: 10px;`;
            }
            return "";
        },
    },
    props: {
        min: {
            default: 0,
            type: Number,
        },
        max: {
            default: 24,
            type: Number,
        },
        value: {
            default: 0,
        },
    },
    mounted() {
        const observer = new ResizeObserver((entries) => {
            const width = entries[0].contentRect.width;
            const height = entries[0].contentRect.height;
            this.width = width;
            this.height = height;
        });
        observer.observe(this.$refs.slider);
    },
    updated() {},
    methods: {},
    watch: {
        value(newVal) {
            this.currentValue = newVal;
        },
    },
};
</script>
<style lang="less">
.slider-container {
    .mt(5px);
    .mb(5px);
    .slider-runway {
        .pr;
        .size(100%);
        .slide-bar {
            .pa;
            .h(100%);
        }
    }
}
</style>
