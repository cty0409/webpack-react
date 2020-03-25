//************loader: 转换器，将A文件进行编译形成B文件，这里操作的是文件 */
/**
 * 高级的语法转为低级的语法
 * @babel/core 转换传入的js代码
 * @babel/preset-env用来兼容不同的浏览器，因为不同浏览器对es语法兼容性不同
 * @babel/preset-react用来对react语法进行转换
 * @babel/plugin-syntax-dynamic-import用来解析识别import( )的动态语法，并不是转换
 * @babel/plugin-transform-runtime用来转换es6以后的新api，比如generator函数
 */

/**
 * css-loader用来加载css文件
 * style-loader使用<style>标签将css-loader内部样式注入到html里面
 * postcss-loader使用后借助autoprefixer可以自动添加兼容各种浏览器的css前缀
 * autoprefixer自动添加各种浏览器css前缀
 */

 /**
 *node-sass 安装node解析sass的服务 
 *（这里有一个less和sass的区别，less是基于JavaScript的在客户端处理，sass是基础ruby的所以在服务端处理 ）
 *sass-loader 解析并打包sass，scss文件
 */

 
 /**
 *url-loader 使用base64码加载文件，依赖于file-loader，可以设置limit属性当文件小于1m时使用file-loader
 *file-loader 直接加载文件
 */


//  **********plugins:扩展器，它丰富了wepack本身，针对是loader结束后，webpack打包的整个过程，它并不直接操作文件，而是基于事件机制工作，会监听webpack打包过程中的某些节点
 /**
  * html-webpack-plugin  为webpack创建一个html文件的模板
  *clean-webpack-plugin 下次打包时自动将上次已经打包完成的文件自动清除
*/

 /**
  * mini-css-extract-plugin 打包css、less、sass、scss文件
*/

//**********devServer：用来提高开发效率，可以用来设置热更新，反向代理等功能 */

//****resolve:webpack在启动后会在入口模块处寻找所有依赖的模块，resolve配置webpack如何去寻找这些模块对应的文件 */

//**********devtool: 方便进行开发调试代码 */
/**
 * source-map 源码调试时会产生一个source map文件，出错了会报出当前出错的行和列
 *inline-source-map 不会产生一个source map文件，但出错了会报出当前出错的行和列
 */

const path = require('path')
const Webpack = require('webpack');
const isDev = process.env.NODE_ENV === 'development' ? true : false //自动检测是否为开发环境
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
    mode:isDev ? 'development':'production',//默认是两种模式 development 未压缩js production 压缩js
    entry: { //path.resolve():  把一个路径或路径片段的序列解析为一个绝对路径。
        // _dirname代表的是当前文件的绝对路径,从右至左解析，遇到了绝对路径/src/index.js，直接返回
        index: [path.join(__dirname,'/src/index.js')]
    },
    output: {
        filename:'[name].[hash:8].js', //配置入口文件打包后的名字，为了区分名字使用hash加密
        chunkFilename:'[name].[chunkhash:8].js', //配置无入口处的chunk文件在打包后的名字,如index.js里导入的外部的js文件
        path:path.join(__dirname,'/dist')  //文件打包后存放的位置 dist文件夹  
    },
    module: { //解析模块：test检测某一类的文件, use表示进行转换时，应该使用哪个 loader
        rules: [
            {   //解析css样式
                test:/\.css$/,
                use:[
                    {loader:'style-loader'},
                    {
                        loader:'css-loader',
                        options:{
                            modules: true,
                            localIdentName: '[name]__[local]-[hash:base64:5]'
                        }
                    },
                    {
                        loader:'postcss-loader',
                        options:{
                            plugins:[require('autoprefixer')]
                        }
                    }
                ]
            },
            { //解析less样式
                test:/\.less$/,
                use:[
                    {loader:'style-loader'},
                    {loader:'css-loader'},
                    {loader:'less-loader'},
                    {
                        loader:'postcss-loader',
                        options:{
                            plugins:[require('autoprefixer')]
                        }
                    }
                ]
            },
            {   //解析js高级语
                test: /\.js[x]?$/, //匹配文件
                exclude:/node_modules/, //排除node_modules的解析，减少不必的解析时间
                include: path.join(__dirname,'/src') ,//将路径片段使用特定的分隔符（window：\）连接起来形成路径，在此是针对src里的文件进行解析
                use:[{ 
                    loader:'babel-loader?cacheDirectory=true', 
                    options:{ //根据babel-loader配置，具体配置项根据不同的loader
                        presets:['@babel/preset-env','@babel/preset-react'],
                        plugins:['@babel/plugin-syntax-dynamic-import',['@babel/plugin-transform-runtime']]
                    }
                }]
            }, 
            {   //解析图片文件
                test:/\.(png|jpg|jpeg|gif)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:1024, //小于1m时使用url-loader
                        fallback:{
                            loader:'file-loader',
                            options:{
                                name:'img/[name].[hash:8].[ext]' //创建一个img的文件夹并将图片存入
                            }
                        }
                    }
                }
            },
            {   //解析音频，视频文件
                test:/\.(mp4|mp3|webm|ogg|wav)$/,
                use:{
                    loader:'url-loader',
                    options:{
                        limit:1024,
                        fallback:{
                            loader:'file-loader',
                            options:{
                                name:'media/[name].[hash:8].[ext]'
                            }
                        }
                    }
                }
            },
        ]

    },
    plugins:[
        new Webpack.HotModuleReplacementPlugin(), //webpack的热更新模块，进而实现热更新
        new HtmlWebpackPlugin({ //创建html模板的函数
            title:'主页', //生成html页面的标题
            filename:'index.html', //打包后的html文件名字
            template: path.join(__dirname,'/index.html'), //指令作为模板的html文件
            chunk:'all' //当你需要将entry入口的多文件全部打包作为script标签引入时选择all
        }),
        new CleanWebpackPlugin(), //默认清除指定的打包后的文件夹  
    ],
    devServer:{
        hot:true, //模块热更新
        contentBase: path.join(__dirname,'/dist'), //设置开启http服务的根目录
        historyApiFallback:true, //当路由命中一个路径后，默认返还一个html页面，解决白屏问题
        compress:true, //启动gzip压缩
        open:true, //启动完成后自动打开页面
        overlay:{
            error:true, //在浏览器全屏显示编译中的error
        },
        port:3000, //启动的端口号
        host:'localhost', //启动的ip
    },
    // resolve:{
    //     // exclude:['node_modules'], //去哪些地方寻找第三方模块,默认是在node_modules下寻找
    //     extensions:['js','jsx','json'], //当导入文件没有带后缀时，webpack会去自动寻找这种后缀的文件
    //     alias:{
    //         '@src':path.join(__dirname,'/src'), //将原导入路径设置成新的路径，就不需要每次导入时带很长的斜杠了
    //     }
    // },
    devtool:'inline-source-map'
}

module.exports = config
