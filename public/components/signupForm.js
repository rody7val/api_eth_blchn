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
      try {
        const response = await axios.post('/register', {email: this.user.email});
        if(response.data.status){
          //registered
          this.$store.commit('auth', response.data.user)
          this.$router.push('/')
        }else{
          this.$store.commit('alert', {type: 'danger', message: response.data.reason})
          console.log(response.data.reason);
        }
      } catch (error) {
        this.$store.commit('alert', {type: 'danger', message: error})
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
      <button type='submit' class='btn btn-primary'>Login</button>
    </form>
  `
}