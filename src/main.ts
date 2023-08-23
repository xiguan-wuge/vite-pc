import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import pinia from './store'
import globalComponents from '@/components/index.ts'
import '@/router/permission'
const app = createApp(App)
app.use(router)
app.use(pinia)
app.use(globalComponents)

app.mount('#app')
