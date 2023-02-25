const connection = require('../database/connection');
const bcrypt = require('bcrypt');

exports.createUser = async (req,res) => {
    console.log(req.body);
    if(Object.keys(req.body).length === 0) {
        return res.redirect('/register');
    }
    const{name, surname, email, password, passwordConfirmed} = req.body;
    
    if(password != passwordConfirmed) {
        req.flash("message", "Passwords are different");
        return res.redirect('/register');
    }

    connection.query('SELECT user_email FROM user Where user_email = ?', [email], async (error, result) => {
        if(error) {
            req.flash("message", "Internal error");
            return res.redirect('/register');
        }
        if(result.length > 0) 
        {
            req.flash("message", "Mail already in use");
            return res.redirect('/register');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(hashedPassword);
        connection.query('INSERT INTO user SET ?', {user_name:name, user_surname:surname,
            user_email:email, user_password:hashedPassword},(error, result) => {
            if(error) 
            {
                req.flash("message", "Internal error");
                return res.redirect('/register');
            }
            else 
            {
                req.flash("message", "Account sucesfully created");
                 return res.redirect('/');
            }
        });
    });
}

exports.getUser = async (req,res) => {
    if(Object.keys(req.body).length === 0) {
        return res.redirect('/');
    }
    const{email, password} = req.body;
    connection.query('SELECT * FROM user Where user_email = ?', [email], async (error, result) => {
        if(error) console.log(error);
        if(result.length == 0) {
            req.flash("message", "Account not found");
            return res.redirect('/');
         }
         return res.send(result[0]);
        });
}

exports.getUserById = async (req,res) => {
    if(Object.keys(req.body).length === 0) {
        res.status(400).send({message:"Body cannot be empty"});
        return;
    }
    const{user_id} = req.body;
    connection.query('SELECT * FROM user Where user_id = ?', [user_id], async (error, result) => {
        if(error) console.log(error);
        if(result.length == 0) {
            res.status(400).send({message:"Empty result"});
         }
         return res.send(result);
        });
}

exports.updateUser = (req,res) => {
    if(Object.keys(req.body).length === 0) {
        res.status(400).send({message:"Body cannot be empty"});
        return;
    }
    const{name, surname, email} = req.body;
    let paramString = req.url.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        user_id = pair[1];
    }
    connection.query('UPDATE user SET user_name=?, user_surname=?, user_email=? WHERE user_id = ?',
    [name, surname, email, user_id], (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            req.flash("message", "Account updated");
            return res.redirect('/profile');
        }
    })
}

exports.updateUserPassword = async (req,res) => {
    if(Object.keys(req.body).length === 0) {
        res.status(400).send({message:"Body cannot be empty"});
        return;
    }
    let{password, passwordConfirmed} = req.body;
    console.log(password);
    console.log(passwordConfirmed);
    let paramString = req.url.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        user_id = pair[1];
    }

    if(password != passwordConfirmed) {
        req.flash("message", "Password are different");
        return res.redirect('/profileSecurity');
    }
    password = await bcrypt.hash(password, 10);
    connection.query('UPDATE user SET user_password=? WHERE user_id = ?',
    [password, user_id], (error, result) => {
        if(error) {
            console.log(error);
        }
        else {
            req.flash("message", "Password updated");
            return res.redirect('/profile');
        }
    })
}

exports.deleteUser = (req,res) => {
    let paramString = req.url.split('?')[1];
    let queryString = new URLSearchParams(paramString);

    for (let pair of queryString.entries()) {
        user_id = pair[1];
    }
    connection.query('DELETE FROM user WHERE user_id = ?', [user_id], (error, result) => {
        if(error) {
            console.log(error);                
        }
        else {
            res.redirect('/logout');
        }
    });
}
