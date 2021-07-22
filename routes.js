const multer = require("multer")
const streamifier = require('streamifier')
//const fs = require('fs')
const shortid = require('short-id')
const IPFS = require('ipfs-api')
const ipfs = IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

function routes(app, dbe, lms, accounts){
  let users = dbe.collection('music-users')
  let music = dbe.collection('music-store')

  // POST /register
  // Requirements: email
  app.post('/register', (req, res)=>{
    let email = req.body.email
    let id = shortid.generate()
    if(email){
      users.findOne({email}, (err, doc)=>{
        if(doc){
          res.json({status: false, reason: 'Already registered'})
        }else{
          const user = {email, id}
          users.insertOne(user)
          res.json({status: true, user})
        }
      })
    }else{
      res.json({status: false, reason: 'wrong input'})
    }
  })

  // POST /login
  // Requirements: email
  app.post('/login', (req, res)=>{
    let email = req.body.email
    if(email){
      users.findOne({email}, (err, user)=>{
        if(user){
          res.json({status: true, user})
        }else{
          res.json({status: false, reason: 'Not recognised'})
        }
      })
    }else{
      res.json({status: false, reason: 'wrong input'})
    }
  })

  // POST /upload
  // Requirements: music file buffer or URL stored
  app.post('/upload', multer().array('fileUploaded'), async (req, res)=>{
    const file = req.files[0]//no multiple files
    const stream = streamifier.createReadStream(file.buffer)
    //const stream = fs.createReadStream(file.buffer)
    console.log(stream)
    if(stream && req.body.user){
      let ipfsHash = await ipfs.add(stream)// storage set
      file.hash = ipfsHash[0].hash
      file.id = shortid.generate() + shortid.generate()
      file.user = req.body.user
      lms.sendIPFS(file.id, file.hash, {from: accounts[0]})
      .then((_hash, _address)=>{
        delete file.buffer
        console.log(file)
        music.insertOne(file)// database set
        res.json({status: true, file})
      })
      .catch(err=>{
        res.json({ status: false, reason: 'Upload error occured'})
      })
    }else{
      res.json({status: false, reason: 'Wrong input'})
    }
  })

  // GET /access/{email}/{id}
  // Requirements: email, id
  app.get('/access/:email/:id', (req,res)=>{
    let id = req.params.id
    let email = req.params.email
    if(id && email){
      users.findOne({email},(err,doc)=>{// db get
        if(!err){
          lms.getHash(id, {from: accounts[0]})
          .then(async(hash)=>{
            let data = await ipfs.files.get(hash)// storage get
            const stream = streamifier.createReadStream(data[0].content)
            //console.log(doc)
            res.set('content-type', doc.mimetype)
            res.set('accept-ranges', 'bytes')
            stream.on('data', chunk => {
              res.write(chunk)
              console.log(chunk)
            })
            stream.on('end', chunk => {
              res.end()
            })
            //res.json({status: true, buffer: data[0].content})
          })
          .catch(err=>{
            res.json({ status: false, reason: 'Download error occured'})
          })
        }else{
          res.json({status: false, reason: 'Wrong input'})
        }
      })
    }else{
      res.json({status: false, reason: 'Wrong input'})
    }
  })

  // GET /access/{email}
  // Requirements: email
  app.get('/access/:email', (req,res)=>{
    let email = req.params.email
    if(email){
      users.findOne({email}, (err,doc)=>{
        if(doc){
          music.find().toArray((err, items)=>{
            if(err){
              res.json({status: false, reason: 'No documents found'})
            }else{
              res.json({status: true, items})
            }
          })
        }
      })
    }else{
      res.json({status: false, reason: 'wrong input'})
    }
  })
}

module.exports = routes
