import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueResource from "vue-resource";
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import Register from './component/register/Register.vue'
import LogIn from './component/login/LogIn.vue'
Vue.use(BootstrapVue)
Vue.use(VueResource)

new Vue({
  el: '#app',
  render: h => h(App)
})
