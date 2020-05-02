<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
html,
body,
ul {
  margin: 0;
  padding: 0;
}
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
  min-width: 1366px;
}

.el-cascader-menu {
    max-height: 200px;
    min-width: 180px;
}

/* 清除级联选择器底部出项的横向滚动条 */
.el-scrollbar__wrap {
  overflow: auto;
  overflow-y: scroll!important ;
}
</style>
