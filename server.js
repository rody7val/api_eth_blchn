//.env data
require('dotenv').config()

//app
const bodyParser = require('body-parser')
const express = require('express')
const https = require('https')
const cors = require('cors')
const path = require('path')
const Web3 = require('web3')
const fs = require('fs')
const api = require('./api')
const mongodb = require('mongodb').MongoClient
const artifacts = require('./build/Inbox.json')
const contract = require('truffle-contract')
const app = express()

// parse application x-www-form-urlencoded and json
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors())

// public folder
app.use(express.static(path.join(__dirname, 'public')))

// get and set contract provider
if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}
const LMS = contract(artifacts)
LMS.setProvider(web3.currentProvider)

// data base
mongodb.connect(process.env.DB || 'mongodb://localhost:27017/mydb', {useUnifiedTopology: true}, async(err,client) => {
  if (err) {//error handler
    return console.error(err.message)
  }

  const port = process.env.PORT || 8082
  const db = client.db(process.env.CLUSTER_NAME || 'Cluster01')
  const accounts = await web3.eth.getAccounts()
  const lms = await LMS.deployed()
  //const lms = LMS.at(contract_address)// for remote nodes deployed on ropsten or rinkeby

  //run app
  api(app, db, lms, accounts)
  const server = app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })

  //https
  //const options = {
    //key: fs.readFileSync(process.env.KEY_FILE || null).toString(),
    //cert: fs.readFileSync(process.env.CERT_FILE || null).toString()
  //}
  //const serverSecure = https.createServer({}, app)
  //serverSecure.listen(8443, () => {
  //  console.log(`And listening server secure on port ${8443}`)
  //})
})

