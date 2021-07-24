require('dotenv').config()
const path = require('path')
const cors = require('cors')
const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const routes = require('./routes')
const Web3 = require('web3')
const mongodb = require('mongodb').MongoClient
const contract = require('truffle-contract')
const artifacts = require('./build/Inbox.json')
// parse application x-www-form-urlencoded and json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())
// public folder
app.use(express.static(path.join(__dirname, 'public')))
// contracts
if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}
const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)
// data base
mongodb.connect(process.env.DB, {useUnifiedTopology: true}, async(err,client) => {
  if (err) return console.error(err.message)

  const port = process.env.PORT || 8082
  const db = client.db(process.env.CLUSTER_NAME)
  const accounts = await web3.eth.getAccounts()
  const lms = await LMS.deployed()
  //const lms = LMS.at(contract_address) for remote nodes deployed on ropsten or rinkeby

  routes(app, db, lms, accounts)

  app.listen(port, () => {
    console.log(`listening on port ${port}`)
  })
})
