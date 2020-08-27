import Vue from 'vue'
import App from './App.vue'
import router from './router'

// IMPORT AXIOS ET CONFIGURATION
import axios from "axios";
axios.defaults.baseURL = 'http://localhost:3000/api/';
const token = sessionStorage.getItem('token')
if (token) {
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + token;
}
Vue.prototype.$axios = axios;
// FIN AXIOS

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
