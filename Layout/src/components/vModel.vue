<template>
<div @click="$emit('input',value+1)" class="container">
   {{ value }}
</div>
</template>
<script>
export default {
    props: ['value'],

}
</script>
<style lang="less" scoped>

</style>