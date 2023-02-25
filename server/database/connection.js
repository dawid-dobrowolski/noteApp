const mysql = require('mysql');
require('dotenv').config();

var connection = mysql.createConnection({
            host: process.env.DATABASE_HOST,
            user: process.env.DATABASE_USER,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_NAME       
});

connection.connect(function(err) {
    connection.query("CREATE TABLE IF NOT EXISTS `note` (`note_id` INT NOT NULL AUTO_INCREMENT,`note_title` VARCHAR(45) NOT NULL,`note_text` VARCHAR(10000) NOT NULL,`note_text_short` VARCHAR(90) NOT NULL,`note_color` VARCHAR(7) NOT NULL,`note_favorite` INT NOT NULL DEFAULT '0',`user_id` INT NOT NULL,PRIMARY KEY (`note_id`))", function (err, result) {
        if (err) throw err;
    });
    connection.query("CREATE TABLE IF NOT EXISTS `user` (`user_id` INT NOT NULL AUTO_INCREMENT,`user_name` VARCHAR(45) NOT NULL,`user_surname` VARCHAR(45) NOT NULL,`user_email` VARCHAR(45) NOT NULL,`user_password` VARCHAR(100) NOT NULL,PRIMARY KEY (`user_id`))", function (err, result) {
        if (err) throw err;
    });
});

module.exports = connection;