const express = require('express');
const router = express.Router();
//const db = require('../models/DBconfig');
const mdb = require('../models/mongoDB');
var MongoClient = require("mongodb").MongoClient;

//const mdb = require('../models/mongoDB');
//const { response } = require('../server');
// router.get('/', (req, res) => {
//     //res.send('Hello');
//     res.sendFile(__dirname + '/views/index.html');
//     //res.render('index', {})
// })
router.get('/about', (req, res, next) => {
    res.render('about', {title: "About", active: { about: true }});
})

router.get('/register', (req, res, next) => {
    res.render('register', {title: "Register", active: { register: true }, success: req.session.success, errors: req.session.errors });
})

router.get('/login', (req, res, next) => {
    res.render('login', {title: "Login", active: { login: true }});
})

MongoClient.connect("mongodb://localhost:27017/my_db")
    .then(client => {
    var dbs = client.db('test_db')
    const quotesCollection = dbs.collection('tbl_student')
    router.post('/register', (req, result) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const mobile = req.body.mobile;
    const address = req.body.address;
//     var samplefile;
//     var uploadpath;
        req.checkBody('name', 'Name is required.').notEmpty();
        req.checkBody('username', 'Username is required.').notEmpty();
        req.checkBody('email', 'Email is required.').notEmpty().isEmail();
        req.checkBody('password', 'Password is required.').notEmpty().isLength({min:1});
        req.checkBody('mobile', 'Mobile is required.').notEmpty().isMobilePhone;
        req.checkBody('address', 'Address is required.').notEmpty();

        var errors = req.validationErrors();
        if(errors){
            req.session.errors = errors;
            req.session.success = false;
            result.redirect('/register');
        }else{
        quotesCollection.insertOne(req.body)
        .then(res => {
            console.log(res)
            result.redirect('/');
        })
        .catch(err => console.log(err))
        }
        });
    router.get("/", (req,res, next)=> {
        dbs.collection('tbl_student').find({"is-deleted":"0"}).toArray()
        .then(result => {
            console.log(result)
            res.render('index', {title: "Home - Page", userData:result});
        })
        .catch(err => console.log(err))
    })
    router.get('/edit/:id', (req,res,next) => {
        var id = req.params.id;
        var ObjectId = require('mongodb').ObjectId;
        var o_id = new ObjectId(id);
        console.log(id)
        dbs.collection("tbl_student").find({_id:ObjectId(o_id)}).toArray()
        .then(result => {
            //console.log(result)
            res.render('edit', {title: "Edit Page", row:result});
        })
    })
    router.post('/edit', (req,res,next) => {
        var id = req.body.id;
        var name = req.body.name;
        var username = req.body.username;
        var email = req.body.email;
        var mobile = req.body.mobile;
        var address = req.body.address;
        var ObjectId = require('mongodb').ObjectId;
        var o_id = new ObjectId(id);
        dbs.collection("tbl_student").updateOne({_id:ObjectId(o_id)},{$set: {'name':name, 'username':username, 'email':email, 'mobile':mobile, 'address':address}})
        .then(result => {
            console.log(result)
            req.flash('success', 'Sample Data Updated');
            res.redirect('/');
        })
        
    })

    router.get('/delete/:id', (req,res,next) => {
        var id = req.params.id;
        //console.log(id)
        var deleted = '1';
        var ObjectId = require('mongodb').ObjectId;
        var o_id = new ObjectId(id);
        //dbs.collection("tbl_student").deleteOne({_id:ObjectId(o_id)})
        dbs.collection("tbl_student").updateOne({_id:ObjectId(o_id)}, {$set: {"is-deleted":deleted}})
        .then(result => {
            //console.log(result)
            req.flash('success', 'Sample Data Deleted');
            res.redirect('/');
        })
    })

});

