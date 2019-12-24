import Vue from 'vue';
import moment from 'moment';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Vue.use(ElementUI);

Vue.filter('formatTime', (value) => {
  if (!value) return '';
  return moment(value).format('YYYY/MM/DD hh:mm:ss');
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
