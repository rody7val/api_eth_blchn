const signupForm = {

  data() {
    return {
      user: {
        email: '',
        //password: ''
      }
    }
  },

  methods: {
    async register() {
      try {// consume data from vue dapp to mongodb using api blockchain ethereum
        const response = await axios.post('/register', {email: this.user.email});
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
        console.error(error);
      }
    },
  },

  template: `
    <form @submit.prevent='register'>
      <div class='form-group'>
        <label for='email'>Email</label>
        <input
          id='email'
          v-model='user.email'
          placeholder='your@email.com'
          class='form-control'
          type='email'
          required
        >
        </input>
      </div>
      <button type='submit' class='btn btn-primary btn-block'>Register</button>
    </form>
  `
}