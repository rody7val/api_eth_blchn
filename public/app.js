// Routes
const routes = [
  {path: '/', component: Home},
  {path: '/upload', component: Upload},
  {path: '/library', component: Library},
  {path: '/player', component: Player},
  {path: '/register', component: Register},
  {path: '/login', component: Login},
];

const router = new VueRouter({
  routes: routes,
  base: '/'
});

// Store
const store = new Vuex.Store({
  state: {
    user: null,
    alert: null
  },
  mutations: {
    auth(state, user) {state.user = user},
    alert(state, alert) {state.alert = alert}
  }
});

// Vue Instance
const app = new Vue({
  components: {alert},
  el: '#app',
  router,
  store
});