import { createApp } from 'vue'
import './style.css'
import App from './App.vue'

import ElementUI from 'element-plus'
import 'element-plus/dist/index.css'

import route from './router/routers'
import Cookie from 'vue-cookies'

const app = createApp(App)
app.use(ElementUI)
.use(route)
.use(Cookie)
.mount('#app')
