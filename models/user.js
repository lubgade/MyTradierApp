const mongoose = require('mongoose');
const config = require('../config/database');
const bcrypt = require('bcryptjs');


//User schema
const UserSchema = mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    accounts: [{
        name: String,
        access_token: String
    }]
});


const User = module.exports = mongoose.model('User', UserSchema);

module.exports.getUserById = function(id, callback){
    User.findById(id, callback); 
}

module.exports.getUserByUsername = function(username, callback){
    const query = {username: username}
    User.findOne(query, callback);
}

module.exports.getUserByEmail = function(email, callback){
    const query = {email: email}
    User.findOne(query, callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err){
                throw(err);
            }        
            newUser.password = hash;             
            newUser.save(callback);
        });
    });
}

module.exports.saveUser = function(user, callback){
    user.save(callback);
}

module.exports.comparePassword = function(candidatePassword, hash, callback){
    bcrypt.compare(candidatePassword, hash, (err, isMatch) => {
        if(err) throw err;
        callback(null, isMatch);
    });
}

module.exports.addAccount = function(account, callback){
    
};