var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var chatSchema = new Schema({
    room: String,
    message: String,
    createAt: { type: Date, default: Date.now  }
});

module.exports = mongoose.model('chat', chatSchema);
