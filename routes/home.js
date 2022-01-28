const express = require('express')
const router = express.Router();
const Article = require('../models/articles');
const Shorts = require('../models/shorts');
const utils = require('./utils');
const Owner = require('../models/ownerSchema');
router.get('/',async function(req,res){
    req.email = utils.getUserMail(req);
    var owner = {};
    if(req.email!="guest"){
        owner = await Owner.findOne({
            myMailId : req.email
        });
    }
    var articles = await Article.find().sort({
        createdAt : 'desc'
    });
    var shorts = await Shorts.find().sort({
        createdAt : 'desc'
    });
    articles = articles.splice(0,10);
    shorts = shorts.splice(0,5);
    res.render("index",{articles : articles ,owner:owner,shorts : shorts,blogs : '', newblogs : '' , shortstab : '' ,newshorts:'', 'userName':utils.getUserName(req) ,'userMail':utils.getUserMail(req) ,'userPicture':utils.getUserPicture(req)}); 
})
module.exports = router;