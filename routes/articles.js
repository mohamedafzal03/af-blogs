const express = require('express')
const router = express.Router();
const Article = require('../models/articles');
const Owner = require('../models/ownerSchema');
const utils = require('./utils');
router.get('/',async function(req,res){
    var articles = await Article.find().sort({
        createdAt : 'desc'
    });
    req.email = utils.getUserMail(req);
    var owner = {};
    if(req.email!="guest"){
        owner = await Owner.findOne({
            myMailId : req.email
        });
    }
    res.render("articles/articlesall",{articles : articles,recent:'active',mostLiked:'',owner:owner ,blogs : 'active', newblogs : '' , shortstab : '' ,newshorts:'', 'userName':utils.getUserName(req) ,'userMail':utils.getUserMail(req) ,'userPicture':utils.getUserPicture(req)}); 
})
router.get('/sort/:type',async function(req,res){
    var arg = req.params.type;
    arg = arg.split("$");
    var sortType = arg[0];
    var dataType = arg[1];
    req.email = utils.getUserMail(req);
    var owner = {};
    if(req.email!="guest"){
        owner = await Owner.findOne({
            myMailId : req.email
        });
    }
    var obj,mostLiked,recent;
    if(sortType == 'recent'){
        obj = {createdAt : 'desc'}
        mostLiked = "";
        recent = "active";
    }else{
        obj = {likedCount : 'desc'}
        mostLiked = "active";
        recent = "";
    }
    var articles = await Article.find().sort(obj);
    res.render("articles/articlesall",{articles : articles,mostLiked:mostLiked,recent:recent,owner:owner ,blogs : 'active', newblogs : '' , shortstab : '' ,newshorts:'', 'userName':utils.getUserName(req) ,'userMail':utils.getUserMail(req) ,'userPicture':utils.getUserPicture(req)}); 
})
router.get('/new',function(req,res){
    let article = new Article();
    res.render("articles/new",{article: article,blogs : 'active', blogs:"",newblogs : 'active' , shortstab : '' ,newshorts:'', 'userName':utils.getUserName(req),'userMail':utils.getUserMail(req)  ,'userPicture':utils.getUserPicture(req)})
})
router.get('/edit/:id',async function(req,res){
    let article = await Article.findById(req.params.id);
    res.render("articles/edit",{article : article,blogs : '', newblogs : '' , shortstab : '' ,newshorts:'', 'userName':utils.getUserName(req),'userMail':utils.getUserMail(req)  ,'userPicture':utils.getUserPicture(req)})
})

router.get('/:slug',async function(req,res){
    var article = await Article.findOne({
        slug : req.params.slug
    });
    var owner = {};
    req.email = utils.getUserMail(req);
    if(req.email!="guest"){
        owner = await Owner.findOne({
            myMailId : req.email
        });
    }
    res.render('articles/show',{ article : article,blogs : '',owner:owner, newblogs : '' , shortstab : '' ,newshorts:'', 'userName':utils.getUserName(req),'userMail':utils.getUserMail(req)  ,'userPicture':utils.getUserPicture(req)});
})

router.post('/:id', async (req, res) => {
    var arg = req.params.id;
    arg = arg.split("$");
    var id = arg[0];
    var type = arg[1];
    if(type == "delete"){
        await Article.findByIdAndDelete(id);
        res.redirect('/articles')
    }else if(type == "like"){
       var article = await Article.findById(id);
        article.likedCount = article.likedCount + 1;
        article  = await article.save();
        req.email = utils.getUserMail(req);
        var owner = await Owner.findOne({
            myMailId : req.email
        });
        owner.likedArticlesId.push(id);
        owner  = await owner.save();
        res.send({status:200,likedCount : article.likedCount});
    }else if(type == "unlike"){
        var article = await Article.findById(id);
        article.likedCount = article.likedCount - 1;
        article  = await article.save();
        req.email = utils.getUserMail(req);
        var owner = await Owner.findOne({
            myMailId : req.email
        });
        var ind = -1;
        owner.likedArticlesId.forEach(function(item,index){
            if(item._id == id){
                ind = index;
                return;
            }
        })
        if(ind != -1){
            owner.likedArticlesId.splice(ind,1);
            owner  = await owner.save();
        }
        res.send({status:200,likedCount : article.likedCount});
    }
})
router.post('/edit/:id',async function(req,res,next){
    req.email = utils.getUserMail(req);
    req.article = await Article.findById(req.params.id);
    req.article.likedCount = req.article.likedCount;
    next();
},saveAarticle('edit'))

function saveAarticle(path){
    return async function(req,res){
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        article.ownerMail = req.email
        let owner = req.owner;
        try{
            article  = await article.save();
            if(owner){
                owner.MyArticlesId.push(article.id);
                owner  = await owner.save();
            }
            res.redirect("/articles/"+article.slug);
        }catch(e){
            console.log("err haha",article.title,e)
            res.render("articles/"+path, { article: article })
        }
    }
}
router.post('/',async function(req,res,next){
    req.email = utils.getUserMail(req);
    req.article = new Article();
    var oldOwner = await Owner.findOne({
        myMailId : req.email
    });
    if(oldOwner){
        req.owner = oldOwner;
    }else{
        req.owner = new Owner();
        req.owner.myMailId = req.email;
        req.owner.likedArticlesId = [];
        req.owner.likedShortsId = [];
        req.owner.MyArticlesId = [];
        req.owner.MyShortsId = [];
    }
    next();
},saveAarticle('new'))
module.exports = router;