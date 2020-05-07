// 在router.js中引入VueRouter并注册
import Vue from 'vue'
import Router from 'vue-router'
import login from './components/login.vue'
import home from './components/home'
import welcome from './components/welcome'
import users from './components/users'
import roles from './components/roles'
import rights from './components/rights'

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