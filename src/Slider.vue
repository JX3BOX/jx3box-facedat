<template>
    <!-- 滑动条组件 -->
    <div class="slider-container" :class="{ 'is-negative': currentValue < center }" role="meter"
        :aria-valuemin="min" :aria-valuemax="max" :aria-valuenow="currentValue">
        <div class="slider-runway">
            <div class="slider-track slider-track-left"></div>
            <div class="slider-track slider-track-right"></div>
            <div class="slider-center" :style="centerStyle"></div>
            <div class="slide-bar" :style="sliderStyle"></div>
        </div>
    </div>
</template>
<script>
export default {
    name: "Jx3boxSlider",
    computed: {
        center() {
            return (this.max + this.min) / 2;
        },
        currentValue() {
            return Number(this.modelValue ?? this.value ?? this.center);
        },
        centerPercent() {
            return this.toPercent(this.center);
        },
        valuePercent() {
            return this.toPercent(this.currentValue);
        },
        centerStyle() {
            return { left: `${this.centerPercent}%` };
        },
        sliderStyle() {
            const distance = Math.abs(this.valuePercent - this.centerPercent);
            if (distance < 0.01) return { display: "none" };
            const width = `max(0px, calc(${distance}% - 10px))`;
            return {
                left: this.currentValue < this.center
                    ? `${this.valuePercent}%`
                    : `calc(${this.centerPercent}% + 10px)`,
                width,
            };
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
        modelValue: {
            default: undefined,
            type: Number,
        },
        value: {
            default: undefined,
            type: Number,
        },
    },
    emits: ["update:modelValue"],
    methods: {
        toPercent(value) {
            if (this.max === this.min) return 50;
            return Math.min(100, Math.max(0, ((value - this.min) / (this.max - this.min)) * 100));
        },
    },
};
</script>
<style lang="less">
.slider-container {
    width: 100%;
    min-width: 0;
    padding: 8px 0;

    .slider-runway {
        position: relative;
        width: 100%;
        height: 8px;
        overflow: visible;
        background: transparent;

        .slider-track {
            position: absolute;
            top: 0;
            height: 100%;
            background: var(--jx3-facedat-color-border, #e8e8e8);
            border-radius: 999px;
        }

        .slider-track-left {
            left: 0;
            width: calc(50% - 10px);
        }

        .slider-track-right {
            right: 0;
            width: calc(50% - 10px);
        }

        .slider-center {
            position: absolute;
            z-index: 3;
            top: 50%;
            width: 12px;
            height: 12px;
            box-sizing: content-box;
            background: var(--jx3-facedat-color-border, #e8e8e8);
            border: 4px solid var(--jx3-facedat-color-surface, #fff);
            border-radius: 50%;
            transform: translate(-50%, -50%);
        }

        .slide-bar {
            position: absolute;
            top: 0;
            height: 100%;
            background: linear-gradient(
                to right,
                color-mix(in srgb, var(--jx3-facedat-color-primary, #6b52ff) 30%, var(--jx3-facedat-color-surface, #fff)),
                var(--jx3-facedat-color-primary, #6b52ff)
            );
            overflow: hidden;
            border-radius: 999px;
            clip-path: inset(0 round 999px);
        }
    }

    &.is-negative .slider-runway .slide-bar {
        background: linear-gradient(
            to right,
            var(--jx3-facedat-color-primary, #6b52ff),
            color-mix(in srgb, var(--jx3-facedat-color-primary, #6b52ff) 30%, var(--jx3-facedat-color-surface, #fff))
        );
    }
}
</style>
