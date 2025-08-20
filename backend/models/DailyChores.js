const mongoose = require('mongoose');;

var Schema = mongoose.Schema;

var dailyChoreSchema = new Schema({
    title:{type: String, required: true}
}, {timestamps: true});

var dailyChore = mongoose.model('DailyChore', dailyChoreSchema);

module.exports = dailyChore;