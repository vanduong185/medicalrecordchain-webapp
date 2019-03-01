import Vue from 'vue'
import App from './App.vue'
import BootstrapVue from 'bootstrap-vue'
import VueResource from "vue-resource";
import VueLocalStorage from 'vue-localstorage'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.use(VueResource)
Vue.use(VueLocalStorage)

new Vue({
  localStorage: {
    global: {
      type: Object,
      default: {
        user_id: null
      }
    }
  },
  el: '#app',
  render: h => h(App)
})
