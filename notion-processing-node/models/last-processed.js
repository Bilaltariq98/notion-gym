const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const lastProcessed = new Schema({
  date: {
    type: Date,
    required: true,
  }
}, { collection: 'last-processed' });



const LastProcessed = mongoose.model('last-processed', lastProcessed);
module.exports = LastProcessed;