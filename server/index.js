

const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { MongoClient, ServerApiVersion } = require('mongodb');
require('dotenv').config()

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.3zv4n.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;
const app = express()

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('images'));
app.use(fileUpload());



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
const imagesCollection = client.db("imageUpload").collection("aboutImages");
  
app.post('/addImage', (req, res) => {
    const file = req.files.file;
    const info = req.body;

    console.log(file, info);
    file.mv(`${__dirname}/images/${file.name}`, err=> {
      if(err) {
        console.log(err);
        return res.status(500).send({msg: 'Faild to upload Image'});
      }

      const newFile = {img: file.name};
      const newInfo = {...info, ...newFile};
      imagesCollection.insertOne(newInfo)
      .then(result => {
        return res.send({name: file.name, path: `/${file.name}`});
      })
    })
  })
 
  app.get('/allImages', (req, res) => {
    imagesCollection.find({})
    .toArray((err, document) => {
      res.send(document);
      console.log(document);
    })
  })
   
});

const port = process.env.PORT || 5000 ;
app.listen(port)