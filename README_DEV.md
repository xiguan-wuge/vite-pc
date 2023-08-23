# 开发记录
- 按照文档引入插件在vite中配置icon按需引入，未生效
- 踩坑：Menu组件递归调用自身时，el-icon组件未生效。原因，script setup中 组件名默认取文件名，若要自定义文件名，有两种方式:
  1. app.component(xxx.name, xxx), 全局注册组件
  2. defineOPtions [参考](https://cn.vuejs.org/api/sfc-script-setup.html#defineoptions)
  3. 借助插件 'vite-plugin-vue-setup-extend', 直接在script标签中设置name值 [参考](https://github.com/chenxch/unplugin-vue-setup-extend-plus)
- 踩坑： 动态添加的路由刷新之后显示404  
  原因： 动态路由还未添加到router，就触发了404路由的匹配； 需要修改登录逻辑和动态添加路由的逻辑  
  解决：
    1. 404路由改为作为最后的动态路由添加到router
    2. 添加路由钩子，beforeEach中判断是否登录，在登录页面完成后 获取用户信息，获取需要添加的动态路由，然后缓存到pinia中，在store/user模块中 处理用户信息和动态路由