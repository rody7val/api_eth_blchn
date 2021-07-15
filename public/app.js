// Store
const store = new Vuex.Store({
  state: {
    user: null,
    alert: null,
    dropdown: false
  },
  mutations: {
    setAlert(state, alert) {state.alert = alert},
    setDropdown(state, dropdown) {state.dropdown = dropdown},
    setAuth(state, user) {state.user = user},
  }
});

// Routes
const routes = [
  {path: '/', component: Home},
  {path: '/upload', component: Upload, meta: { requiresAuth: true }},
  {path: '/library', component: Library, meta: { requiresAuth: true }},
  {path: '/player', component: Player, meta: { requiresAuth: true }},
  {path: '/register', component: Register},
  {path: '/login', component: Login},
  {path: '*', component: _404}
];

const router = new VueRouter({
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: routes,
  base: '/'
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!store.state.user) {
      next({
        path: '/',
        query: { redirect: to.fullPath }
      })
    } else {
      next()
    }
  } else {
    next()
  }
});

// Vue Instance
const app = new Vue({
  el: '#app',
  router,
  store,

  components: {alert},

  computed: {
    getDropdownStyle(){return this.$store.state.dropdown ? 'show' : ''}
  },

  methods: {
    handleDropdown(){
      $store.commit('setDropdown', !this.$store.state.dropdown)
    },
    quit(){
      this.$store.commit('setAuth', null)
      this.$router.push('/')
    }
  },
});