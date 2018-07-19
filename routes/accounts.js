var express = require('express');
var router = express.Router();
var request = require('request');
var querystring = require('querystring');
var cookieParser = require('cookie-parser');
const path = require('path');

var redirect_uri = 'http://localhost:3000/accounts/callback'
//var client_id = 'FqMtGHXVS9ICAVc5WBkNj6M9tr5G';
var client_id = '67ywroPC18adHjgCUuE7s70Ix5w6';
/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  
    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};
  
var stateKey = 'AI_Trade_Key';
  
router.get('/login', (req, res, next) => {
    console.log('In accounts login');
    var state = generateRandomString(16);

    res.cookie(stateKey, state);

    var scope = 'read,market';
    /*var authOptions = {
        url: 'https://sandbox.tradier.com/v1/oauth/authorize?',
        client_id: 'FqMtGHXVS9ICAVc5WBkNj6M9tr5G',
        scope: scope,
        state: state,
        redirect_uri: redirect_uri
        
    }

    request.get(authOptions, (error, response, body) => {
        console.log(body);
    });*/

    res.redirect('https://api.tradier.com/v1/oauth/authorize?'+
        querystring.stringify({
            client_id: client_id,
            //response_type: 'code',
            scope: scope,
            state: state
            //redirect_uri: redirect_uri
        })
    );

    /*var url = 'https://api.tradier.com/v1/user/profile';
    request.get(url, (error, response, body) => {
        console.log(error);
        console.log(body);
    })*/
});

router.get('/callback', (req, res, next) => {
    console.log('In accounts callback');
    console.log(req);
    console.log(req.query);
});

router.get('/getUserData', (req, res, next) => {
    console.log('Getting user data');
    
});

module.exports = router;