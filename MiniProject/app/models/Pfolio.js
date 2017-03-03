var mongoose = require('mongoose');

var pfolioSchema = mongoose.Schema({
    firstname:{
        type:String,
        required:true,
    },
    lastname:{
        type:String,
        required:true,
    }
})

var Pfolio = mongoose.model("pfolio", pfolioSchema);

module.exports = Pfolio;
