const express = require('express');
const mysql = require("mysql");

const db = mysql.createConnection({
    user: "root",
    host: "localhost",
    password: "",
    database: "testdb",
})
db.connect((err) =>{
    if(err) throw err;
    console.log('Database is connected successfully!');
})

module.exports = db;