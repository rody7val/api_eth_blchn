const itemList = {
  props: {
    items: {type: String},
  },

  async mounted() {
    try {// consume data
      const response = await axios.get('/access/'+localStorage.getItem('session'))
      if(response.data.status){// able
        this.$store.commit('setItems', response.data.items.reverse())
        console.log(response.data.items.length)
      }else{
        this.$store.commit('setAlert', {type: 'danger', message: response.data.reason})
      }
    }catch(error) {// notify
      this.$store.commit('setAlert', {type: 'danger', message: error})
      console.error(error);
    }
  },

  template: `
    <div class='list-group text-left items'>
      <a
        v-for='item in items'
        target='_blank'
        :href="'/access/'+item.user+'/'+item.id"
        class='
          list-group-item
          list-group-item-action
          flex-column
          align-items-start
        '
      >
        <div class='d-flex w-100 justify-content-between'>
          <h5 class='mb-1'>{{item.originalname}}</h5>
          <small>{{item.mimetype}}</small>
        </div>
        <p class='mb-1'>{{item.user}}</p>
        <small>{{Number((item.size/1024)/1024).toFixed(1)}}MB</small>
      </a>
    </div>
  `
}