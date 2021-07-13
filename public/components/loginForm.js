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
      try {
        const response = await axios.post('/login', {email: this.user.email});
        if(response.data.status){
          //logined
          this.$store.commit("auth", response.data.user)
          this.$router.push('/')
        }else{
          console.log(response.data.reason);
        }
      } catch (error) {
        console.error(error);
      }
    },
  },

  template: `
    <form @submit.prevent="login">
      <div class="form-group">
        <label for="email">Email</label>
        <input
          id="email"
          v-model='user.email'
          placeholder='email'
          class='form-control'
          type='email'>
        </input>
      </div>

      <button type="submit" class="btn btn-primary">Login</button>
    </form> 
  `
}