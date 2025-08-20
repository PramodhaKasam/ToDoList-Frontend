const mongoose = require('mongoose');

var Schema = mongoose.Schema;

var choreSchema = new Schema({
    title:{type:String, required: true},
    date:{type: String, required:true},
    time: {type: String, required: true}
}, {timestamps: true});

var chore = mongoose.model('Chore', choreSchema);

module.exports = chore;