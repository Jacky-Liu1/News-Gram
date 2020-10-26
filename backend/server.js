const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Pusher = require('pusher');

const dummyData = require('./dummyData');
const schema = require('./model');

require('dotenv').config();

// config 
const app = express();
const port = process.env.PORT || 9000

// Real-time
const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: 'us2',
  usetls: true
});


// middlewares
app.use(express.json());
app.use(cors());  // handles header
/*
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*'),
    res.setHeader('Access-Control-Allow-Headers', '*'),
    next()
});
*/

// Connect to MongoDB
const connectionUrl = process.env.DB_URL
mongoose.connect(connectionUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
})



mongoose.connection.once('open', () => {
  console.log("Database connected")
  const changeStream = mongoose.connection.collection('schemas').watch()
  // when databases changes(Pusher) do this ....
  changeStream.on('change', (change) => {
    console.log("change triggered on pusher")
    console.log(change)
    if (change.operationType === 'insert') {
      const postDetails = change.fullDocument;
      pusher.trigger('posts', 'inserted', {
        title: postDetails.title,
        picUrl: postDetails.picUrl,
        upvotes: postDetails.upvotes,
        downvotes: postDetails.downvotes,
        comments: postDetails.comments,
        description: postDetails.description,
        date: postDetails.date
      })
    }
    else {
      console.log("Unknown trigger from Pusher")
    }
  })
})

// endpoints
app.get('/', (req, res) =>
  res.send('hello world')
);

app.get('/NewsGram/posts/', (req, res) => {
  //res.send(dummyData)
});

//retrieves all data from MongoDB(can also filter)
app.get('/NewsGram/posts/api/123456', (req, res) => {
  /*
  schema.find({}, (err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data)
  })
  */
  schema.find((err, data) => {
    err ? res.status(500).send(err) : res.status(200).send(data)
  })
})

// Add data to MongoDB database
// This was used in development
// Go to Postman -> Post -> Paste json data -> click send
app.post('/NewsGram/posts/api/123456', (req, res) => {  // sends post to database
  /*
  const dbPosts = req.body;  // json user sends 
  schema.create(dbPosts, (err, data) => {   // data is the json returned in Postman
    err ? res.status(500).send(err) : res.status(201).send(data);
  })
  */
  const body = req.body
  schema.create(body, (err, data) => {
    err ? res.status(500).send(err) : res.status(201).send(data);
  })
});



app.put('/NewsGram/posts/api/123456', (req, res) => {

})



// listen 
app.listen(port, () => console.log(`Server started on port ${port}`));



