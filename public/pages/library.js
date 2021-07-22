var Library = {
  components: {itemList},
  template: `
    <div>
      <h1>Library</h1>
      <p>This is library page</p>
      <itemList :items="$store.state.items"/>
    </div>
  `
};