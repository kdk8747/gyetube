const passport = require('passport');
const debug = require('debug')('server');
const jwt = require('jsonwebtoken');


var users = [
  { id: '1', name: 'GG', imageUrl: 'url', login: 'naver', permissions: {'groups': {'suwongreenparty': 'admin'}} }
];

exports.authenticateNaver = passport.authenticate('naver');
exports.callbackByNaver = [ passport.authenticate('naver', { session: false }), serialize, generateToken, respond ];
exports.authenticateKakao = passport.authenticate('kakao');
exports.callbackByKakao = [ passport.authenticate('kakao', { session: false }), serialize, generateToken, respond ];
exports.authenticateFacebook = passport.authenticate('facebook');
exports.callbackByFacebook = [ passport.authenticate('facebook', { session: false }), serialize, generateToken, respond ];

function serialize(req, res, next) {
  debug(req.user);
  let i = users.findIndex(item => item.id === +req.user.id);
  if (i >= 0) {
    users[i] = req.user;
  }else{
    users.push(req.user);
  }
  //req.user.permissions = {'groups': {'suwongreenparty': 'admin'}};
  next();
  /*
  db.updateOrCreate(req.user, function (err, user) {
    if (err) { return next(err); }
    debug(req.user);
    // we store the updated information in req.user again
    req.user = {
      id: user.id
    };
    next();
  });*/
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
        id: req.user.id
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


exports.getAll = (req, res) => {
  res.json(users); // TODO: remove permissions (with mongoDB)
}
exports.getByID = (req, res) => {
  res.json(users.find(item => item.id === req.params.id)); // TODO: remove permissions (with mongoDB)
}
exports.updateByID = (req, res) => {
  let i = users.findIndex(item => item.id === req.params.id);
  users[i] = req.body;
  res.send();
}
exports.deleteByID = (req, res) => {
  users = users.filter(h => h.id !== req.params.id);
  res.send();
}