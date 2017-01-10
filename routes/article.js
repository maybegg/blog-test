var express = require('express'),
    router = express.Router(),
    auth = require('../ware/auth'),
    Article = require('../model').Article;
router.get('/add',auth.checkLogin,function (req, res) {
    res.render('article/add',{title:'发表文章',doc:{}});
});

router.post('/add',auth.checkLogin,function (req, res) {
    let article = req.body;
    article.user = req.session.user._id;
    article.createAt = new Date();
    Article.create(article).then(function (result) {
        req.session.success = '发表成功';
        result = {
            code:0,
            msg:'success'
        };
        res.writeHead(200,{'content-type':'application/json;charset=utf-8'});
        res.end(JSON.stringify(result));
    },function (err) {
        req.session.error = '数据库操作失败';
        res.redirect('back')
    })
});

router.get('/detail/:_id',function (req, res) {
    //从路径参数中获取id
    let _id = req.params._id;
    //从ID中查询文章对象
    Article.findById(_id,function (err, doc) {
        if(err){
            req.session.error = '数据库查询失败';
            res.redirect('back');
        }else{
            //使用文章对象渲染文章详情模板
            res.render('article/detail',{title:'文章详情',doc})
        }
    })
});

router.get('/delete/:_id',function (req, res) {
    let _id = req.params._id;
    Article.remove({_id},function (err, result) {
        if(err){
            req.session.error = '数据库操作失败';
            res.redirect('back');
        }else{
            req.session.success = '删除成功';
            res.redirect('/');
        }
    })
});
router.get('/update/:_id',function (req, res) {
    let _id = req.params._id;
    Article.findById(_id,function (err, doc) {
        if(err){
            req.session.error = '数据库操作失败';
            res.redirect('back');
        }else{
            res.render('article/add',{title:'修改文章',doc});
        }
    })
});
router.post('/update/:_id',function (req, res) {
    let _id = req.params._id;
    Article.update({_id},req.body,function (err, result) {
        if(err){
            req.session.error = '数据库操作失败';
            res.redirect('back');
        }else{
            req.session.success = '修改成功';
            res.redirect(`/article/detail/${_id}`);
        }
    })
});
module.exports = router;