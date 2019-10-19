const express = require('express');

const router = express.Router();

const { login } = require('../controller/user');
const { SuccessModel, ErrorModel } = require('../model/resModel');

router.post('/login', (req, res, next) => {
  const { username, password } = req.body;
  const result = login(username, password);
  return result.then((data) => {
    if (data.username) {
      // 设置 session
      req.session.username = data.username;
      req.session.realname = data.realname;
      // set(req.sessionId, req.session); // 用了express-session插件就不再同步插入redis,而是配合connect-redis插入，app.js
      res.json(
        new SuccessModel('登陆成功'),
      );
      return;
    }
    res.json(
      new ErrorModel('登陆失败'),
    );
  });
});

module.exports = router;
