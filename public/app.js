// Store
const store = new Vuex.Store({
  state: {
    user: null,
    alert: null,
    dropdown: false
  },
  mutations: {
    setAuth(state, user) {state.user = user},
    setAlert(state, alert) {state.alert = alert},
    setDropdown(state, dropdown) {state.dropdown = dropdown},
  }
});

// Routes
const routes = [
  {path: '/', component: Home},
  {path: '/upload', component: Upload, meta: { requiresAuth: true }},
  {path: '/library', component: Library, meta: { requiresAuth: true }},
  //{path: '/player/:id', component: PlayerId, meta: { requiresAuth: true }},
  {path: '/register', component: Register},
  {path: '/login', component: Login},
  {path: '*', component: _404}
];

const router = new VueRouter({
  //mode: "history",
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: routes,
  base: '/'
});

router.beforeEach((to, from, next) => {// redirect if no login
  if (to.matched.some(record => record.meta.requiresAuth)){
    if (!store.state.user && !localStorage.getItem('session')){
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

  async mounted() {
    const session = localStorage.getItem('session')
    if (session){
      try {// consume data
        const response = await axios.post('/login', {email: session});
        if(response.data.status){// able
          this.$store.commit('setAuth', response.data.user)
          localStorage.setItem('session', session)
        }else{// notify
          this.$store.commit('setAlert', {type: 'danger', message: response.data.reason})
          console.log(response.data.reason);
        }
      } catch (error) {// notify
        this.$store.commit('setAlert', {type: 'danger', message: error})
        console.error(error);
      }
    }
  },

  computed: {
    getDropdownStyle(){// to bootstrap class
      return this.$store.state.dropdown ? 'show' : ''
    }
  },

  methods: {
    handleDropdown(){
      this.$store.commit('setDropdown', !this.$store.state.dropdown)
    },

    quit(){
      this.$store.commit('setAuth', null)
      localStorage.removeItem('session')
      this.$router.push('/')
    }
  },
});