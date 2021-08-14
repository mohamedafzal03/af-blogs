const mongoose = require('mongoose');
const shortsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
    type: String,
    required: true
    }
  })
module.exports = mongoose.model('Shorts',shortsSchema);