const express = require('express')
const router = express.Router();
const Shorts = require('../models/shorts');
router.get('/',async function(req,res){
    var shorts = await Shorts.find().sort({
        createdAt : 'desc'
    });
    console.log("shorts",JSON.stringify(shorts))
      res.render("shorts/showAllShorts",{shorts : shorts ,blogs : '', newblogs : '' , shortstab : 'active' ,newshorts:''}); 
})
router.get('/new',function(req,res){
    // res.send('new articlies')
    let shorts = new Shorts();
    res.render("shorts/new",{shorts: shorts,blogs : '', newblogs : '' , shortstab : '' ,newshorts:'active'})
})
router.get('/edit/:id',async function(req,res){
    // res.send('new articlies')
    // res.render("articles/new")
    let shorts = await Shorts.findById(req.params.id);
    res.render("shorts/edit",{shorts : shorts,blogs : '', newblogs : '' , shortstab : '' ,newshorts:''})
})
router.post('/:id', async (req, res) => {
    console.log('gona delete')
    await Shorts.findByIdAndDelete(req.params.id);
    res.redirect('/shorts')
})
router.post('/edit/:id',async function(req,res,next){
    debugger;
    console.log('here to EDIT ARTICLE')
    req.shorts = await Shorts.findById(req.params.id);
    next();
},saveAarticle('edit'))

function saveAarticle(path){
    return async function(req,res){
        console.log('in post');
        let shorts = req.shorts
        shorts.title = req.body.title
        shorts.description = req.body.description
        try{
            console.log('before save');
            shorts  = await shorts.save();
            console.log('after save');
            res.redirect("/shorts");
        }catch(e){
            console.log("err haha",shorts.title)
            res.render("shorts/"+path, { shorts: shorts })
        }

    }
}
router.post('/',async function(req,res,next){
    debugger;
    console.log('here to create new')
    req.shorts = new Shorts();
    next();
},saveAarticle('new'))
module.exports = router;