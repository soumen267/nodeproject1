const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
var flash = require('express-flash');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require("cookie-parser");
const userRoute = require('./routes/user');
const fileUpload = require('express-fileupload');
//const empController = require('./controller/empController');
//const { json } = require('express');
const oneDay = 1000 * 60 * 60 * 24;
var app = express();

var port = 3000;

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main', extname: '.handlebars', }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/routes/views/'));
app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized: true,
    //cookie: {max: oneDay},
    resave: false
}));

app.use(flash());
app.use(fileUpload());
app.use('/', userRoute);

app.listen(port, err => {
    if(err){
        return console.log("ERROR", err)
    }
    console.log(`Server is running on port http://localhost:${port}`);
})

//app.use('/employee', empController);
module.exports = app;