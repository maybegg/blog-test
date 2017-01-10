var express = require('express'),
    bodyParser = require('body-parser'),
    path = require('path'),
    app = express(),
    article = require('./routes/article');
//当客户端访问静态文件的时候，会以public目录的绝对目录加上文件子目录寻找此静态文件 如果找到则返回
app.use(express.static(path.resolve('public')));
app.use(bodyParser.urlencoded({extended:true}));
let session = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    config = require('./config');
app.use(session({
    secret:'zfpx',
    resave:true, //重新保存session
    saveUninitialized:true, //保存未初始化的session
    store:new MongoStore({
        url:config.dbUrl
    })
}));
app.use(function (req, res, next) {
    //locals才是真正渲染模板的对象
    let error=req.session.error;
    let success=req.session.success;
    req.session.error=req.session.success='';
    res.locals.error=error;
    res.locals.success=success;
    //把会话中的user属性取出来赋给res.locals
    res.locals.user = req.session.user;
    next();
});
//设置模板引擎
app.set('view engine','html');
//设置模板存放目录 render的时候写的是相对于此路径的相对路径
app.set('views',path.resolve('views'));
//设置对于html后缀的模板用ejs方法渲染
app.engine('html',require('ejs').__express);
var index = require('./routes/index'),
    user = require('./routes/user');
app.use('/',index);
app.use('/user',user);
app.use('/article',article);

app.listen(8080);