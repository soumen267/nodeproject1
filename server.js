const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
var session = require('express-session');
var flash = require('connect-flash');
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const userRoute = require('./routes/user');
const fileUpload = require('express-fileupload');
//const oneDay = 1000 * 60 * 60 * 24;
var app = express();

var port = 3000;

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', extname: '.handlebars', }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/routes/views/'));
app.use(express.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(expressValidator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: "webslesson",
    saveUninitialized: false,
    cookie: {maxAge: 60000},
    resave: false
}));

// app.use((err,req,res,next) => {
//     res.status(err.status || 500);
//     res.send(err.message);
// })

app.use(flash());
app.use(fileUpload());
app.use('/', userRoute);
app.use("/bootstrap", express.static(__dirname+"/node_modules/bootstrap/dist"));

//404 custom error 
app.use((req,res,next) => {
    res.status(404).render('404', {title: "404 Page"});
});

app.listen(port, err => {
    if(err){
        return console.log("ERROR", err)
    }
    console.log(`Server is running on port http://localhost:${port}`);
})

module.exports = app;