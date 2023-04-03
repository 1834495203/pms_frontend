import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

import route from './router/routers'
import Cookie from 'vue-cookies'

const app = createApp(App)
app.use(ElementUI, {locale: zhCn,})
.use(route)
.use(Cookie)
.mount('#app')
