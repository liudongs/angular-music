/**
 * 接口路由
 * Created by 郑树聪 on 2016/2/18.
 */
var express = require('express');
var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');

var router = express.Router();

var User = require('../models/User');
var music = require('../models/Music');

var redisClient = require('../config/redis_db').redisClient;
var tokenManager = require('../utils/TokenManager');
var secretToken = require('../config/config').secretToken;

// 注册接口
router.post('/register', function(req, res, next){

    var user = new User(req.body.username, req.body.email, req.body.password);
    user.findOne(function(isError, results){
        if(isError){
            res.send(500);
        } else if(results.length > 0){
            res.json({
                success: false,
                msg: '邮箱已被注册'
            });
        } else {
            // 邮箱未被注册
            user.create(function(isError){
                if(isError){
                    res.send(500);
                } else {
                    res.json({
                        success: true
                    });
                }
            });
        }
    });

});

// 登录接口
router.post('/login', function(req, res, next) {

    var user = new User(undefined, req.body.email);

    user.findOne(function(isError, results){   //通过此model以用户名的条件 查询数据库中的匹配信息
        if(isError){                                         //错误就返回给原post处（login.html) 状态码为500的错误
            res.send(500);
        }else if(!results){                                 //查询不到用户名匹配信息，则用户名不存在
            res.send(404);
        } else {
            if(req.body.password !== results[0].password){     //查询到匹配用户名的信息，但密码错误
                res.json({
                    succuss: false,
                    msg: '密码错误'
                });
            }else{  //信息匹配成功，则将此对象（匹配到的user)

                var user = results[0];
                var token = jwt.sign(user, secretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
                return res.json({
                    success: true,
                    user: {
                        email: user.email,
                        username: user.username,
                        img: user.img,
                        type: user.type
                    },
                    token:token
                });
            }
        }
    });
});

// 登出
router.post('/logout', expressJwt({secret: secretToken}), tokenManager.verifyToken, function(req, res, next){
    if (req.body.email) {
        tokenManager.expireToken(req.headers);

        return res.send(200);
    } else {
        return res.send(401);
    }
});

// 测试接口
router.get('/test', expressJwt({secret: secretToken}), function(req, res, next){
    var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['access-token'];
    if(token) {
        try {
            var decoded = jwt.verify(token, secretToken);
            console.log(decoded);
        } catch(err) {
            return next();
        }
    } else {
        next();
    }
});

module.exports = router;
