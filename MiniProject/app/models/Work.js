var mongoose = require('mongoose');

var workSchema = mongoose.Schema({
    work:{
    	type:String,
    	require:true
    },
    portfolioid:String
})

var Work = mongoose.model("work", workSchema);

module.exports = Work;
