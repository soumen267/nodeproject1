//MongoDB loclhost connection

var mongoClient = require("mongodb").MongoClient;

mongoClient.connect("mongodb://localhost:27017/my_db", (err, db) => {
    if(err) throw err;
    else{
        console.log("Mongodb Server Connected successfully");
    }
})

//mongoDB cloud (Atlas) connection
// const express = require('express');
// const mongoose = require("mongoose");
// const username = "soumen";
// const password = "soumen";
// const cluster = "cluster0.jg3ljbf";
// const dbName = "myDB";


// mongoose.connect(
//     `mongodb+srv://${username}:${password}@${cluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`, 
//     {
//         useNewUrlParser: true,
//         //useFindAndModify: false,
//         useUnifiedTopology: true
//     }
// );

// const mdb = mongoose.connection;
// mdb.on("error", console.error.bind(console, "conection error: "));
// mdb.once("open", function(){
//     console.log("Connected successfully");
// })