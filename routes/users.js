var express = require('express');
var router = express.Router();

var model = require('../model');
var cache = require('../cache');
var utils = require('../share/utils');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

// 登录路由
router.get('/login', function (req, res, next) {
  res.render('login', {})
});

// 注册路由
router.get('/regist', function (req, res, next) {
  res.render('regist', {})
});

// 注册接口
router.post('/regist', function (req, res, next) {
  const data = {
    userId: utils.getUuid(),
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  model.connect(function (db) {
    const users = db.collection('users');
    users.insertOne(data, function (err, resData) {
      if (err) {
        console.log('注册失败-数据库异常');
        res.redirect('/users/regist');
      } else {
        console.log('注册成功');
        res.redirect('/users/login');
      }
    })
  });
});

// 登录接口
router.post('/login', function (req, res, next) {
  const data = {
    userName: req.body.userName,
    userPwd: req.body.userPwd
  };
  model.connect(function (db) {
    const users = db.collection('users');
    users.find(data).toArray(function (err, resData) {
      if (err) {
        console.log('登录失败-数据库异常');
        res.redirect('/users/login');
      } else {
        if (resData.length > 0) {
          console.log('登录成功');
          // 缓存用户信息
          cache.setCache('userInfo', resData[0]);
          // 登录会话保持
          req.session.userName = data.userName;
          res.redirect('/');
        } else {
          console.log('用户名或密码错误');
          res.redirect('/users/login');
        }
      }
    })
  });
})

// 退出登录
router.post('/loginOut', function (req, res, next) {
  req.session.userName = null;
  cache.clear();
  res.redirect('/users/login');
});

module.exports = router;