var mongoose = require('mongoose'),
    config = require('../config');
let ObjectId = mongoose.Schema.Types.ObjectId;
mongoose.Promise = Promise;
//连接数据库之前要启动数据库
mongoose.connect(config.dbUrl);
var UserSchema = new mongoose.Schema({
    username: {type:String,require:true},
    password: {type:String,require:true},
    avatar:String, //头像
    email: String
},{collection:'user'});
//定义了可以操作数据库的模型
exports.User = mongoose.model('User', UserSchema);

// module.exports = User;

var ArticleSchema = new mongoose.Schema({
    title:String,
    content:String,
    //文章的作者引用的是User模型对应的集合中的主键
    user:{type:ObjectId,ref:'User'}, //从当前的session中获取
    createAt: Date //创建时间
});

exports.Article = mongoose.model('article',ArticleSchema);

