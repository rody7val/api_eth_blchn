const uploadForm = {

  data() {
    return {
      song: {
        buffer: null,
        name: null,
        title: null,
        user: null
      }
    }
  },

  methods: {
    async upload(){
      let song = {
        buffer: this.$refs.myBuffer.files[0],
        name: this.song.name,
        title: this.song.title,
        user: this.$store.state.user.email
      }
      try {// consume data
      	console.log(song)
        const response = await axios.post('/upload', song);
        if(response.data.status){// able
          console.log("able")
        }else{// notify
          this.$store.commit('setAlert', {type: 'danger', message: response.data.reason})
          console.log(response.data.reason);
        }
      } catch (error) {// notify
        this.$store.commit('setAlert', {type: 'danger', message: error})
        console.error(error);
      }
    },

    previewFiles(){
    	const buffer = this.$refs.myBuffer.files[0]
    	console.log(buffer)
      this.song.buffer = buffer
    }
  },

  template: `
    <form @submit.prevent='upload'>
      <div class='form-group'>
        <label for='buffer'>Song</label>
        <input
          id='buffer'
          ref='myBuffer'
          @change="previewFiles"
          class='form-control'
          type='file'
          required
        >
        </input>

        <label for="title">Title</label>
        <input
          id="title"
          name="title"
          v-model='song.title'
          placeholder='Title'
          class='form-control'
          type='text'
          required
        >
        </input>
      </div>

      <button type='submit' class='btn btn-primary btn-block'>Upload</button>
    </form>
  `
}
