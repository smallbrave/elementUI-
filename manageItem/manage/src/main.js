import Vue from 'vue'
import App from './App.vue'
// 此处，要写成router
import router from './router'
import axios from "axios";
import {
    Container,
    Header,
    Aside,
    Main,
    Footer,
    Button,
    Form,
    Input,
    FormItem,
    Message,
    Menu,
    Submenu,
    MenuItemGroup,
    MenuItem,
    Breadcrumb,
    BreadcrumbItem,
    Card,
    Row,
    Col,
    Table,
    TableColumn,
    Switch,
    Tooltip,
    Pagination,
    Dialog,
    MessageBox
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(Input)
Vue.use(Container)
Vue.use(FormItem)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Footer)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItemGroup)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Row)
Vue.use(Col)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Tooltip)
Vue.use(Pagination)
Vue.use(Dialog)

// 设置axios的根路径（之后使用的axios都是在这个链接的基础上）
//默认用户名 admin 密码 123456
axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/"
axios.interceptors.request.use(config => {
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config
})
Vue.prototype.$http = axios

// Message的使用是把Message挂载到prototype上
Vue.prototype.$message = Message
    // MessageBox需要绑定到prototype上
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')