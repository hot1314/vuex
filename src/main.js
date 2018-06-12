// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuex from 'vuex'

Vue.config.productionTip = false; //阻止启动生产消息

/*路由拦截*/
router.beforeEach((to, from, next) => {
  var loginInfo = JSON.parse(localStorage.getItem("loginInfo"));
  if (!loginInfo) {
    if (to.path === '/'|| to.path === '/login') {
      next()
    }else{
      next('/login');
    }
  } else {
    next()
  }
});

/*使用vuex */
Vue.use(Vuex);
var store = new Vuex.Store({
  state: {
    newPageData: {},
    loadingShow: false
  },
  mutations: {
    setData: function (state, params) {
      state.newPageData = params;
    }
  },
  actions: {
    getData: function (context, $this) {
      //执行异步请求
      var params = {
        uid: 19,
        mid: 16,
        muid: 5
      };
      $this.$http.post('/api/app/User/userModulepp', params, {
        headers: {},
        emulateJSON: true
      }).then(function (response) {
        // 响应成功回调
        context.commit('setData', response.body.data);

      }, function (response) {
        // 响应错误回调
        console.log(response)
      });
    }
  }
});

/*请求拦截*/
Vue.http.interceptors.push((request, next)=> {
  store.state.loadingShow = true;
  next((response => {
    store.state.loadingShow = false;
  }));
});


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  created(){
    var _sel = this;
    this.$store.dispatch('getData', _sel); //模拟获取全局数据
  },
  components: {App},
  template: '<App/>'
})


