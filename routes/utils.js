const utils = {
    getUserName : function(req){
        var str = "guest";
        if(req.oidc.isAuthenticated()){
            str = req.oidc.user.given_name;
        }
        return str;
    },
    getUserMail : function(req){
        var str = "guest";
        if(req.oidc.isAuthenticated()){
            str = req.oidc.user.email;
        }
        return str;
    },
    getUserPicture : function(req){
        var str = "https://www.clipartmax.com/png/middle/424-4242023_fa-user-circle-icon.png";
        if(req.oidc.isAuthenticated()){
            str = req.oidc.user.picture;
        }
        return str;
    }
}
module.exports = utils;