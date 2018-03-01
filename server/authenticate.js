module.exports.check=function isAuthenticated(req, res, next) {
    if(req.user.displayName!==null){
        return next();
    }

    res.redirect('/');
  }