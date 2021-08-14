const express = require('express')
const router = express.Router();
const Article = require('../models/articles');
router.get('/',async function(req,res){
    var articles = await Article.find().sort({
        createdAt : 'desc'
    });
      res.render("articles/articlesall",{articles : articles ,blogs : 'active', newblogs : '' , shortstab : '' ,newshorts:''}); 
})
router.get('/new',function(req,res){
    // res.send('new articlies')
    let article = new Article();
    res.render("articles/new",{article: article,blogs : 'active', newblogs : 'active' , shortstab : '' ,newshorts:''})
})
router.get('/edit/:id',async function(req,res){
    // res.send('new articlies')
    // res.render("articles/new")
    let article = await Article.findById(req.params.id);
    res.render("articles/edit",{article : article,blogs : '', newblogs : '' , shortstab : '' ,newshorts:''})
})

router.get('/:slug',async function(req,res){
    // console.log("req id",req.params.id);
    // res.send(req.params.id);
    // var article = await Article.findById(req.params.id);
    var article = await Article.findOne({
        slug : req.params.slug
    });
    res.render('articles/show',{ article : article,blogs : '', newblogs : '' , shortstab : '' ,newshorts:''});
})

router.post('/:id', async (req, res) => {
    console.log('gona delete')
    await Article.findByIdAndDelete(req.params.id);
    res.redirect('/articles')
})
router.post('/edit/:id',async function(req,res,next){
    debugger;
    console.log('here to EDIT ARTICLE')
    req.article = await Article.findById(req.params.id);
    next();
},saveAarticle('edit'))

function saveAarticle(path){
    return async function(req,res){
        console.log('in post');
        let article = req.article
        article.title = req.body.title
        article.description = req.body.description
        article.markdown = req.body.markdown
        try{
            console.log('before save');
            article  = await article.save();
            console.log('after save');
            res.redirect("/articles/"+article.slug);
        }catch(e){
            console.log("err haha",article.title)
            res.render("articles/"+path, { article: article })
        }

    }
}
router.post('/',async function(req,res,next){
    debugger;
    console.log('here to create new')
    req.article = new Article();
    next();
},saveAarticle('new'))
module.exports = router;