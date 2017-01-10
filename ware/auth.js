//要求登陆前才能访问后面的路由
exports.checkNotLogin = function (req, res, next) {
    if(req.session.user){
        req.session.error = '你已经登陆过了,请不要重复登陆';
        res.redirect('/');
    }else{
        next();
    }
};
//要求登陆后才能访问后面的路由
exports.checkLogin = function (req, res, next) {
    if(req.session.user){
        next();
    }else{
        req.session.error = '此页面需要登陆后才能访问,请登录';
        res.redirect('/user/login');
    }
};