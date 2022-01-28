const express = require('express')
const router = express.Router();
const Shorts = require('../models/shorts');
const utils = require('./utils');
const Owner = require('../models/ownerSchema');
router.get('/',async function(req,res){
    var shorts = await Shorts.find().sort({
        createdAt : 'desc'
    });
    req.email = utils.getUserMail(req);
    var owner = {};
    if(req.email!="guest"){
        owner = await Owner.findOne({
            myMailId : req.email
        });
    }
    res.render("shorts/showAllShorts",{shorts : shorts ,owner:owner,recent:'active',mostLiked:'', blogs : '', newblogs : '' , shortstab : 'active' ,newshorts:'', 'userName':utils.getUserName(req) ,'userMail':utils.getUserMail(req) ,'userPicture':utils.getUserPicture(req)}); 
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
    var shorts = await Shorts.find().sort(obj);
    res.render("shorts/showAllShorts",{shorts : shorts ,owner:owner, recent:recent,mostLiked:mostLiked,blogs : '', newblogs : '' , shortstab : 'active' ,newshorts:'', 'userName':utils.getUserName(req) ,'userMail':utils.getUserMail(req) ,'userPicture':utils.getUserPicture(req)}); 
})
router.get('/new',function(req,res){
    let shorts = new Shorts();
    res.render("shorts/new",{shorts: shorts,blogs : '', newblogs : '' , shortstab : '' ,newshorts:'active', 'userName':utils.getUserName(req) ,'userMail':utils.getUserMail(req) ,'userPicture':utils.getUserPicture(req)})
})
router.get('/edit/:id',async function(req,res){
    let shorts = await Shorts.findById(req.params.id);
    res.render("shorts/edit",{shorts : shorts,blogs : '', newblogs : '' , shortstab : '' ,newshorts:'', 'userName':utils.getUserName(req) ,'userMail':utils.getUserMail(req),'userPicture':utils.getUserPicture(req)})
})
router.post('/:id', async (req, res) => {
    var arg = req.params.id;
    arg = arg.split("$");
    var id = arg[0];
    var type = arg[1];
    if(type == "delete"){
        await Shorts.findByIdAndDelete(id);
        res.redirect('/shorts')
    }else if(type == "like"){
        var short = await Shorts.findById(id);
        short.likedCount = short.likedCount + 1;
        short  = await short.save();
        req.email = utils.getUserMail(req);
        var owner = await Owner.findOne({
            myMailId : req.email
        });
        owner.likedShortsId.push(id);
        owner  = await owner.save();
        res.send({status:200,likedCount : short.likedCount});
    }else if(type == "unlike"){
        var short = await Shorts.findById(id);
        short.likedCount = short.likedCount - 1;
        short  = await short.save();
        req.email = utils.getUserMail(req);
        var owner = await Owner.findOne({
            myMailId : req.email
        });
        var ind = -1;
        owner.likedShortsId.forEach(function(item,index){
            if(item._id == id){
                ind = index;
                return;
            }
        })
        if(ind != -1){
            owner.likedShortsId.splice(ind,1);
            owner  = await owner.save();
        }
        res.send({status:200,likedCount : short.likedCount});
    }
})
router.post('/edit/:id',async function(req,res,next){
    req.email = utils.getUserMail(req);
    req.shorts = await Shorts.findById(req.params.id);
    next();
},saveAarticle('edit'))

function saveAarticle(path){
    return async function(req,res){
        let shorts = req.shorts
        shorts.title = req.body.title
        shorts.description = req.body.description
        shorts.ownerMail = req.email
        try{
            shorts  = await shorts.save();
            res.redirect("/shorts");
        }catch(e){
            console.log("err haha",shorts.title)
            res.render("shorts/"+path, { shorts: shorts })
        }

    }
}
router.post('/',async function(req,res,next){
    req.email = utils.getUserMail(req);
    req.shorts = new Shorts();
    next();
},saveAarticle('new'))
module.exports = router;