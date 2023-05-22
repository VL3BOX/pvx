<template>
    <div class="m-simple-furniture">
        <div class="u-furniture-title">{{title}}</div>
        <div class="u-furniture-standard">
            <div class="u-label">评分标准：</div>
            <div class="u-value">
                {{ furniture.property }}
            </div>
        </div>
        <div class="u-furniture-content">
            <div class="u-label">评分内容：</div>
            <div class="u-value">
                <a class="u-link" href="/furniture?match=1" target="_blank">
                    {{ furniture.category }}
                </a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: "SimpleFurniture",
    props: {
        furniture: {
            type: Object,
            required: true,
        },
        title : {
            type: String,
            default: ''
        }
    },
};
</script>
