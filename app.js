// const headers = {
//     headers: {'Authorization': 'Bearer 8qms8lWUbIxGyzgZAxkuwMQLJrwY'}
// };

const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const cookieParser = require('cookie-parser');
const http = require('http');
const socketIO = require('socket.io');
const axios = require('axios');
const User = require('./models/user');

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
const server = module.exports = http.createServer(app);
//const io = socketIO(server);

const users = require('./routes/users');
const accounts = require('./routes/accounts');


//Set port
app.set('port', (process.env.PORT || 3000));

app.use(cookieParser());

//CORS middleware
app.use(cors({credentials: true, origin: 'http://localhost:4200'}));

//Set static folder
app.use(express.static(path.join(__dirname, 'public')));

//Body Parser Middleware
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.use('/accounts', accounts);

app.get('/', function(req, res){
    res.send('Invalid Endpoint');
});


//With callbacks 

// function getQuote(socket, position, token, callback){
//     //console.log('in getQuotes');
//     const headers = {
//         headers: {'Authorization':'Bearer '+token}
//     };
//     var url = `https://api.tradier.com/v1/markets/quotes?symbols=${position.symbol}`;
//     axios.get(url, headers)
//     .then((response) => {
//         //console.log(response.data.quotes.quote);

//         position.ask_price = response.data.quotes.quote.ask;
//         position.volume = response.data.quotes.quote.volume;
//         position.current_value = (position.ask_price * position.quantity * 100) - 5;
//         position.unrealized_profit_loss = position.current_value - position.cost_basis - 5;
        
//         //console.log('Position', position);
//         callback(undefined, position);

//     })
//     .catch((error) => {
//         //console.log('Error in quotes');
//         callback('error in quotes');
//     });
// }



// function getUserPositions(socket, account_name, token, callback){
//     console.log('In getUserData');
//     console.log(account_name);
//     console.log(token);
//     let positions = {};   
//     let userData = []; 
//     let url = '';
//     const headers = {
//         headers: {'Authorization':'Bearer '+token}
//     };
    
//     if(account_name == 'Tradier'){
//         url = 'https://api.tradier.com/v1/user/positions';
//     }
//     console.log(url);
//     console.log(headers);
//     if(url){
//         axios.get(url, headers)
//             .then((response) => {
//                 positions = response.data.accounts.account.positions;
//                 positions.position.forEach((position) => {
//                     getQuote(socket, position, token, (err, result) => {
//                         if(err){
//                             console.log(err);
//                             callback(err);
//                         }
//                         else{
//                             //console.log(result);
//                             userData.push(result);
//                             //console.log(userData);
//                             callback(undefined, userData);                
                        
//                         }
//                     });
//                 });
//                 console.log(userData);
//             })
//             .catch((error) => {
//                 console.log(error);
//             });
//     }       
// }

//With Promises

/* let getQuote = (socket, position, token) => {
    const headers = {
        headers: {'Authorization':'Bearer '+token}
    }

    const url = `https://api.tradier.com/v1/markets/quotes?symbols=${position.symbol}`;

    return axios.get(url, headers);
};


let getUserPositions = (socket, account_name, token) => {
    const headers = {
        headers: {'Authorization':'Bearer '+token}
    }
    if(account_name === 'Tradier'){
        const url = 'https://api.tradier.com/v1/user/positions';
        return axios.get(url, headers);
        
    }
    else{
        return new Error('Not found');
    }
};

io.on('connection', (socket) => {
    console.log('user connected');
    console.log(socket.id);
    let account_info;
    let timer;
    
    socket.on('account', (account) => {
        console.log('Account');
        console.log(account);
        console.log(account.account.user.email);  
        console.log(account.account.account_name);
        const account_name = account.account.account_name;
        const email = account.account.user.email;
        
        User.getUserByEmail(email, (err, user) => {            
            if(err){
                throw err;
            }
            if(!user){
                return res.json({success: false, msg: 'User not found'});            
            }
            
            console.log('User');
            console.log(user);
            account_info = user.accounts.filter(a => a.name === account_name);
            console.log(account_info);
            console.log(account_info[0].name);
            console.log(account_info[0].access_token);

            timer = setInterval(() => {      
                getUserPositions(socket, account_info[0].name, account_info[0].access_token)
                .then((positions) => {
                    //console.log(positions.data);
                    const token = account_info[0].access_token;
                    //console.log(positions.data.accounts.account.positions);
                    const userPositions = positions.data.accounts.account.positions.position;
                    //console.log(userPositions);
                    let updatedPositions = [];                    
                    userPositions.forEach((position) => {
                        getQuote(socket, position, token).then((quote) => {
                            //console.log(quote.data.quotes.quote);
                            let res = quote.data.quotes.quote;
                            position.ask_price = res.ask;
                            position.bid = res.bid;
                            position.bp_price = 0;
                            position.sl_price = 0;
                            position.volume = res.volume;
                            position.current_value = (position.ask_price * position.quantity * 100) - 5;
                            position.unrealized_profit_loss = position.current_value - position.cost_basis - 5;
                            //console.log(position);
                            updatedPositions.push(position);  
                            console.log(updatedPositions);                     
                            socket.emit('data', {data: updatedPositions});
                        })
                        .catch((e) => {
                            console.log('Error in finding positions', e);                            
                        });
                    });    
                })
                .catch((e) => {
                    console.log('Error in finding positions', e);
                    socket.emit('error');
                });
            }, FETCH_INTERVAL);  
        });
     
    });

    
    socket.on('disconnect', () => {
        clearInterval(timer);
        console.log('User disconnected');
    });    
}); */

/*app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});*/

server.listen(app.get('port'), function(){
    console.log('Listening on port 3000...');
});

