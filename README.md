# template_basic_vue_front_weixinin_shx
基于陕西小程序的代码模板

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
``` js
// 1、安装微信开发者工具后
- 点击设置--->代理设置--->打开系统代理
- 点击设置--->安全设置--->打开服务端口
// 2、项目根目录下创建openDevTools/config.js，配置本地的微信开发者工具的安装目录，方便运行的时候自动打开工具，内容如下
// 开发文件不上传
const config = {
  weixin: {
    path: "D://myport//install//微信web开发者工具",
  },
};
module.exports = config;
// 3、运行命令 （1，2步骤只在第一次使用时操作，开发者必须为运行环境中小程序的开发者）
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
