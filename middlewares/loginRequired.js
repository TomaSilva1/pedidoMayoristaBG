export function sessionOk(req, res, next){
    if(!req.session.login){
        res.redirect("/login");
        return;
    }else{
        next();
    }
}