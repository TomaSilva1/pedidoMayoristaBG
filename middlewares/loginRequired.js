export function sessionOk(req, res, next){
    if(!req.session.login){
        res.redirect("/");
        return;
    }else{
        next();
    }
}
