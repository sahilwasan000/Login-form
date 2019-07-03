const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {validateRegisteredUser} = require('./routes/register');
const {validateLoginUser} = require('./routes/login');


// Passport middleware
app.use(passport.initialize());

// Passport routes
require("./routes/passport")(passport);


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

// Route to register
app.post('/register', (req, res) => {
  const {errors, isValid} = validateRegisteredUser(req.body);

  //check if it isn't valid
  if(!isValid) {
    return res.status(400).json(errors);
  }

  //if it already exsits
  User.findOne({email: req.body.email}).then((user) => {
    if(user) {
      return res.status(401).json({email: 'Email already exists'});
    }

    //now save to db, create new user
    const newUser = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    //hash password before saving to db
    bcrypt.genSalt(10, (err,salt) => {
      bcrypt.hash(newUser.password, salt, (err, hash) => {

        if(err) throw err;
        newUser.password = hash;

        newUser.save().then((user) => {
          res.json(newUser);
        }).catch((e) => console.log(e));
      });
    });
  });
});

// Route to login
app.post('/login', (req, res) => {
  const {errors, isValid} = validateLoginUser(req.body);

  if(!isValid){
    return res.status(401).json(errors);
  }

  const email = req.body.email;
  const password = req.body.password;

  User.findOne({email}).then((user) => {
    if(!user){
      return res.status(401).json({emailnotfound: "Email Not Found."});
    }

    bcrypt.compare(password, user.password).then((isMatch) => {

      if(isMatch) {
        const payload = {
        id: user.id,
        name: user.name
      };

      jwt.sign(payload, 'abc123', {
            expiresIn: 31556926
          }, (err, token) => {
            res.json({
            success: true,
            token: "Bearer " + token
          });
        });
        }
        else {
          return res
            .status(400)
            .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});
// var newUser = new User({
//   name: 'Sahil',
//   email: 'sahil@gmail.com',
//   password: '1zss234'
// });
//
// newUser.save().then((doc) => {
//   console.log('user saved', doc);
// }, (e) => {
//   console.log('unable to save user');
// });

module.exports = {app};
