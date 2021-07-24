const loginForm = {
  data() {
    return {
      user: {
        email: '',
        //pass: ''
      }
    }
  },

  methods: {
    async login() {
      try {// consume data
        const response = await axios.post('/login', {email: this.user.email});
        if(response.data.status){// able
          this.$store.commit('setAuth', response.data.user)
          localStorage.setItem('session', response.data.user.email)
          this.$router.push('/')
        }else{// notify
          this.$store.commit('setAlert', {type: 'danger', message: response.data.reason})
          console.log(response.data.reason);
        }
      } catch (error) {// notify
        this.$store.commit('setAlert', {type: 'danger', message: error})
        console.log(error);
      }
    },
  },

  template: `
    <form @submit.prevent="login">
      <div class="form-group text-left">
        <label for="email">Email</label>
        <input
          id="email"
          v-model='user.email'
          placeholder='your@email.com'
          class='form-control'
          type='email'
          required
        >
        </input>
      </div>

      <button type="submit" class="btn btn-primary btn-block">Login</button>
    </form>
  `
}