const shortid = require('short-id')
const IPFS = require('ipfs-api');
const ipfs = IPFS({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https'
});

function routes(app, dbe, lms, accounts){
  let users = dbe.collection('music-users');
  let music = dbe.collection('music-store');

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
      res.status(400).json({status: false, reason: 'wrong input'})
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
      res.status(400).json({status: false, reason: 'wrong input'})
    }
  })
  // POST /upload
  // Requirements: name, title of music, music file buffer or URL stored
  app.post('/upload', async (req, res)=>{
    let buffer = req.body.buffer
    let name = req.body.name
    let title = req.body.title
    let user = req.body.user
    let id = shortid.generate() + shortid.generate()
    if(buffer && name && title && user){
      console.log(buffer)
      let ipfsHash = await ipfs.add(buffer)
      let hash = ipfsHash[0].hash
      lms.sendIPFS(id, hash, {from: accounts[0]})
      .then((_hash, _address)=>{
        music.insertOne({id, hash, title, name})
        res.json({
          status: true,
          id
        })
      })
      .catch(err=>{
        res.json({
          status: false,
          reason: 'Upload error occured'
        })
      })
    }else{
      res.json({
        status: false,
        reason: 'wrong input'
      })
    }
  })
    // GET /access/{email}
    // Requirements: email
    app.get('/access/:email', (req,res)=>{
        if(req.params.email){
            users.findOne({email: req.body.email}, (err,doc)=>{
                if(doc){
                    let data = music.find().toArray()
                    res.json({
                      status: true,
                      data
                    })
                }
            })
        }else{
            res.status(400).json({
              status: false,
              reason: 'wrong input'
            })
        }
    })
    // GET /access/{email}/{id}
    // Requirements: email, id
    app.get('/access/:email/:id', (req,res)=>{
      let id = req.params.id
        if(req.params.id && req.params.email){
            users.findOne({email:req.body.email},(err,doc)=>{
                if(doc){
                    lms.getHash(id, {from: accounts[0]})
                    .then(async(hash)=>{
                        let data = await ipfs.files.get(hash)
                        res.json({
                          status: true,
                          data: data.content
                        })
                    })
                }else{
                    res.status(400).json({
                      status: false,
                      reason: 'wrong input'
                    })
                }
            })
        }else{
            res.status(400).json({
              status: false,
              reason: 'wrong input'
            })
        }
    })
}

module.exports = routes
