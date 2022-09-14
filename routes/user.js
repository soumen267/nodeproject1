const express = require('express');
const router = express.Router();
const db = require('../models/DBconfig');
//const { response } = require('../server');
// router.get('/', (req, res) => {
//     //res.send('Hello');
//     res.sendFile(__dirname + '/views/index.html');
//     //res.render('index', {})
// })
router.get('/about', (req, res) => {
    res.render('about', {title: "About", active: { about: true }});
})

router.get('/register', (req, res) => {
    res.render('register', {title: "Register", active: { register: true }});
})

router.get('/login', (req, res) => {
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
            res.redirect('/');
            //res.send('File Uploaded!');
        }
    })
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
            res.end;
        })
    }else{
        res.send('Please enter username and password');
        res.end;
    }
})

// router.use((req, res) => {
//     res.status(404);
//     res.render('404');
//     res.header("Content-Type", "text/html");
// })
router.get('/welcome', (req,res) => {
    if(req.session.loggedin){
        res.send(req.session.username);
    }else{
        res.send('Please login to view this page!');
    }
    res.end();
})

router.get("/", (req,res)=> {
    db.query("SELECT * FROM tbl_student", (err, data) => {
        if(err){
            //req.flash('error', err);
            //console.log(err)
            res.render('index', {title: "Home - Page", data:''});
        }
        else{
            //console.log(result)
            res.render('index', {title: "Home - Page", userData:data, active: { index: true }});
        }
        //res.send(result);
        //res.sendFile(__dirname + '/views/index');
    });
})

router.get('/edit/:id', (req,res) => {
    var id = req.params.id;
    var query = (`SELECT * FROM tbl_student WHERE id = "${id}"`);
    db.query(query, (err, data) => {
        res.render('edit', {row:data});
    })
})

module.exports = router;