const mongoose = require('mongoose');
console.log('owner schema');
const ArrLikedArticleId = new mongoose.Schema({ name: String });
const ArrLikedShortsId = new mongoose.Schema({ name: String });
const MyArticleId = new mongoose.Schema({ name: String });
const MyShortsId = new mongoose.Schema({ name: String });
const ownerSchema = new mongoose.Schema({
    myMailId : {
      type: String,
      required : true    
    },
    likedArticlesId : {
      type: [ArrLikedArticleId],
    },
    likedShortsId : {
      type: [ArrLikedShortsId],
    },
    MyArticlesId : {
      type: [MyArticleId],
    },
    MyShortsId : {
      type: [MyShortsId],
    },
})
  module.exports = mongoose.model('Owner',ownerSchema);