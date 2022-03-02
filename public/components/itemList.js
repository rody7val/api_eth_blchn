const itemList = {
  props: {
    items: {type: Array},
  },

  async mounted() {
    try {//if auth
      const response = await axios.get('/access/'+localStorage.getItem('session'))
      if(response.data.status){//get items
        this.$store.commit('setItems', response.data.items.reverse())
      }else{
        this.$store.commit('setAlert', {type: 'danger', message: response.data.reason})
      }
    }catch(error) {
      this.$store.commit('setAlert', {type: 'danger', message: error})
      console.error(error);
    }
  },

  methods: {
    collapse(id) {
      this.$store.commit("handleCollapse", id)
    },
  },

  computed: {
    idCollapse() {
      return this.$store.state.collapse
    }
  },

  template: `
    <div class='list-group text-left items'>
      <div
        v-for='(item, index) in items'
        class='
          list-group-item
          list-group-item-action
          flex-column
          align-items-start
        '
      >
        <div class='d-flex w-100 justify-content-between'>
          <h5 class='mb-1 ellipsis'>{{item.originalname}}</h5>
          <small>{{item.mimetype}}</small>
        </div>
        <div class='d-flex w-100 justify-content-between'>
          <small>{{Number((item.size/1024)/1024).toFixed(1)}}MB</small>

          <div>
            <a
              :href="'/access/'+item.user+'/'+item.id"
              target='_blank'
              class='btn btn-sm btn-link'
            >
              ▶️ play
            </a>
            <button
              @click="collapse(item.id)"
              class='btn btn-sm btn-secondary'
              style="line-height: .9;"
            >
              {{idCollapse === item.id ? 'menos' : 'más'}}
            </button>
          </div>
        </div>

        <div :id="item.id" class="section">
          <p v-if="item.from" class='mb-0'>
            <small>Ethereum contract address: <code>{{item.from}}</code></small>
          </p>
          <p v-if="item.transactionHash" class='mb-0'>
            <small>Tx hash: <code>{{item.transactionHash}}</code></small>
          </p>
          <p v-if="item.blockNumber" class='mb-0'>
            <small>Block number: <code>{{item.blockNumber}}</code></small>
          </p>
          <p v-if="item.gasUsed" class='mb-0'>
            <small>Gas used: <code>Ð {{item.gasUsed}} ETH</code></small>
          </p>
        </div>
      </div>
    </div>
  `
}