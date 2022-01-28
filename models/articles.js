const mongoose = require('mongoose');
const slugify = require('slugify');
const createDomPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = new JSDOM('').window;
const domPurify = createDomPurify(window);
const marked = require('marked');
console.log('model')
const articleSchema = new mongoose.Schema({
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    markdown: {
      type: String,
      required: true
    }
    ,sanitizedHtml: {
      type: String,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    slug: {
      type: String,
      required : true,
      unique : true,
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
  articleSchema.pre('validate',function(next){
      this.slug = slugify(this.title,{
          lower : true, //lower case
          strict : true //changes : in url
      });
      if(this.markdown){
        this.sanitizedHtml = domPurify.sanitize(marked(this.markdown));
      }
      next()
  })
  module.exports = mongoose.model('Article',articleSchema);