import Vue from 'vue';
import VueRouter from 'vue-router';
import Layout from '../views/Layout.vue';
import Home from '../views/Home/Home.vue';
import BlogList from '../views/Blog/BlogList.vue';
import BlogDetail from '../views/Blog/BlogDetail.vue';
import UserLogin from '../views/User/UserLogin.vue';
import UserList from '../views/User/UserList.vue';
import UserCenter from '../views/User/UserCenter.vue';
import Document from '../views/Document/Document.vue';

Vue.use(VueRouter);

const routes = [{
  path: '/login',
  name: 'UserLogin',
  component: UserLogin,
}, {
  path: '/',
  component: Layout,
  children: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      meta: [{ name: '首页', url: '/' }],
    },
    {
      path: '/blog',
      name: 'BlogList',
      component: BlogList,
      meta: [{ name: '首页', url: '/' }, { name: '文章管理', }, { name: '文章列表' }],
    },
    {
      path: '/blog/:id',
      name: 'BlogDetail',
      component: BlogDetail,
      meta: [{ name: '首页', url: '/' }, { name: '文章管理', url: '/blog' }, { name: '文章详情' }],
    },
    {
      path: '/user',
      name: 'UserList',
      component: UserList,
      meta: [{ name: '首页', url: '/' }, { name: '用户管理', }, { name: '用户列表' }],
    },
    {
      path: '/me',
      name: 'UserCenter',
      component: UserCenter,
      meta: [{ name: '首页', url: '/' }, { name: '个人中心' }],
    },
    {
      path: '/document',
      name: 'Document',
      component: Document,
      meta: [{ name: '首页', url: '/' }, { name: '接口文档' }],
    },
  ],
}];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
