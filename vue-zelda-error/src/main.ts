import Router from '@/router';
import Vue from 'vue';
import App from './App.vue';
import store from './store';

Vue.config.productionTip = false;

new Vue({
  store,
  render: (h) => h(App),
  router: Router,
}).$mount('#app');
