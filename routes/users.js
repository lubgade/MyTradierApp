const FETCH_INTERVAL = 10000;

var express = require('express');
var router = express.Router();
const User = require('../models/user');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const nodemailer = require('nodemailer');
var crypto = require('crypto');
var Token = require('../models/token');
const cors = require('cors');
const socketIO = require('socket.io');
const axios = require('axios');
const server = require('../app');


const io = socketIO(server);

//Register and verify email
router.post('/register', (req, res, next) => {
    console.log('In routes users.js');
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password
    });
    User.getUserByEmail(newUser.email, (err, user) => {
        console.log('Getting user by email')
        if(err){
            throw err;
        }
        console.log(user);
        if(user){
            if(user.isVerified){
                return res.json({success: true, msg: 'User is already verified...please log in'});
            }
            return res.json({success: false, msg: 'The email address you have entered is already associated with another account'});
        }
        else{
            User.addUser(newUser, (err, user) => {
                if(err) throw err;
                console.log(newUser);
                console.log(user);
                var token = new Token({
                    _userId: newUser._id,
                    token: crypto.randomBytes(16).toString('hex')
                });
                console.log(token.token);
                Token.addToken(token, (err, data) => {
                    if(err) throw err;
                    console.log('In addToken');
                    console.log(data.token);
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'leena.ubgade@gmail.com',
                            pass: 'simple1234'
                        }
                    });
                    
                    var link = 'http://localhost:4200/confirm?access_token=' + data.token;
                    console.log(link);
                    var mailOptions = {
                        from: 'no-reply@AITrader.com',
                        to: newUser.email,
                        subject: 'Account verification token',
                        html: 'Hello,<br><br> Please verify your account by clicking the link:<a href='+link+'>Click here to confirm</a>'
                    };

                    transporter.sendMail(mailOptions, (err, res) => {
                        if(err) throw err;
                        console.log('Mail sent');
                        console.log(res);
                        //res.json({success: true, msg: 'mail sent'});
                    }); 
                });            
            });
            res.json({success: true, msg: 'Thanks for registering...Please activate your account'});
        }    
    });     
        
});


//Email confirmation
router.post('/confirmation', (req, res, next) => {
    console.log('in confirmation');
    console.log('req body')
    console.log(req.body);
    console.log('req body token');
    console.log(req.body.token);
    if(!req.body.token){
        return res.json({success: false, msg: 'Empty token...Please register with a valid email'});
    }
    Token.findToken(req.body.token, (err, token) => {
        if(err){
            return res.json({success: false, msg: ''});
        };
        if(!token){
            return res.json({success: false, msg: 'We were unable to find a valid token, maybe your token has expired'});
        }
        console.log(token);
        if(token){
        User.getUserById(token._userId, (err, user) => {
            if(err){
                res.json({success: false, msg: ''});
            };
            if(!user){
                return res.json({success: false, msg: 'We were unable to find a user for this token'});
            }
            console.log(user);
            if(user.isVerified){
                return res.json({success: true, msg: 'User is already registered'});
            }
            user.isVerified = true;
            console.log(user);
            User.saveUser(user, (err, user) => {
                if(err){
                    res.json({success: false, msg: 'Failed to register user'});
                }
                else{
                    res.json({success: true, msg: 'User registered'});
                }
            });
        });
    }
    });
});




//Check User name
router.post('/checkUsername', (req, res, next) => {
    const username = req.body.username;
    User.getUserByUsername(username, (err, user) => {
        if(err){
            res.json({success: false, msg: 'This username is already taken'});
        }
    });
});  


//Authenticate while login
router.post('/authenticate', (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        console.log('In authenticate');
        console.log(user);
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }
        
        let userWithoutP = {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
        };
        User.comparePassword(password, user.password, (err, isMatch) =>{
            if(err) throw err;
            if(!isMatch){
                return res.json({success: false, msg: 'Wrong Password'});                                
            }
            else if(!user.isVerified){
                return res.json({success: false, msg: 'Account is not yet activated', expired: true});
            }
            else{
                const token = jwt.sign({data:userWithoutP}, config.secret, {
                    expiresIn: 604800 //1 week
                });
            

            res.json({
                success: true,
                token: 'JWT '+token,
                user: userWithoutP
            });   
            }           
        });
    });
});


//Resend verification email
router.post('/resendConfirmation', (req, res, next) => {
    console.log('in app js resend');
    const username = req.body.username;
    const password = req.body.password;

    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        console.log(user);
        if(!user){
            return res.json({success: false, msg: 'User not found'});
        }
        
        User.comparePassword(password, user.password, (err, isMatch) =>{
            if(err) throw err;
            if(!isMatch){
                return res.json({success: false, msg: 'Wrong Password'});                                
            }
            else if(user.isVerified){
                return res.json({success: false, msg: 'Account is already activated'});
            }
            else{
                var token = new Token({
                    _userId: user._id,
                    token: crypto.randomBytes(16).toString('hex')
                }); 
                console.log(token.token);
                Token.addToken(token, (err, data) => {
                    if(err) throw err;
                    console.log('In addToken');
                    console.log(data.token);
                    var transporter = nodemailer.createTransport({
                        service: 'Gmail',
                        auth: {
                            user: 'leena.ubgade@gmail.com',
                            pass: 'simple1234'
                        }
                    });
                    
                    var link = 'http://localhost:4200/confirm?access_token=' + data.token;
                    console.log(link);
                    var mailOptions = {
                        from: 'no-reply@AITrader.com',
                        to: user.email,
                        subject: 'Account verification token',
                        html: 'Hello,<br><br> Please verify your account by clicking the link:<a href='+link+'>Click here to confirm</a>'
                    };

                    transporter.sendMail(mailOptions, (err, res) => {
                        if(err) throw err;
                        console.log('Mail sent');
                        console.log(res);
                    }); 
                });
                res.json({success: true, msg: 'A verification email has been sent'});                                    
            }           
        });
    });
});


