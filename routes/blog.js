const express = require('express');

const router = express.Router();

const {
  getList, getDetail, newBlog, updateBlog, delBlog,
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middlewares/loginCheck');


router.get('/list', (req, res, next) => {
  let author = req.query.author || '';
  const keyword = req.query.keyword || '';

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username === null) {
      // 未登录
      res.json(
        new ErrorModel('未登录'),
      );
      return;
    }
    // 强制查询自己的博客
    author = req.session.username;
  }

  const result = getList(author, keyword);

  return result.then((listdata) => {
    if (listdata.length) {
      res.json(
        new SuccessModel(listdata),
      );
    } else {
      res.json(
        new ErrorModel('无结果'),
      );
    }
    
  });
});

router.get('/detail', (req, res, next) => {
  const result = getDetail(req.query.id);
  return result.then((data) => {
    res.json(
      new SuccessModel(data),
    );
  });
});

router.post('/new', loginCheck, (req, res, next) => {
  req.body.author = req.session.username;
  const result = newBlog(req.body);
  return result.then((data) => {
    res.json(
      new SuccessModel(data, '博客新建成功'),
    );
  });
});

router.post('/update', loginCheck, (req, res, next) => {
  req.body.author = req.session.username;

  const result = updateBlog(req.query.id, req.body);
  return result.then((retVal) => {
    if (retVal) {
      res.json(
        new SuccessModel('博客更新成功'),
      );
    } else {
      res.json(
        new ErrorModel('博客更新失败'),
      );
    }
  });
});

router.post('/del', loginCheck, (req, res, next) => {
  req.body.author = req.session.username;

  const result = delBlog(req.query.id, req.body);
  return result.then((retVal) => {
    if (retVal) {
      res.json(
        new SuccessModel('博客删除成功'),
      );
    } else {
      res.json(
        new ErrorModel('博客删除失败'),
      );
    }
  });
});

module.exports = router;
