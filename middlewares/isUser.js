module.exports = function (req,res,next){
    if(req.session.role != "USER"){
        res.redirect("/user/login")
    }
    next()
}