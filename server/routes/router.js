const express = require('express');
const route = express.Router()
const axios = require('axios');


const services = require('../services/render');
const userController = require('../controllers/userController');
const noteController = require('../controllers/noteController');


route.get('/', checkNotAuth, services.loginRoutes);

route.get('/register',checkNotAuth, services.registerRoutes);

route.get('/homepage', checkAuth, services.homepageRoutes);

route.get('/add-note', checkAuth, services.addNewNoteRoutes);

route.get('/update-note', checkAuth, services.updateNoteRoutes);

route.get('/delete-note', checkAuth, services.deleteNoteRoutes);

route.get('/favorites-notes', checkAuth, services.favoritesNotesRoutes);

route.get('/profile', checkAuth, services.profileRoutes);

route.get('/profileSecurity', checkAuth, services.profileSecurityRoutes);

route.delete('/logout', function(req, res, next) {
    req.logOut(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });

route.get('/logout', function(req, res, next) {
    req.logOut(function(err) {
      if (err) { return next(err); }
      res.redirect('/');
    });
  });


route.post('/api/user/addUser', userController.createUser);
route.get('/api/user/getUser', userController.getUser);
route.get('/api/user/getUserById', userController.getUserById);
route.post('/api/user/updateUser', userController.updateUser);
route.post('/api/user/updateUserPassword', userController.updateUserPassword);
route.post('/api/user/deleteUser', userController.deleteUser);

route.post('/api/note/addNote', noteController.createNote);
route.get('/api/note/getNote', noteController.getNote);
route.get('/api/note/getNotes', noteController.getNotes);
route.get('/api/note/getFavoriteNotes', noteController.getFavoriteNotes);
route.post('/api/note/updateNote', noteController.updateNote);
route.post('/api/note/deleteNote', noteController.deleteNote);

function checkAuth(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function checkNotAuth(req, res, next) {
    if(req.isAuthenticated()) {
        return res.redirect('/');
    }
    next()
}

// route.get('*', services.pageNotFoundRoutes);
module.exports = route