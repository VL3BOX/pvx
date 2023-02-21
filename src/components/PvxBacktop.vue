<template>
    <el-backtop :bottom="100" :style="{ color: color, backgroundColor: bgColor }"></el-backtop>
</template>

<script>
export default {
    name: "PvxBacktop",
    props: {
        bgColor: {
            type: String,
            default: "white",
        },
        color: {
            type: String,
            default: "gray",
        },
    },
};
</script>
