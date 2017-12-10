const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var cors = require('cors');
var passport = require('passport');
var mongoose = require('mongoose');
const config = require('./config/database')

//Connect to database
mongoose.connection.openUri(config.database);

//On connection
mongoose.connection.on('connected', () => {
    console.log('connected to database' + config.database);
});

//On error
mongoose.connection.on('error', (err) => {
    console.log('Database error:' + err);
});

const app = express();

const users = require('./routes/users');


//Set port
app.set('port', (process.env.PORT || 3000));

//CORS middleware
app.use(cors());

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.get('/', function(req, res){
    res.send('Invalid Endpoint');
});

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

app.listen(app.get('port'), function(){
    console.log('Listening on port 3000...');
});
