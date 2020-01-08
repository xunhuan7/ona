import Vue from 'vue';
import moment from 'moment';
import VueCookies from 'vue-cookies';
import echarts from 'echarts';
import 'echarts/theme/macarons';
import 'echarts-wordcloud';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'element-ui/lib/theme-chalk/display.css';
import Quill from 'quill';
import { ImageDrop } from 'quill-image-drop-module';
import ImageResize from 'quill-image-resize-module';
import 'highlight.js/styles/monokai-sublime.css';
import VueQuillEditor from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';


import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;

Quill.register('modules/imageDrop', ImageDrop);
Quill.register('modules/imageResize', ImageResize);

Vue.prototype.$echarts = echarts;

Vue.use(VueCookies);
Vue.use(ElementUI);
Vue.use(VueQuillEditor);

Vue.filter('formatTime', (value) => {
  if (!value) return '';
  return moment(value)
    .format('YYYY/MM/DD hh:mm:ss');
});

Vue.filter('uppercase', (value) => {
  return value.toUpperCase();
});

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
