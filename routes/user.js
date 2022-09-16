const express = require('express');
const router = express.Router();
const db = require('../models/DBconfig');
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

router.post('/register', (req, res) => {
    const name = req.body.name;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const mobile = req.body.mobile;
    const address = req.body.address;
    var samplefile;
    var uploadpath;
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
        res.redirect('/register');
    }else{
        if(!req.files || Object.keys(req.files).length === 0)
    {
        return res.status(400).send('No files were uploaded.');
    }
    samplefile = req.files.filename;
    const filename = samplefile.name;
    uploadpath = __dirname + '/images/' + samplefile.name;
    //console.log(uploadpath);
    samplefile.mv(uploadpath, (err) => {
        if(err){
            //return res.status(500).send(err);
            res.send(err);
        }else{
            var sql = `INSERT into tbl_student (name, username, email, password, mobile, address, filename) VALUES ("${name}", "${username}", "${email}", "${password}", "${mobile}", "${address}", "${filename}")`;
            db.query(sql, (err, result)=>{
                if(err) throw err;
                console.log('record inserted');
                req.flash('success', 'Data Inserted successfully!');
            })
            req.flash('success', 'Sample Data Register');
            res.redirect('/');
            //res.send('File Uploaded!');
        }
    })
    }
})

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

router.get("/", (req,res, next)=> {
    db.query("SELECT * FROM tbl_student WHERE is_deleted=0", (err, data) => {
        if(err){
            //req.flash('error', err);
            //console.log(err)
            res.render('index', {title: "Home - Page", data:''});
        }
        else{
            //console.log(result)
            res.render('index', {title: "Home - Page", userData:data, active: { index: true }, message:req.flash('success')});
        }
        //res.send(result);
        //res.sendFile(__dirname + '/views/index');
    });
})
//edit data
router.get('/edit/:id', (req,res,next) => {
    var id = req.params.id;
    var query = (`SELECT * FROM tbl_student WHERE id = "${id}"`);
    db.query(query, (err, data) => {
        res.render('edit', {title: "Edit Page", row:data});
    })
})

router.post('/edit', (req,res,next) => {
    var id = req.body.id;
    var name = req.body.name;
    var username = req.body.username;
    var email = req.body.email;
    var mobile = req.body.mobile;
    var address = req.body.address;

    var query = `UPDATE tbl_student SET name="${name}", username="${username}", email="${email}", mobile="${mobile}", address="${address}" WHERE id="${id}"`;
    db.query(query, (err, data)=>{
        if(err){
            throw err;
        }else{
            req.flash('success', 'Sample Data Updated');
            res.redirect('/');
        }
    })
})

router.get('/delete/:id', (req,res,next) => {
    var id = req.params.id;
    var deleted = '1';
    var query = `UPDATE tbl_student SET is_deleted="${deleted}" WHERE id="${id}"`;
    db.query(query, (err, data)=>{
        if(err){
            throw err;
        }else{
            req.flash('success', 'Sample Data Deleted');
            res.redirect('/');
        }
    })
})

module.exports = router;