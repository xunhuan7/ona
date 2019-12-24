import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../views/Layout.vue';
import Login from '../views/Login/Login.vue';
import User from '../views/User/User.vue';
import BlogList from '../views/BlogList/BlogList.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/login',
  name: 'Login',
  component: Login,
}, {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/user',
      name: 'User',
      component: User,
    },
  ],
}, {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/blog',
      name: 'BlogList',
      component: BlogList,
    },
  ],
}];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
