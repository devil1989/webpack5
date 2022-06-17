# webpack5

代码拉下来后的简易使用流程：
  1.npm install【安装npm插件包】
  2.npm start【启动项目】
  3.打开：http://localhost:8080/recommend/app/vue_demo/index.html，就可以看到vue的demo页面了



配置环境：“webpack 5.x | babel-loader 8.x | @babel 7.x” ；
         node我用了16.15.0；如果大家不是整个版本，可以用nvm来管理node版本，各node版本之间来回切换，安装新的node版本尝尝鲜



//插件和功能概述：
1.babel设置支持jsx，能把es6+转译成es5，浏览器支持版本见config文件具体的浏览器兼容设置；
  主要用@babel/preset-env；@babel/preset-react；@babel/plugin-transform-runtime；@babel/runtime；@babel/runtime-corejs3这几个插件
  设置中用到useBuiltIns：usage按需加载；不引入整个polyfill
2.css插件用到了css-loader,sass-loader,postcss-loader(用里面的autoprefixer)；压缩css用了css-minimizer-webpack-plugin；提取css用了mini-css-extract-plugin
3.移动端和pc端打包css有插件区别，移动端用到了px2rem-loader插件，把px自动转rem，这样移动端开发，就可以直接用设计稿的px，插件会自动转换成rem用于移动端响应式设计
4.webpack4或者之前的file-loader和url-loader等被webpack5弃用了，直接用webpack5的asset来完成相同的功能
5.本地node服务器用webpack-dev-server插件来实现，用于热替换
6.html插件用到了HtmlWebpackPlugin；文件拷贝插件用了copy-webpack-plugin
7.打包脚本用了dll优化，把外部第三方框架统一打成一个包，一方面可以利用缓存，另一方面也提升热替换时的编译事件，修改本地开发文件后瞬间能刷新。
  dll优化有一点比较麻烦，如果外部框架有改动的话，发布前需要重新打包dll文件；一般依赖的第三方框架基本不会变动，所以只要在项目开始的时候打包一次即可，后续再也不用打包dll。
8.站点用了纯前端的mock数据，实现原理非常简单，自己创建一个mock.js[export的是json结构数据]，里面放mock数据，然后再通用的代码里用异步加载的方式加载mock数据
  但这样会有一个页面的数据过多的问题，所以加载mock数据的前提是url后面有mock参数，才会异步加载mock数据的js文件；ajax接口统一配置了mock参数，mock设置位true才使用mock数据
  其实说白了就2点：
              1.url后面添加mock，决定是否异步拉取mock文件夹里面的mock数据；
              2.ajax请求的参数里面添加mock，决定是否使用这个mock数据；




命令如下：
    本地开发启动命令 ： npm start
    开发环境打包命令：npm run dev（基本不用，因为本地文件修改后，webpack-dev-server会自动在内存中修改内容；如果自己想看本地开发打包后的文件结构，可以执行该命令）
    线上环境打包命令：npm run prod
    开发环境dll打包：npm run dll-dev
    线上环境dll打包：npm run dll-prod


完整的本地开发打包流程：
  1.npm run dll-dev :项目初次打包或者依赖的第三放框架有改动，才需要执行这个命令，否则不需要执行它
  2.npm run start：运行本地项目，然后就可以在浏览器中输入开发地址【例如http://localhost:8080/recommend/app/vue_demo/index.html】，访问开发页面


完整的发布前打包流程：
  1.npm run dll-prod:项目初次打包或者依赖的第三放框架有改动，发布之前才需要执行这个命令，否则不需要执行它
  2.npm run prod:把本地静态文件全部打包到dist文件夹里面，然后把dist文件发到cdn静态服务器，就可以了



文件结构说明：
    build：本地打包服务启动相关的js文件/
        webpack.config.base.js:本地打包基础文件，dev和prod打包都基于这个文件
        webpack.config.dev.js：本地dev环境打包脚本文件，npm run dev和npm start，执行的都是这个文件
        webpack.config.prod.js：上线之前的打包脚本，npm run prod执行的是这个文件
        webpack.config.dll.dev.js: dev环境下打包dll文件【非必须打包，项目首次或者项目内第三放框架改动，才需要执行】
        webpack.config.dll.prod.js: 上线之前打包dll文件【非必须打包，项目首次或者项目内第三放框架改动，才需要执行】


    dist：打包后的文件存放的文件夹，
          执行webpack-dev-server的时候，把文件放在内存里，如果想看打包后的真实的文件结构，可以执行npm run dev
          本地打包但不要压缩，执行npm run dev，可以在这个文件夹里面看打包但不压缩的文件
          本地打包且压缩，执行npm run prod，
          
    mock：mock数据文件夹
    src:开发目录
    	app：具体的业务目录，里面每一个子文件夹代表一个页面
    	common：所有页面的公共js，scss，图片，iconfont等
    		pc：pc公共部分
    		mc：移动端公共部分

    components：所有页面的公共组件
    libs：公共的js基础函数库





注意事项：
1.本站点是纯前端项目，目的在于让“前后端分离”，所以本地的html文件，其实都是模仿服务端html文件，最终这些html文件是不会被用到的，因为前后端分歧，html文件是在服务端动态生成的
2.本站点的纯前端代码如何同服务端集成：
  npm run prod打包执行后，会产生dist文件夹，里面就是dns服务器用到的前端静态文件，这些文件都会被静态服务器配置一个路由，或者直接放入后端的开发环境，让后端配置一个指向dist文件夹的路由
  静态文件里面asset-mapping.json的文件，对象的属性名作为服务端html里面需要配置的静态资源相对路径，对象属性名对应的值，就是静态文件带有hash的值【用于版本控制和去缓存】；
  例如服务端的html文件里面，写一个bound("/recommend/app/react_demo/bundle.js")作为内容，这个bund函数会根据asset-mapping.json文件输出它对应的值“/recommend/app/react_demo/bundle-2022_6_17_1655445603375.js”

这样的好处是，不管后端是用php，node或者是java开发的，都可以根据这个mapping文件夹去做集成，需要做的只有2件事情：
    第一是给dist文件夹指定一个服务端路由
    第二就是根据mapping文件，在服务端的html里面添加对应的js和css文件，并设置bound函数做mapping【只需要一次集成，后面所有的发布，都会自动根据dist文件夹中最新的assets-mapping文件来更新】
    


