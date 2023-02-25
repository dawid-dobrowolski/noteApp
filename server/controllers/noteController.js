const connection = require('../database/connection');

exports.createNote = (req,res) => {
    if(Object.keys(req.body).length === 0) {
        res.status(400).send({message:"Body cannot be empty"});
        return;
    }
    var {note_title, note_text, note_favorite, note_color} = req.body;
    var ses = req.session.passport;
    var user_id = ses.user;
    var note_short = note_text.substring(0,90);
    if(note_favorite == null) note_favorite = 0;
    connection.query('INSERT INTO note SET ?', {note_title:note_title, note_text: note_text, note_favorite: note_favorite, 
        note_color: note_color,note_text_short: note_short,user_id:user_id}, (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            res.statusCode = 302;
                res.setHeader('Location','/homepage');
                // return res.render('../views/login', {message:"Account sucesfully created"});
                return res.end();
        }
    })
}

exports.getNote = (req,res) => {
    let paramString = req.url.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        note_id = pair[1];
    }

    connection.query('SELECT * FROM note WHERE note_id=?', [note_id], (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            return res.send(result);
        }
    })
}

exports.getNotes = (req,res) => {
    if(Object.keys(req.body).length === 0) {
        res.status(400).send({message:"Body cannot be empty"});
        return;
    }
    const {user_id} = req.body;
    connection.query('SELECT * FROM note WHERE user_id=?', [user_id], (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            return res.send(result);
        }
    })
}

exports.getFavoriteNotes = (req,res) => {
    if(Object.keys(req.body).length === 0) {
        res.status(400).send({message:"Body cannot be empty"});
        return;
    }
    const {user_id} = req.body;
    connection.query('SELECT * FROM note WHERE user_id=? and note_favorite = 1', [user_id], (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            return res.send(result);
        }
    })
}

exports.updateNote = (req,res) => {
    if(Object.keys(req.body).length === 0) {
        res.status(400).send({message:"Body cannot be empty"});
        return;
    }
    var {note_title, note_text, note_favorite, note_color} = req.body;
    var note_short = note_text.substring(0,90);
    if(note_favorite == null) note_favorite = 0;
    connection.query('UPDATE note SET note_title=?,note_text=?,note_text_short=?,note_favorite=?,note_color=? WHERE note_id = ?',
    [note_title, note_text, note_short, note_favorite, note_color, note_id], (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            res.statusCode = 302;
                res.setHeader('Location','/homepage');
                // return res.render('../views/login', {message:"Account sucesfully created"});
                return res.end();
        }
    })
}

exports.deleteNote = (req,res) => {

    let paramString = req.url.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        note_id = pair[1];
    }
    connection.query('DELETE FROM note WHERE note_id=?', [note_id], (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            res.redirect('/homepage');
        }
    })
}