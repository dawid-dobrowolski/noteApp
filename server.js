const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const body_parser = require('body-parser'); 
const path = require('path');
const flash = require('express-flash');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy
const qs = require('qs');
const axios = require('axios');
const methodOverride = require('method-override');
require('dotenv').config();
const bcrypt = require('bcrypt');

var app = express();

app.use(morgan('tiny'));
app.use(session({
    secret: process.env.PRIVATE_KEY,
    cookie: {maxAge : 60*60*1000},
    resave: false ,
    saveUninitialized: false ,
}))
app.use(flash());
app.use(passport.session())
app.use(passport.initialize())
app.use(methodOverride('_method'));

app.use(body_parser.urlencoded({urlencoded:false}))
app.use('/css', express.static(path.resolve(__dirname, "assets/css")));
app.use('/js', express.static(path.resolve(__dirname, "assets/js")));
app.use('/img', express.static(path.resolve(__dirname, "assets/img")));

app.set("view engine", "ejs");

app.listen(process.env.PORT, function(err)
{
    if(err) 
        console.log('Critical error, app terminated');    
    else
        console.log('Server listen on port ' + process.env.PORT);
});

//load routes
app.use('/', require('./server/routes/router'))

authUser = (user, password, done) => {

    var data = qs.stringify({
      'email': user 
    });
    var config = {
      method: 'get',
      url: 'http://localhost:3000/api/user/getUser',
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data : data
    };
    
     axios(config)
    .then(function (response) {
      let hashPassword = response.data.user_password;
      bcrypt.compare(password, hashPassword, function(err,result) {
        if(response.data == 0) {
          return done(null,false);
        }
        else if(result) {
          let authenticated_user = { id: response.data.user_id, name: response.data.user_name}
          return done(null, authenticated_user) 
        }
        else {
          return done(null, false);
        }
      });
    })
    .catch(function (error) {
      console.log(error);
    });
}

passport.use(new LocalStrategy (authUser))

passport.serializeUser( (user, done) => { 
    done(null, user.id)
} )

passport.deserializeUser((id, done) => {
    var data = qs.stringify({
        'user_id': id 
      });
      var config = {
        method: 'get',
        url: 'http://localhost:3000/api/user/getUserById',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'connect.sid=s%3ALVnAI2Xupbfw8O1XC7h51FdMdJg9SF9j.d0fFe3URABbj2F%2Bnfpti6ie7ZN3FdlLANy8LKZutGHM'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        done(null, {name: response.data.user_name, id: response.data.user_id})
      })
      .catch(function (error) {
        console.log(error);
      });
}) 

app.post('/loginAuth', passport.authenticate('local', {
    successRedirect: '/homepage',
    failureRedirect: '/',
    failureFlash : true
}));