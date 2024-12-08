//import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import Index from './Index.vue'
import Main from './Main.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name:'index', component: Index },
  { path: '/main', name:'main', component: Main }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

createApp(App).use(router).mount('#app')
