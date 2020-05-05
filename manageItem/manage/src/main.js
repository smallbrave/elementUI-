import Vue from 'vue'
import App from './App.vue'
import {
    Button,
    Form,
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
}).$mount('#app')