var Login = {
  components: {loginForm},
  template: `
    <div>
      <h1>Login</h1>
      <p>
        <router-link to="/register" class="nav-link">it's not registered?</router-link>
      </p>
      <loginForm/>
    </div>
  `
};
