// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from '../node_modules/element-ui';
import axios from 'axios'
import md5 from 'js-md5'

import '../node_modules/element-ui/lib/theme-chalk/index.css'
import './assets/commonCss.css'
import './assets/icon/iconfont.css'

import commentJs from './assets/commonJs'

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(commentJs);
Vue.prototype.$http = axios;
Vue.prototype.$md5 = md5;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

// axios 的一些全局配置
const baseUrl = 'http://121.40.47.149:8099/webapi/userService';
axios.interceptors.request.use(
  config => {
    if (config.url.indexOf(baseUrl) === -1 && config.url.indexOf('user_agreement') === -1) {
      config.url = baseUrl + config.url;
    }
    return  config;
  },
  err => {
    return Promise.reject(err);
  }
);