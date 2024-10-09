const connectToMongo= require('./db');
const express = require('express')
const mongoose = require('mongoose')
var cors = require('cors')


connectToMongo();
// mongoose.connect(
//     process.env.MONGO_URL,
//     { useNewUrlParser: true, useUnifiedTopology: true},
//     () => {
//       console.log('Connected to MongoDB');
//     }
//   );
const app = express()
const port = 5000

app.use(cors());

app.use(express.json());

 app.use('/api/auth',require('./routes/auth'));
 app.use('/api/notes',require('./routes/notes'));


app.listen(port, () => {
  console.log(`iNotebook Backend listening on port ${port}`)
})
