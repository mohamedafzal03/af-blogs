const mongoose = require('mongoose');
const shortsSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
    type: String,
    required: true
    },
    ownerMail : {
      type: String,
      required : true    
    },
    likedCount : {
      type: Number,
      default: 0,
    },
  })
module.exports = mongoose.model('Shorts',shortsSchema);