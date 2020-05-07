# manage

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

### 项目知识点
、、、
路由守卫：
、、、
router.beforeEach((to,next,from)=>{
    if(to.path == '/login'){
        next()
    } else {
        判断有无登录状态（token）
        const token = window.sessionStorage.getItem("token");
        if(!token) {
            没有token，直接到登陆页
            next('/login')
        }else {
            反之，随意进行下一步
            next()
        }
    }
})

、、、
axios请求拦截
、、、
axios.interceptors.request.use(config=>{
    //可在config中对其进行一定的设置,给config的header中添加一个属性： Authorization并设置其为保存在本地的token
    //完成一些需要权限的请求；在请求发送前进行一些操作，例如在每个请求体里加上token，统一做了处理如果以后要改也非常容易。
    config.headers.Authorization = window.sessionStorage.getItem("token") 
    //最终必须return config
    return config
})
