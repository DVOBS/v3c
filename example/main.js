import Vue from 'vue'
import v3c from '@/index.ts'
import App from './App.vue'

Vue.config.productionTip = false
Vue.use(v3c);

new Vue({
  render: (h) => h(App),
}).$mount('#app')
