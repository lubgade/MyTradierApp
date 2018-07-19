const mongoose = require('mongoose');


//Token schema
const TokenSchema = mongoose.Schema({
    _userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    token: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
        expires: 43200
    }
});

const Token = module.exports = mongoose.model('Token', TokenSchema);

module.exports.addToken = function(token, callback){
    token.save(callback);
}

module.exports.findTokenById = function(id, callback){

}

module.exports.findToken = function(token, callback){
    const query = {token: token}
    Token.findOne(query, callback);
}