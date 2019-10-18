var express = require('express');
var router = express.Router();

const {
  getList, getDetail, newBlog, updateBlog, delBlog,
} = require('../controller/blog');
const { SuccessModel, ErrorModel } = require('../model/resModel');
const loginCheck = require('../middlewares/loginCheck');


router.get('/list', function (req, res, next) {
  let author = req.query.author || '';
  let keyword = req.query.keyword || '';

  if (req.query.isadmin) {
    // 管理员界面
    if (req.session.username === null) {
      // 未登录
      res.json(
        new ErrorModel('未登录')
      );
      return
    }
    // 强制查询自己的博客
    author = req.session.username;
  }

  const result = getList(author, keyword);

  return result.then((listdata) => {
    if (listdata.length) {
      res.json(
        new SuccessModel(listdata)
      );
    }
    res.json(
      new ErrorModel('无结果')
    );
  });
});

router.get('/detail', function (req, res, next) {
  res.json({
    error: 0,
    data: 'OK'
  });
});

module.exports = router;
