const express = require('express');
const router = express.Router();
const db = require('../models/DBconfig');
// router.get('/', (req, res) => {
//     //res.send('Hello');
//     res.sendFile(__dirname + '/views/index.html');
//     //res.render('index', {})
// })
router.get('/create', (req, res) => {
    res.send('About Page');
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
            res.render('index', {title: "Home - Page", userData:data});
        }
        //res.send(result);
        //res.sendFile(__dirname + '/views/index');
    });
})

module.exports = router;