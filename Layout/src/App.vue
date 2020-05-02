<template>
  <div id="app">
    <HelloWorld />
    <vModel v-model="something"></vModel>
  </div>
</template>

<script>
import HelloWorld from './components/navbar.vue'
import vModel from './components/vModel'

export default {
  name: 'App',
  data() {
    return {
      something: '1'
    }
  },
  components: {
    HelloWorld,
    vModel
  }
}
</script>

<style>

</style>
