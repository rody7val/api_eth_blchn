// Routes
const routes = [
  { path: '/', component: Home },
  { path: '/upload', component: Upload },
  { path: '/library', component: Library },
  { path: '/player', component: Player },
  { path: '/register', component: Register },
  { path: '/login', component: Login },
];

const router = new VueRouter({
  routes: routes,
  base: '/'
});

// Store
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  }
})

// Vue Instance
const app = new Vue({
  el: '#app',
  router,
  store
})