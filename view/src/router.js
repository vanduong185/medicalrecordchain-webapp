import Vue from 'vue'
import Router from 'vue-router'
import Register from './component/Register/Register.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
        path:'/register',
        name: 'register',
        comments: Register
    }
  ]
})