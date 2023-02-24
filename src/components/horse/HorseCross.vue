<template>
    <div ref="wrap" class="cross-wrapper">
        <template v-if="isShow">
            <div
                class="cross cross-left"
                :class="!isInLeft && 'active'"
                :style="{
                    width: width + 'px',
                    'border-top-left-radius': radius + 'px',
                    'border-bottom-left-radius': radius + 'px',
                }"
                @click.stop="toLeft"
            >
                <i class="el-icon-caret-left"></i>
            </div>
            <div
                class="cross cross-right"
                :class="!isInRight && 'active'"
                :style="{
                    width: width + 'px',
                    'border-top-right-radius': radius + 'px',
                    'border-bottom-right-radius': radius + 'px',
                }"
                @click.stop="toRight"
            >
                <i class="el-icon-caret-right"></i>
            </div>
        </template>
        <div ref="list" class="list">
            <div
                class="item"
                :style="{ 'margin-right': gap + 'px' }"
                v-for="(item, index) in list"
                :key="item.id || item.ID || index"
            >
                <slot v-bind:item="item"></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Cross",
    props: {
        list: {
            type: Array,
            required: true,
        },
        width: {
            type: Number,
            default: 60,
        },
        gap: {
            type: Number,
            default: 20,
        },
        radius: {
            type: Number,
            default: 10,
        },
    },
    data() {
        return {
            scrollLeft: 0,
            isInLeft: true,
            isInRight: false,
            isShow: false,
        };
    },
    methods: {
        toLeft(e) {
            e.preventDefault();
            this.isInRight = false;
            this.scroll(-1);
        },
        toRight(e) {
            e.preventDefault();
            this.isInLeft = false;
            this.scroll(1);
        },
        scroll(arrow = 1) {
            const list = this.$refs.list;
            const nowLeft = list.scrollLeft;
            const width = list.scrollWidth;
            const wrapperWidth = list.clientWidth;
            const step = (wrapperWidth / 2) * arrow;
            let timer = null;
            timer = setInterval(() => {
                // console.log(list.scrollLeft + wrapperWidth, width, step);
                if (arrow === 1) {
                    // 向右
                    if (list.scrollLeft < nowLeft + step) {
                        list.scrollLeft += step / 100;
                    } else {
                        clearInterval(timer);
                    }
                    if (list.scrollLeft + wrapperWidth === width) {
                        this.isInRight = true;
                        clearInterval(timer);
                    }
                } else if (arrow === -1) {
                    // 向左
                    if (list.scrollLeft > nowLeft + step) {
                        list.scrollLeft += step / 100;
                    } else {
                        clearInterval(timer);
                    }
                    if (list.scrollLeft === 0) {
                        this.isInLeft = true;
                        clearInterval(timer);
                    }
                }
            }, 1);
        },
    },
    mounted() {
        this.$nextTick(() => {
            const list = this.$refs.list;
            const cWidth = list.clientWidth;
            const sWidth = list.scrollWidth;
            if (sWidth > cWidth) {
                this.isShow = true;
            }
        });
    },
};
</script>

<style lang="less">
.cross-wrapper {
    position: relative;
    width: 100%;
    .list {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-wrap: nowrap;
        overflow: hidden;
        .item {
            flex-grow: 0;
            flex-shrink: 0;
        }
        .item:last-of-type {
            margin-right: 0 !important;
        }
    }
    .cross {
        display: none;
        position: absolute;
        top: 0;
        bottom: 0;
        height: 100%;
        background-color: #b3b2b2;
        opacity: 0.9;
        cursor: pointer;
        z-index: 1;
        i {
            font-size: 20px;
            color: #d9d9d9;
        }
        &.cross-left {
            left: 0;
        }
        &.cross-right {
            right: 0;
        }
        &.active {
            background-color: @active-color;
            i {
                color: #fff;
            }
        }
        &:hover {
            opacity: 1;
        }
    }
    &:hover {
        & > .cross {
            display: flex;
            justify-content: center;
            align-items: center;
        }
        & > .cross-left {
            animation: toRight 0.3s;
        }
        & > .cross-right {
            animation: toLeft 0.3s;
        }
    }
}
@media screen and (max-width: @phone) {
    .cross-wrapper {
        .list {
            overflow-x: auto;
        }
        &:hover {
            & > .cross {
                display: none;
            }
        }
    }
}
@keyframes toRight {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(0);
    }
}
@keyframes toLeft {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(0);
    }
}
</style>
