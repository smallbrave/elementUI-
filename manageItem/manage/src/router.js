// 在router.js中引入VueRouter并注册
import Vue from 'vue'
import Router from 'vue-router'
const login = () =>
    import ( /*webpackChunkName: "login_home_welcome" */ './components/login.vue')
    // import login from './components/login.vue'

const home = () =>
    import ( /*webpackChunkName: "login_home_welcome" */ './components/home.vue')
    // import home from './components/home'

const welcome = () =>
    import ( /*webpackChunkName: "login_home_welcome" */ './components/welcome.vue')
    // import welcome from './components/welcome'

const users = () =>
    import ( /*webpackChunkName: "users_rights_roles" */ './components/user/users')
    // import users from './components/user/users'

const roles = () =>
    import ( /*webpackChunkName: "users_rights_roles" */ './components/power/roles')
    // import roles from './components/power/roles'

const rights = () =>
    import ( /*webpackChunkName: "users_rights_roles" */ './components/power/rights')
    // import rights from './components/power/rights'

const cate = () =>
    import ( /*webpackChunkName: "cate_params_list" */ './components/goods/cate')
    // import cate from './components/goods/cate'

const params = () =>
    import ( /*webpackChunkName: "cate_params_list" */ './components/goods/params')
    // import params from './components/goods/params'

const list = () =>
    import ( /*webpackChunkName: "cate_params_list" */ './components/goods/list')
    // import list from './components/goods/list'

const add = () =>
    import ( /*webpackChunkName: "add_order_report" */ './components/goods/add')
    // import add from './components/goods/add'

const order = () =>
    import ( /*webpackChunkName: "add_order_report" */ './components/order/order')
    // import order from './components/order/order'

const report = () =>
    import ( /*webpackChunkName: "add_order_report" */ './components/report/report')
    // import report from './components/report/report'

Vue.use(Router)
let router = new Router({
    mode: 'history',
    routes: [{
        path: '/',
        redirect: '/login'
    }, {
        path: '/login',
        component: login
    }, {
        path: '/home',
        component: home,
        redirect: '/welcome',
        children: [{
            path: '/welcome',
            component: welcome
        }, {
            path: '/users',
            component: users
        }, {
            path: '/roles',
            component: roles
        }, {
            path: '/rights',
            component: rights
        }, {
            path: '/categories',
            component: cate
        }, {
            path: '/params',
            component: params
        }, {
            path: '/goods',
            component: list,
        }, {
            path: '/goods/add',
            component: add
        }, {
            path: '/orders',
            component: order
        }, {
            path: '/reports',
            component: report
        }]
    }]
})

//挂载路由守卫
router.beforeEach((to, from, next) => {
    if (to.path == '/login') {
        return next();
    } else {
        const token = window.sessionStorage.getItem("token");
        if (!token) {
            next('/login')
        } else {
            next();
        }
    }
})

export default router

// 路由懒加载： 把不同路由对应的组件分割为不同的代码块，然后当路由被访问时才加载对应的组件
//步骤： 1、安装@babel/plugin-syntax-dynamic-import包
//2、在babel.config.js配置文件中声明该插件
//3、将路由改为按需加载的形式
// 例： const Foo = ()=>import(/*webpackChunkName: "group-foo" */ 'Foo.vue')