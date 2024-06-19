/* eslint-disable no-undef */
const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  name: String,
  data: Array
});

module.exports = mongoose.model('Board', BoardSchema);
