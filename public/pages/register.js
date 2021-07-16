var Register = {
  components: {signupForm},
  template: `
    <div>
      <h1>Register</h1>
      <p>
        <router-link to='/login' class='nav-link'>I am registered</router-link>
      </p>
      <signupForm/>
    </div>
  `
};
