const uploadForm = {

  data(){
    return {
      loading: false,
      files: null,
      fileUploaded: null,
    }
  },

  methods: {
    async upload(){
      this.loading = true
      let formData = new FormData()
      //no multiple files
      formData.append('fileUploaded', this.files[0])
      formData.append('user', this.$store.state.user.email)
      try {// consume data
        const response = await axios.post('/upload', formData, {
          headers: {'Content-Type': 'multipart/form-data'}
        })
        if(response.data.status){// able
          console.log("able")
          this.fileUploaded = response.data.file
          this.files = null
          this.loading = false
        }else{// notify
          this.$store.commit('setAlert', {type: 'danger', message: response.data.reason})
          console.log(response.data.reason)
          this.loading = false
        }
      } catch (error) {// notify
        this.$store.commit('setAlert', {type: 'danger', message: error})
        console.error(error)
        this.loading = false
      }
    },

    previewFiles(){
      this.files = this.$refs.myBuffer.files
    },

    reset(){
      this.fileUploaded = null
      this.files = null
    }
  },

  computed: {
    getRoutePlayer() {
      return this.fileUploaded ? "/access/" + this.$store.state.user.email + "/" + this.fileUploaded.id : ""
    }
  },

  template: `
  <div>
    <form name='file' @submit.prevent='upload' v-if='!fileUploaded'>
      <div class='form-group'>
        <label for='buffer'>File</label>
        <input
          id='buffer'
          ref='myBuffer'
          class='form-control'
          type='file'
          @change='previewFiles'
          required
        >
        </input>
      </div>
      <div class='form-group'>
        <button v-if='!loading' type='submit' class='btn btn-primary btn-block'>
          Upload
        </button>
        <button v-else class="btn btn-primary btn-block" disabled>
          <div class="spinner-border" role="status">Loading...</div>
        </button>
      </div>
    </form>

    <div style="max-width: 250px; margin: 0 auto;" v-else>
      <button
        @click="$router.push(getRoutePlayer)"
        class="btn btn-success btn-block">Play</button>
      <button
        class="btn btn-secondary btn-block"
        @click='reset()'
      >Upload another file</button>
    </div>

  </div>`
}
