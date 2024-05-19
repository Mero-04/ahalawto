module.exports = function (req, res, next) {
    res.locals.email = req.session.email;
    res.locals.img = req.session.img;
    next();
}