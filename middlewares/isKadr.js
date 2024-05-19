module.exports = function (req,res,next){
    if(req.session.role != "WORKER"){
        res.redirect("/auth/kadr/login")
    }
    next()
}