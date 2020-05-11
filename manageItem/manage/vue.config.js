module.exports = {
    // 默认情况下，开发模式和生产模式的打包入口是一样的
    // 可以使用configureWebpack和chainWebpack来进行操作  
    publicPath: './',
    chainWebpack: config => {
        // 使用process.env.NODE_ENV的值，来判断当前是开发环境还是生产环境
        // 生产/发布环境时：使其入口为： ./src/main-prod.js 
        config.when(process.env.NODE_ENV === 'production', config => {
            config.entry('app').clear().add('./src/main-prod.js')
        })

        // 开发环境时: 使其入口为： ./src/main-dev.js
        config.when(process.env.NODE_ENV === 'development', config => {
            config.entry('app').clear().add('./src/main-dev.js')
        })
    }
}