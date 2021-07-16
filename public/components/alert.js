const alert = {
  props: {
    message: {type: String},
    type: {type: String}
  },

  methods: {
    closeAlert() {
      this.$store.commit("setAlert", null)
    },
  },

  template: `
    <div
      v-if="$store.state.alert"
      :class="'alert alert-'+ type +' alert-dismissible fade show'"
    >
      {{message}}
      <button type="button" class="close" @click="closeAlert">
        <span aria-hidden="true">&times;</span>
      </button>
    </div> 
  `
}