//Update User Data
router.post('/updateUserData', (req, res, next) => {
    console.log('Update User data');
    console.log(req.body);
    const email = req.body.user.email;
    const account = req.body.account;
    const updatePosition = req.body.position;
    console.log(email);
    console.log(account);

    User.getUserByEmail(email, (err, user) => {
        if(err){
            throw err;
        }
        if(!user){
            return res.json({success: false, msg: 'User not found'});            
        }
        console.log(user);
        let result = user.accounts.filter((userAccount) => userAccount.name === account);
        console.log(result);
        if(result){
            console.log(result[0].access_token);
            let access_token = result[0].access_token;
            getUserPositions(account, access_token)
            .then((positions) => {
                //console.log(positions.data);
                const userPositions = positions.data.accounts.account.positions.position;
                console.log(userPositions); 
                let match = userPositions.filter((position) => position.id === updatePosition.id);
                console.log(match);
            })
            .catch((e) => {
                console.log('Error in finding positions', e);                                            
            });
        }
    });
});



//Profile
router.get('/profile',passport.authenticate('jwt', {session:false}), (req, res, next) => {
    res.json({user: req.user});
});


//Link a new account
router.post('/linkAccount', (req, res, next) => {
    console.log(req.body.user.email);
    const email = req.body.user.email;

    User.getUserByEmail(email, (err, user) => {
        if(err){
            throw err;
        }
        if(!user){
            return res.json({success: false, msg: 'User not found'});            
        }
        const account = {
            name: req.body.name,
            access_token: req.body.access_token
        }
        console.log(user.accounts);
        console.log(req.body.name);
        let result = user.accounts.filter((account) => account.name === req.body.name );
        console.log(result);
        if(result.length == 0){
            user.accounts.push(account);
            User.saveUser(user, (err, user) => {
                if(err){
                    return res.json({success: false, msg: 'Failed to add account'});
                }
                else{
                    return res.json({success: true, msg: 'Account added successfully'});
                }
            });
        }
        else{
            console.log('account already exists');
            return res.json({success: false, msg: 'Account already linked'});                
        }
    });

});


//Get all user accounts
router.get('/getUserAccounts', (req, res, next) => {
    //console.log(req.query);
    const email = req.query.email;
    
    User.getUserByEmail(email, (err, user) => {
        if(err){
            throw err;
        }
        else{
            if(!user){
                return res.json({success: false, msg: 'User not found'});            
            }
            //console.log(user);
            let userAccounts = user.accounts.map(a => a.name);
            //console.log('User Accounts');
            //console.log(userAccounts);
            res.json({accounts: userAccounts});
        }
    });
});


//Unlink an account
router.post('/unlinkAccount', (req, res, next) => {
    console.log(req.body);
    const email = req.body.email;
    const accountName = req.body.accountName;
    console.log('Account name', accountName);

    User.getUserByEmail(email, (err, user) => {
        if(err){
            throw err;
        }
        else{
            if(!user){
                return res.json({success: false, msg: 'User not found'});            
            }
            //console.log(user.accounts);
            user.accounts = user.accounts.filter(account => account.name != accountName);
            console.log(user.accounts);

            User.saveUser(user, (err, user) => {
                if(err){
                    return res.json({success: false, msg: 'Failed to unlink account'});                    
                }
                else{
                    let userAccounts = user.accounts.map(a => a.name);
                    console.log('User Accounts');
                    console.log(userAccounts);
                    res.json({success: true, msg: 'Account unlinked successfully', accounts: userAccounts});                    
                }
            }); 
        }
    });

});


// Return a quote from Tradier
let getQuote = (position, token) => {
    const headers = {
        headers: {'Authorization':'Bearer '+token}
    }

    const url = `https://api.tradier.com/v1/markets/quotes?symbols=${position.symbol}`;

    return axios.get(url, headers);
};


// Return user positions
let getUserPositions = (account_name, token) => {
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

            //timer = setInterval(() => {      
                getUserPositions(account_info[0].name, account_info[0].access_token)
                .then((positions) => {
                    //console.log(positions.data);
                    const token = account_info[0].access_token;
                    //console.log(positions.data.accounts.account.positions);
                    const userPositions = positions.data.accounts.account.positions.position;
                    //console.log(userPositions);
                    let updatedPositions = [];                    
                    userPositions.forEach((position) => {
                        getQuote(position, token).then((quote) => {
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
            //}, FETCH_INTERVAL);  
        });
     
    });

    
    socket.on('disconnect', () => {
        clearInterval(timer);
        console.log('User disconnected');
    });    
});

module.exports = router;

