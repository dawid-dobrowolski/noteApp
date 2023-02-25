const axios = require('axios')
const qs = require('qs');


exports.loginRoutes = (req, res) => {
   const message = req.flash('message')
   console.log(message[0]);
    res.render('login', {message: message[0]});
}

exports.registerRoutes = (req, res) => {
  const message = req.flash('message')
    res.render('register', {message: message[0]});
}

exports.homepageRoutes = (req, res) => {
  var ses = req.session.passport;
    
  var data = qs.stringify({
        'user_id': ses.user 
      });
      var config = {
        method: 'get',
        url: 'http://localhost:3000/api/note/getNotes',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'connect.sid=s%3ALVnAI2Xupbfw8O1XC7h51FdMdJg9SF9j.d0fFe3URABbj2F%2Bnfpti6ie7ZN3FdlLANy8LKZutGHM'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        res.render('homepage', {notes:response.data})
      })
      .catch(function (error) {
        console.log(error);
      });
}

exports.addNewNoteRoutes = (req, res) => {
    res.render('addNote');
}

exports.updateNoteRoutes = (req, res) => {
  
  axios.get('http://localhost:3000/api/note/getNote', {params: {note_id: req.query.note_id}})
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    res.render('updateNote', {note:response.data})
  })
  .catch(function (error) {
    console.log(error);
  });
}

exports.deleteNoteRoutes = (req, res) => {
  console.log('WITAM')
  axios.get('http://localhost:3000/api/note/deleteNote', {params: {note_id: req.query.note_id}})
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    res.render('homepage')
  })
  .catch(function (error) {
    console.log(error);
  });
}

exports.favoritesNotesRoutes = (req, res) => {
  var ses = req.session.passport;
    var data = qs.stringify({
        'user_id': ses.user 
      });
      var config = {
        method: 'get',
        url: 'http://localhost:3000/api/note/getFavoriteNotes',
        headers: { 
          'Content-Type': 'application/x-www-form-urlencoded', 
          'Cookie': 'connect.sid=s%3ALVnAI2Xupbfw8O1XC7h51FdMdJg9SF9j.d0fFe3URABbj2F%2Bnfpti6ie7ZN3FdlLANy8LKZutGHM'
        },
        data : data
      };
      
      axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        res.render('favoritesNodes', {notes: response.data});
      })
      .catch(function (error) {
        console.log(error);
      });
}
exports.profileRoutes = (req, res) => {
  var ses = req.session.passport;
  const message = req.flash('message');
  var data = qs.stringify({
      'user_id': ses.user 
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
      console.log(JSON.stringify(response.data));
      res.render('profile', {user: response.data, message: message[0]});
    })
    .catch(function (error) {
      console.log(error);
    });
}

exports.profileSecurityRoutes = (req, res) => {
  const message = req.flash('message')
  var ses = req.session.passport;
  var data = qs.stringify({
      'user_id': ses.user 
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
      console.log(JSON.stringify(response.data));
      res.render('profileSecurity', {user: response.data, message: message[0]});
    })
    .catch(function (error) {
      console.log(error);
    });
}

exports.pageNotFoundRoutes = (req, res) => {
    res.render('404');
}

exports.homeRoutes = (req, res) => {
    res.render('login');
}