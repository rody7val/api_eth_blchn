require('dotenv').config()
const express = require('express')
const app = express()
const routes = require('./routes')
const Web3 = require('web3')
const mongodb = require('mongodb').MongoClient
const contract = require('truffle-contract')
app.use(express.json())

mongodb.connect(process.env.DB, {useUnifiedTopology: true}, (err, client) => {
  if (err) {
  	return console.error(err.message)
  }
  //home
  const db = client.db('mydb')
  const port = process.env.PORT || 8082
  routes(app,db)
  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
})