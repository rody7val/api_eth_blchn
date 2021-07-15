var Register = {
  components: {signupForm, alert},
  template: `
    <div>
      <h1>Register</h1>
      <p>
        <router-link to='/login' class='nav-link'>I am registered</router-link>
      </p>
      <alert v-if="$store.state.alert"
        :message="$store.state.alert.message"
        :type="$store.state.alert.type"/>
      <signupForm/>
    </div>
  `
};
