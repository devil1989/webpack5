/*
 注意：dev和prod环境的dll是相互独立的，以为dev环境下的dll包里面，包含了外部框架的编译器，为了方便调试；而prod环境下的ll包里面只有运行时代码
    1.dll文件需要自己通过npm run dll-dev来打包生成dev环境下新的dll文件
    2.dll文件需要在前端开发的html文件里面自己加入,地址是localhost:8080/recommend/dll/dev/dll.js，host可能会变动，看webpack.config.dev.js的output的publicPath

    操作的是src>dll>dev文件夹里面的文件
 */


var path = require("path");
var webpack=  require("webpack");


module.exports = {
    context: __dirname,
    mode:"development",
　　entry: {//名称的key不可以有-;webpack.DllPlugin这个插件只支持一个entry，不然生成的json会报错
        "dll":['react','react-dom',"vue","vuex","ant-design-vue"]
        // "react_prod":'react-dom',
        // "vue":"vue",
        // "vue_prod":"../node_modules/vue/dist/vue.runtime.esm.js"
        // "fastclick":'fastclick'
        // "fastclick_prod":'fastclick'
　　},
　　output: {
　　　　path: path.join(__dirname, "../src/dll/dev"),
　　　　filename: "[name].js",
       library: '[name]'//这个和webpack.DllPlugin的name保持一致
　　},
    
    plugins: [
　　　　new webpack.DllPlugin({
　　　　　　path: path.join(__dirname, "../src/dll/dev", "manifest.json"),
　　　　　　name: "[name]"
　　　　})
　　],

    resolve: {
        alias: { //给对应的模块取别名:不会影响文件打包大小，不会因为别名而导致dll重复加载对应的库
            'vue': path.resolve(__dirname, '../node_modules/vue/dist/vue.esm.js')//默认是运行时版本，没有compile，dev环境下引入需要完整版，vue.esm.js，有编译器才能编译template
        }
    },
　　
    optimization: {
        chunkIds: 'named'
    }
}; 