//SQL register postdata
// router.post('/register', (req, res) => {
//     const name = req.body.name;
//     const username = req.body.username;
//     const email = req.body.email;
//     const password = req.body.password;
//     const mobile = req.body.mobile;
//     const address = req.body.address;
//     var samplefile;
//     var uploadpath;
//     req.checkBody('name', 'Name is required.').notEmpty();
//     req.checkBody('username', 'Username is required.').notEmpty();
//     req.checkBody('email', 'Email is required.').notEmpty().isEmail();
//     req.checkBody('password', 'Password is required.').notEmpty().isLength({min:1});
//     req.checkBody('mobile', 'Mobile is required.').notEmpty().isMobilePhone;
//     req.checkBody('address', 'Address is required.').notEmpty();

//     var errors = req.validationErrors();

//     if(errors){
//         req.session.errors = errors;
//         req.session.success = false;
//         res.redirect('/register');
//     }else{
//         if(!req.files || Object.keys(req.files).length === 0)
//     {
//         return res.status(400).send('No files were uploaded.');
//     }
//     samplefile = req.files.filename;
//     const filename = samplefile.name;
//     uploadpath = __dirname + '/images/' + samplefile.name;
//     //console.log(uploadpath);
//     samplefile.mv(uploadpath, (err) => {
//         if(err){
//             //return res.status(500).send(err);
//             res.send(err);
//         }else{
//             var sql = `INSERT into tbl_student (name, username, email, password, mobile, address, filename) VALUES ("${name}", "${username}", "${email}", "${password}", "${mobile}", "${address}", "${filename}")`;
//             db.query(sql, (err, result)=>{
//                 if(err) throw err;
//                 console.log('record inserted');
//                 req.flash('success', 'Data Inserted successfully!');
//             })
//             req.flash('success', 'Sample Data Register');
//             res.redirect('/');
//             //res.send('File Uploaded!');
//         }
//     })
//     }
// })

router.post('/login', (req, res) => {
    let username = req.body.username;
    let password = req.body.password;
    if(username && password){
        db.query('SELECT * FROM tbl_student WHERE username = ? AND password = ?', [username, password], (err, results, fields) => {
            if(err) throw err;
            if(results.length > 0){
                req.session.loggedin = true;
                req.session.username = username;
                console.log('login successful');
                res.redirect('/welcome');
            }else{
                console.log('Invalid credentials!');
            }
        })
    }else{
        res.send('Please enter username and password');
    }
})

router.get('/welcome', (req,res) => {
    if(req.session.loggedin){
        res.send(req.session.username);
    }else{
        res.send('Please login to view this page!');
    }
})
// router.get("/", (req,res, next)=> {
//     db.query("SELECT * FROM tbl_student WHERE is_deleted=0", (err, data) => {
//         if(err){
//             //req.flash('error', err);
//             //console.log(err)
//             res.render('index', {title: "Home - Page", data:''});
//         }
//         else{
//             //console.log(result)
//             res.render('index', {title: "Home - Page", userData:data, active: { index: true }, message:req.flash('success')});
//         }
//         //res.send(result);
//         //res.sendFile(__dirname + '/views/index');
//     });
// })
//edit data
// router.get('/edit/:id', (req,res,next) => {
//     var id = req.params.id;
//     var query = (`SELECT * FROM tbl_student WHERE id = "${id}"`);
//     db.query(query, (err, data) => {
//         res.render('edit', {title: "Edit Page", row:data});
//     })
// })

// router.post('/edit', (req,res,next) => {
//     var id = req.body.id;
//     var name = req.body.name;
//     var username = req.body.username;
//     var email = req.body.email;
//     var mobile = req.body.mobile;
//     var address = req.body.address;

//     var query = `UPDATE tbl_student SET name="${name}", username="${username}", email="${email}", mobile="${mobile}", address="${address}" WHERE id="${id}"`;
//     db.query(query, (err, data)=>{
//         if(err){
//             throw err;
//         }else{
//             req.flash('success', 'Sample Data Updated');
//             res.redirect('/');
//         }
//     })
// })

// router.get('/delete/:id', (req,res,next) => {
//     var id = req.params.id;
//     var deleted = '1';
//     var query = `UPDATE tbl_student SET is_deleted="${deleted}" WHERE id="${id}"`;
//     db.query(query, (err, data)=>{
//         if(err){
//             throw err;
//         }else{
//             req.flash('success', 'Sample Data Deleted');
//             res.redirect('/');
//         }
//     })
// })

module.exports = router;