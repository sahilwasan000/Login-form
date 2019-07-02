const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const {mongoose} = require('./db/mongoose');

const app = express();
const {User} = require('./models/user');

//-----------------------Without using mongoose----------------------//
// const {MongoClient} = require('mongodb');
//
// MongoClient.connect('mongodb://localhost:27017/Node-Form', (err, client) => {
//   if(err){
//     return console.log('Unable to connect to MongoDB server');
//   }
//     console.log('Connected to the server');
//
//     const db = client.db('Node-Form');
//
//     db.collection('Users').insertOne({
//       name: 'Keldrew Mogen',
//       password: 'abc1235'
//     }, (err, result) => {
//         if(err){
//           return console.log('unable to insert new user');
//         }
//
//         console.log(JSON.stringify(result.ops, undefined, 2));
//     });
//     client.close();
// });
//-----------------------------------------------

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', express.static(path.join(__dirname, 'public')));

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

var newUser = new User({
  name: 'Sahil',
  email: 'sahilmm@gmail.com',
  password: '1zss234'
});

newUser.save().then((doc) => {
  console.log('user saved', doc);
}, (e) => {
  console.log('unable to save user');
});

module.exports = {app};
