var express = require('express');
var router = express.Router();
const uuid = require('uuid');

function getRandomIntInclusive(min = 1, max = 1000) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

/* GET home page. */
router.get('/', function(req, res, next) {
    let user = { name: uuid.v1(), id: getRandomIntInclusive(), };
  res.render('index', { title: '测试简易排队系统', user: user });
});

module.exports = router;
