const express = require('express');
const path = require('path');
const exphbs  = require('express-handlebars');
// const flash = require('express-flash');
// const session = require('express-session');
const bodyParser = require('body-parser');
//app.use(flash());

//const empController = require('./controller/empController');
//const { json } = require('express');

var app = express();

var port = 3000;

app.use(bodyParser.urlencoded({extended: true}))

const userRoute = require('./routes/user');

app.engine('handlebars', exphbs.engine({ defaultLayout: false }));
app.set('view engine', 'handlebars');

app.use('/', userRoute);

app.post('/quotes', (req, res) => {
    console.log(req.body)
})

app.use(express.static(path.join(__dirname, 'public')));

//app.use(bodyParser, json());

app.set('views', path.join(__dirname, '/routes/views/'));

app.listen(port, err => {
    if(err){
        return console.log("ERROR", err)
    }
    console.log(`Server is running on port http://localhost:${port}`);
})

//app.use('/employee', empController);
module.exports = app;