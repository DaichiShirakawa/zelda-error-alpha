import Vue from 'vue';
import Router from 'vue-router';
import HelloWorld from '@/components/HelloWorld.vue';
import OtherPage from '@/components/OtherPage.vue';

Vue.use(Router);

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'HelloRouteName',
      component: HelloWorld,
    },
    {
      path: '/other',
      name: 'OtherRouteName',
      component: OtherPage,
    },
  ],
});
