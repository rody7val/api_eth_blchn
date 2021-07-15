var Login = {
  components: {loginForm, alert},
  template: `
    <div>
      <h1>Login</h1>
      <p>
        <router-link to='/register' class='nav-link'>You are not registered?</router-link>
      </p>
      <alert v-if="$store.state.alert"
        :message="$store.state.alert.message"
        :type="$store.state.alert.type"/>
      <loginForm/>
    </div>
  `
};
