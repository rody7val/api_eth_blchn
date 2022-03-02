// Store
const store = new Vuex.Store({
  state: {
    user: null,
    alert: null,
    items: null,
    dropdown: false,
    collapse: null,
  },
  mutations: {
    setAuth(state, user) {state.user = user},
    setAlert(state, alert) {state.alert = alert},
    setItems(state, items) {state.items = items},
    setDropdown(state, dropdown) {state.dropdown = dropdown},
    handleCollapse(state, id) {
      if (state.collapse === id) {
        state.collapse = null
        document.getElementById(id).classList.toggle('collapsed')
        return false
      }
      state.collapse = id
      document.getElementById(id).classList.toggle('collapsed')
    }
  },
});

// Routes
const routes = [
  {path: '/', component: Home},
  {path: '/upload', component: Upload, meta: { requiresAuth: true }},
  {path: '/library', component: Library, meta: { requiresAuth: true }},
  {path: '/register', component: Register},
  {path: '/login', component: Login},
  {path: '*', component: _404}
];

const router = new VueRouter({
  //mode: 'history',
  scrollBehavior: () => ({ x: 0, y: 0 }),
  routes: routes,
  base: '/'
});

router.beforeEach((to, from, next) => {// redirect if no login
  if (to.matched.some(record => record.meta.requiresAuth)){
    if (!store.state.user && !localStorage.getItem('session')){
      next({
        path: '/login',
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
        console.log(error);
      }
    }
  },

  computed: {
    // to bootstrap class
    getDropdownStyle(){
      return this.$store.state.dropdown ? 'show' : ''
    },
    // links layout
    authLinks() {
      return [
        {label: "Register", to: "/register"},
        {label: "Login", to: "/login"},
      ]
    },
    userLinks() {
      return [
        {label: "Library", to: "/library"},
        {label: "Upload", to: "/upload"},
      ]
    },
    dappLinks() {
      return [
        {label: "Home", to: "/"},
        {label: "404", to: "/route_not_found"},
      ]
    },
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
