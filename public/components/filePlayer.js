//const filePlayer = {
//  props: {
//    id: {type: String},
//    email: {type: String},
//  },
//
//  data(){
//  	return {
//  		load: true,
//  		buffer: null
//  	}
//  },
//
//  async mounted() {
//    try {// consume data
//      const response = await axios.get('/access/'+this.email+'/'+this.id);
//      if(response.data.status){// able
//        //this.$store.commit('setAuth', response.data.user)
//        //localStorage.setItem('session', response.data.user.email)
//        console.log(response.data.buffer)
//        this.load = false
//        this.buffer = response.data.buffer.data
//      }else{// notify
//        this.$store.commit('setAlert', {type: 'danger', message: response.data.reason})
//        console.log(response.data.reason);
//      }
//    } catch (error) {// notify
//      this.$store.commit('setAlert', {type: 'danger', message: error})
//      console.error(error);
//    }
//  },
//
//  template: `
//    <div>
//    	<div v-if="load">Loading...</div>
//      <audio v-else controls>
//        <source :src="buffer" type="audio/ogg">
//      	Your browser does not support the audio element.
//      </audio>
//    </div>
//  `
//}