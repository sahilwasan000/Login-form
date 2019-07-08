const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
var nodemailer = require("nodemailer");

const app = express();

const {mongoose} = require('./db/mongoose');
const {User} = require('./models/user');
const {validateRegisteredUser} = require('./routes/register');
const {validateLoginUser} = require('./routes/login');

app.use('/', express.static(path.join(__dirname, 'public')));

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


app.get('/',function(req,res){
  res.sendfile('./index.html');
});


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
          res.redirect('/success.html');
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

      if(isMatch) res.redirect('/login-success.html');

      //   const payload = {
      //   id: user.id,
      //   name: user.name
      // };
      // jwt.sign(payload, 'abc123', {
      //       expiresIn: 31556926
      //     },
      //      (err, token) => {
      //       res.json({
      //       success: true,
      //       token: "Bearer " + token
      //      // res.redirect('/login.html');
      //     });

      else {
        return res
        .status(400)
        .json({ passwordincorrect: "Password incorrect" });
      }
    });
  });
});

var smtpTransport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: "sahilwasan000@gmail.com",
    pass: "Sahil@!1234"
  }
});

app.get('/send',function(req,res){
  var mailOptions={
    to : req.query.to,
    subject : req.query.subject,
    text : req.query.text
  };

  console.log(mailOptions);

  smtpTransport.sendMail(mailOptions, function(error, response){
    if(error){
      console.log(error);
      res.end("error");
    }else{
      res.send("sent");
      res.redirect('./index.html');
    }
  });
});

app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

module.exports = {app};
