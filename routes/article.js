var express = require('express');
var router = express.Router();

var model = require('../model');
var cache = require('../cache');
var utils = require('../share/utils');

// 博客列表
router.get('/list', function (req, res, next) {
  const userInfo = cache.getCache('userInfo');
  const condition = {
    userId: userInfo.userId
  }
  model.connect(function (db) {
    const article = db.collection('article');
    article.find(condition).toArray(function (err, resData) {
      if (err) {
        console.log('博客列表查询失败');
        res.redirect('/');
      } else {
        res.render('list', {
          articleList: resData
        });
      }
    });
  });
});

// 新增博客
router.get('/listAdd', function (req, res, next) {
  res.render('listAdd');
});

router.post('/listAdd', function (req, res, next) {
  const userInfo = cache.getCache('userInfo');
  const data = {
    userId: userInfo.userId,
    articleId: utils.getUuid(),
    title: req.body.title,
    content: req.body.content
  };
  model.connect(function (db) {
    const article = db.collection('article');
    article.insertOne(data, function (err, resData) {
      if (err) {
        console.log('新增博客失败');
        res.redirect('/article/list');
      } else {
        res.redirect('/article/list');
      }
    });
  });
})

// 删除博客
router.post('/listDelete', function (req, res, next) {
  const condition = {
    articleId: req.body.articleId
  };
  model.connect(function (db) {
    const article = db.collection('article');
    article.deleteOne(condition, function (err, resData) {
      if (err) {
        console.log('删除博客失败');
        res.redirect('/article/list');
      } else {
        res.redirect('/article/list');
      }
    });
  });
});

// 修改博客
router.get('/listEdit', function (req, res, next) {
  const condition = {
    articleId: req.query.articleId
  };
  model.connect(function (db) {
    const article = db.collection('article');
    article.find(condition).toArray(function (err, resData) {
      if (err) {
        console.log('修改博客-文章查询失败');
        res.redirect('/article/list');
      } else {
        res.render('listEdit', {
          article: resData[0]
        });
      }
    });
  });
});

router.post('/listEdit', function (req, res, next) {
  const userInfo = cache.getCache('userInfo');
  const condition = {
    articleId: req.body.articleId
  };
  const data = {
    userId: userInfo.userId,
    articleId: req.body.articleId,
    title: req.body.title,
    content: req.body.content
  };
  model.connect(function (db) {
    const article = db.collection('article');
    article.updateOne(condition, {
      $set: data
    }, function (err, resData) {
      if (err) {
        console.log('修改博客失败');
        res.redirect('/article/list');
      } else {
        res.redirect('/article/list');
      }
    });
  });
});

module.exports = router;