const multer = require("multer")
const shortid = require('short-id')
const IPFS = require('ipfs-http-client')
const { Readable } = require('stream')
const ipfs = IPFS.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
})

function routes(app, db, lms, accounts){
  let users = db.collection('music-users')
  let music = db.collection('music-store')

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
  app.post('/upload',
    multer({//middleware
      storage: multer.memoryStorage(),
      limits: {
        fields: 1,
        fieldSize: Math.pow(1000, 2), // limit size file 10MB
        files: 1,
        parts: 2
      }
    }).single('fileUploaded'),
    async (req, res)=>{
      let file = req.file//no multiple files
      if(file && req.body.user){
        const readableStream = new Readable()
        readableStream.push(file.buffer)
        readableStream.push(null)
        const ipfsHash = await ipfs.add(readableStream)// storage set
        file.hash = ipfsHash.cid.toString()
        file.id = shortid.generate() + shortid.generate()
        file.user = req.body.user
        lms.sendIPFS(file.id, file.hash, {from: accounts[0]})
        .then((_hash, _address)=>{
          delete file.buffer
          music.insertOne(file)// database set
          res.json({status: true, file})
        })
        .catch(err=>{
          res.json({ status: false, reason: err.message})
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
            let stream = ipfs.cat(hash)// storage get
            for await (const chunk of stream){
              res.write(chunk)
            }
            res.end()
            //res.set('content-type', 'audio/mpeg')
            //res.set('accept-ranges', 'bytes')
          })
          .catch(err=>{
            res.json({ status: false, reason: err.message})
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
