import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueRouter from 'vue-router'

Vue.use(VueAxios, axios)

Vue.config.productionTip = false

const router = new VueRouter({
  mode: 'history',
  routes: []
});

Vue.use(VueRouter, router);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
