<template>
  <nav class="m-nav">
    <div class="m-menus-panel">
      <el-tree
        class="m-menus"
        :data="menus"
        node-key="id"
        ref="tree"
      >
        <router-link
          class="el-tree-node__label"
          slot-scope="{ node, data }"
          :to="menuLink(data, node)"
        >
          <span
            class="u-name"
            v-text="'【 ' + data.name + ' 】'"
          ></span>
        </router-link>
      </el-tree>
    </div>
  </nav>
</template>

<script>
import professions from '@/assets/data/book_profession.json'

export default {
  name: "Nav",
  data: () => ({
    keyword: "",
    menus: professions.map(item => {
      if (item.id === 8) {
        item.name = '全部'
      }
      return item
    })
  }),
  computed: {
    client () {
      return this.$store.state.client;
    },
  },
  methods: {
    menuLink (menu) {
      return { name: "result", query: { profession: menu.id } };
    },
  },
  mounted () {
  },
};
</script>

<style lang="less">
// @import "~@/assets/css/reputation/nav.less";
</style>
