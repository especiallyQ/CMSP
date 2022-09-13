import Vue from 'vue';
import axios from 'axios';
import promise from 'es6-promise';
promise.polyfill();
import App from './App';
/* 路由 */
import router from './router';
/* 缓存 */
import store from './store';
/* 国际化 */
import i18n from './lang';
/* 事件防抖节流 */
import _ from 'lodash';
/* element-ui */
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
/* element-ui工具:指令接收1个函数,当鼠标点击的区域在绑定指令的元素之外时,触发函数 */
import Clickoutside from 'element-ui/src/utils/clickoutside';
/* json格式展示 */
import JsonViewer from 'vue-json-viewer';
/* 剪贴板 */
import VueClipboard from 'vue-clipboard2';
/* echarts图表 */
import * as echarts from 'echarts';
/* 大屏布局方案&全屏工具 */
import 'lib-flexible/flexible';
import fullscreen from 'vue-fullscreen';
/* 解决v-html可能导致的XSS漏洞,使用v-dompurify-html替代 */
import VueDOMPurifyHTML from 'vue-dompurify-html';
/* 富文本编辑器 */
import mavonEditor from 'mavon-editor';
import 'mavon-editor/dist/css/index.css';
/* cookies工具 */
import Cookies from 'js-cookie';
import { getCookie, setCookie, delCookie } from './util/util';
/* 标准图标库 */
import '@/assets/icon/standard/iconfont.css';
import '@/assets/icon/standard/iconfont.js';
import '@/assets/icon/standard/iconfont_cmsp.css';
/* 扩展图标库 */
import '@/assets/icon/extension/iconfont.css';
import '@/assets/icon/extension/iconfont.js';
import '@/assets/icon/extension/iconfont_ext.css';
/* 公共样式表 */
import '@/assets/css/common.css';
/* 错误码 */
import errcode from './util/errcode';
import { chooseLang } from './util/errcode.js';
/* 消息弹窗 */
import { message } from '@/util/message.js';
/* 合约模板SVG图标 */
import './svgIcons';
/* 全局配置 */
import { getConfigOpt } from './util/config.js';

Vue.use(router);
Vue.use(ElementUI, {
    size: Cookies.get('size') || 'medium',
    i18n: (key, value) => i18n.t(key, value)
});
Vue.use(Clickoutside);
Vue.use(JsonViewer);
Vue.use(VueClipboard);
Vue.use(fullscreen);
Vue.use(VueDOMPurifyHTML);
Vue.use(mavonEditor);
Vue.prototype.$axios = axios;
Vue.prototype._ = _;
Vue.config.productionTip = false;
axios.defaults.headers.post['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.get['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.withCredentials = true;
Vue.prototype.$echarts = echarts;
Vue.prototype.getCookie = getCookie;
Vue.prototype.setCookie = setCookie;
Vue.prototype.delCookie = delCookie;
Vue.prototype.errcode = errcode;
Vue.prototype.$chooseLang = chooseLang;
Vue.prototype.$message = message;
Vue.prototype.$configOpt = getConfigOpt;

new Vue({
    el: '#app',
    router,
    store,
    i18n,
    components: { App },
    template: '<App/>'
});
