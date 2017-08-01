const passport = require('passport');
const debug = require('debug')('server');
const jwt = require('jsonwebtoken');


exports.authenticateNaver = passport.authenticate('naver');
exports.callbackByNaver = [ passport.authenticate('naver', { session: false }), serialize, generateToken, respond ];
exports.authenticateKakao = passport.authenticate('kakao');
exports.callbackByKakao = [ passport.authenticate('kakao', { session: false }), serialize, generateToken, respond ];
exports.authenticateFacebook = passport.authenticate('facebook');
exports.callbackByFacebook = [ passport.authenticate('facebook', { session: false }), serialize, generateToken, respond ];

function serialize(req, res, next) {
  db.updateOrCreate(req.user, function (err, user) {
    if (err) { return next(err); }
    debug(req.user);
    // we store the updated information in req.user again
    req.user = {
      id: user.id
    };
    next();
  });
}
const db = {
  updateOrCreate: function (user, cb) {
    // db dummy, we just cb the user
    cb(null, user);
  }
};
function generateToken(req, res, next) {
  req.token =
    jwt.sign({
      id: req.user.id,
      //username: user.username,
      //admin: user.admin
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '7d',
        issuer: 'grassroots.kr',
        subject: 'userInfo'
    });
  next();
}
function respond(req, res) {
  res.redirect('/login?token=' + req.token);
  /*
  res.status(200).json({
    user: req.user,
    token: req.token
  });*/
}


var users = [
  { id: 1, email: 'kdk@naver.com', password: '123' },
  { id: 2, email: 'hjh@naver.com', password: '123' },
  { id: 3, email: 'kja@naver.com', password: '123' },
  { id: 4, email: 'khk@naver.com', password: '123' },
];
var userID = 5;
exports.getAll = (req, res) => {
  res.json(users);
}
exports.getByID = (req, res) => {
  res.json(users.find(item => item.id === +req.params.id));
}
exports.updateByID = (req, res) => {
  let i = users.findIndex(item => item.id === +req.params.id);
  users[i] = req.body;
  res.send();
}
exports.create = (req, res) => {
  let newHero = req.body;
  newHero['id'] = userID++;
  users.push(newHero);
  res.json(newHero);
}
exports.deleteByID = (req, res) => {
  users = users.filter(h => h.id !== +req.params.id);
  res.send();
}