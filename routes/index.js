var express = require('express'),
    router = express.Router(),
    moment = require('moment');
let Article = require('../model').Article;
router.get('/',function (req, res) {
    //populate是填充的意思 是把一个属性从外键变成对应集合的文档对象
    let pageSize = isNaN(req.query.pageSize)?5:parseInt(req.query.pageSize),
        pageNum = isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);
    var count = Article.count({});
    var records = Article.find({}).skip(pageSize*(pageNum-1)).limit(pageSize).populate('user');
    Promise.all([count,records]).then(function (result) {
        let total = result[0]; //总记录数
        let docs = result[1]; //当前页的记录
        res.render('index',{
            title:'首页',
            pageSize,
            pageNum,
            docs,
            totalPage:Math.ceil(total/pageSize)
        })
    },function (err) {
        req.session.error = '数据库查询失败';
        res.redirect('back');
    });
});
router.get('/list',function (req, res) {
    //populate是填充的意思 是把一个属性从外键变成对应集合的文档对象
    let pageSize = isNaN(req.query.pageSize)?10:parseInt(req.query.pageSize),
        pageNum = isNaN(req.query.pageNum)?1:parseInt(req.query.pageNum);
    var count = Article.count({});
    var records = Article.find({}).skip(pageSize*(pageNum-1)).limit(pageSize).populate('user');
    Promise.all([count,records]).then(function (result) {
        let total = result[0]; //总记录数
        let docs = result[1]; //当前页的记录
 /*       docs.forEach(function (item) {
            let date = moment(item.createAt.toLocaleString()).format('YYYY-MM-DD HH:mm:ss');
            console.log(item.createAt)
        });*/
        res.render('list',{
            title:'目录',
            pageSize,
            pageNum,
            docs,
            totalPage:Math.ceil(total/pageSize)
        })
    },function (err) {
        req.session.error = '数据库查询失败';
        res.redirect('back');
    });
});

module.exports = router;