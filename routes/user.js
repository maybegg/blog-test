var express = require('express'),
    router = express.Router(),
    User = require('../model').User,
    auth = require('../ware/auth'),
    multer = require('multer'),
    //指定上传文件的存放路径
    upload = multer(({dest:'./public/uploads/'}));

//注册 当客户端访问 /reg
router.get('/reg',auth.checkNotLogin,function (req, res) {
    //渲染模板
    let User = req.session.formUser||'';
    req.session.formUser = '';
    res.render('user/reg',{title:'注册',User});
});
router.post('/reg',auth.checkNotLogin,upload.single('avatar'),function (req, res) {
    let user = req.body;
    User.findOne({username:user.username}).then(function (doc) {
        if(doc){
            req.session.formUser=user;
            req.session.error='此用户名已被占用';
            res.redirect('back');
        }else{
            user.avatar = `/uploads/${req.file.filename}`;
            User.create(user).then(function (doc) {
                req.session.success='注册成功,请登录';
                res.redirect('/user/login');
            },function (err) {
                req.session.error='数据库操作失败';
                res.redirect('back');
            })
        }
    },function (err) {
        req.session.error='数据库操作失败';
        res.redirect('back');
    });
});
//登陆 当客户端访问 /login
router.get('/login',auth.checkNotLogin,function (req, res) {
    let User = req.session.formUser||'';
    req.session.formUser = '';
    res.render('user/login',{title:'登陆',User});
});
router.post('/login',auth.checkNotLogin,function (req, res) {
    let user = req.body;
    //findOne 找到一条就返回 如果找到一条就返回找到的文档 如果没找到返回null
    User.findOne({username:user.username,password:user.password}).then(function (doc) {
        if(doc){
            req.session.user=doc;
            req.session.success='登陆成功';
            res.redirect('/list');
        }else{
            req.session.formUser=user;
            req.session.error='用户名或密码错误';
            res.redirect('/user/login');
        }
    },function (err) {
        req.session.error='数据库操作失败';
        res.redirect('back')
    })
});
//退出 当客户端访问 /logout 要求登陆后才能退出
router.get('/logout',auth.checkLogin,function (req, res) {
    req.session.user = null;
    res.redirect('/');
});

module.exports = router;