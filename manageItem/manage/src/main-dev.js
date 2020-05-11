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
    MessageBox,
    Tag,
    Tree,
    Select,
    Option,
    Cascader,
    Alert,
    Tabs,
    TabPane,
    Steps,
    Step,
    Checkbox,
    CheckboxGroup,
    Upload,
    Timeline,
    TimelineItem
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
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
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.use(Alert)
Vue.use(Tabs)
Vue.use(TabPane)
Vue.use(Steps)
Vue.use(Step)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(Upload)
Vue.use(Timeline)
Vue.use(TimelineItem)


//引入一个table-with-tree-grid组件
import TreeTable from "vue-table-with-tree-grid"
Vue.component('tree-table', TreeTable)

// 导入vue-quill-editor（富文本编辑器）
import VueQuillEditor from 'vue-quill-editor'
// 导入vue-quill-editor样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 注册其为全局可用
Vue.use(VueQuillEditor)

// 导入进度条NProgress 包js/css
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 设置axios的根路径（之后使用的axios都是在这个链接的基础上）
//默认用户名 admin 密码 123456
axios.defaults.baseURL = "http://timemeetyou.com:8889/api/private/v1/"

// 请求拦截器：在从客户端发起请求前进行的额外操作
// 在request拦截器中展示进度条： NProgress.start()
axios.interceptors.request.use(config => {
    NProgress.start()
    config.headers.Authorization = window.sessionStorage.getItem("token");
    return config
})

//响应拦截器，=>隐藏进度条: NProgress.done() 
axios.interceptors.response.use((config) => {
    NProgress.done()
    return config;
})
Vue.prototype.$http = axios
    // 定义全局过滤器，用于处理时间的格式
Vue.filter("dateFormat", function(originVal) {
    const dt = new Date(originVal * 1000);
    const y = dt.getFullYear();
    // padStart: 两个参数，第一个参数指定字符长度，第二个参数为
    //不足长度添加一个填充值
    const m = (dt.getMonth() + 1 + '').padStart(2, '0');
    const d = (dt.getDate() + '').padStart(2, '0');
    const hh = (dt.getHours() + '').padStart(2, '0');
    const mm = (dt.getMinutes() + '').padStart(2, '0');
    const ss = (dt.getSeconds() + '').padStart(2, '0');
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

// Message的使用是把Message挂载到prototype上
Vue.prototype.$message = Message
    // MessageBox需要绑定到prototype上
Vue.prototype.$confirm = MessageBox.confirm

Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App),
}).$mount('#app')