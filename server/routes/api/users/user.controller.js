const passport = require('passport');
const debug = require('debug')('server');
const jwt = require('jsonwebtoken');


var users = [
  { id: '1', name: 'giraffe', imageUrl: 'http://1.bp.blogspot.com/-Gr59j-9gCqE/UZYMhp4fqeI/AAAAAAAAIR0/RpelAMDWxJg/s1600/Giraffe-Cute-Pictires-2013-0.jpg', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: '2', name: 'dog', imageUrl: 'http://isseysmith.co.uk/wp-content/uploads/2011/03/dog.jpg', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: '3', name: 'cat', imageUrl: 'https://3.bp.blogspot.com/-flSU2xF4YTA/UfLrruLRTWI/AAAAAAAAEd4/d-Nn6WpLCVI/s1600/Cute+Cats+6.jpg', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: '4', name: 'bunny', imageUrl: 'http://2.bp.blogspot.com/-T5kqWdFlMOc/UT2nUjplytI/AAAAAAAAH_4/tyZtroEd16I/s1600/funny+cute+animals-2013-00.jpg', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: '5', name: 'fox', imageUrl: 'http://3.bp.blogspot.com/-C_PqsweDoyk/UT2nSjQBHBI/AAAAAAAAH_k/IvQ52hybtXo/s1600/funny+cute+animals-2013-0.jpg', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: 'yd', name: '최연두', imageUrl: '', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: 'hk', name: '김희경', imageUrl: '', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: '471891074', name: '김동규', imageUrl: 'http://mud-kage.kakao.co.kr/14/dn/btqgWLt7ZtZ/lEmudQumElRfIWRrUvkItk/o.jpg', loggedInBy: 'kakao', permissions: {'groups': {'suwongreenparty': ['member','commitee'], 'examplelocalparty': ['reader']}} },
  { id: 'sj', name: '고성준', imageUrl: '', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: 'jy', name: '신지연', imageUrl: '', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: 'ty', name: '한태연', imageUrl: '', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
  { id: 'jh', name: '한진희', imageUrl: '', loggedInBy: 'naver', permissions: {'groups': {'suwongreenparty': ['member']}} },
];

exports.authenticateNaver = passport.authenticate('naver');
exports.callbackByNaver = [ passport.authenticate('naver', { session: false }), serialize, generateToken, respond ];
exports.authenticateKakao = passport.authenticate('kakao');
exports.callbackByKakao = [ passport.authenticate('kakao', { session: false }), serialize, generateToken, respond ];
exports.authenticateFacebook = passport.authenticate('facebook');
exports.callbackByFacebook = [ passport.authenticate('facebook', { session: false }), serialize, generateToken, respond ];

function serialize(req, res, next) {
  debug(req.user);
  let i = users.findIndex(item => item.id === req.user.id);
  if (i >= 0) {
    req.user.permissions = users[i].permissions;
  }else{
    req.user.permissions = {'groups': {}};
    users.push(req.user);
  }
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
        id: req.user.id,
        permissions: req.user.permissions
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
  res.redirect('/#/login?token=' + req.token);
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
  let found = users.find(item => item.id === req.params.id);
  if (found == undefined){
    res.writeHead(404, {'Content-Type': 'application/json'})
    res.send();
  }
  res.json(found); // TODO: remove permissions (with mongoDB)
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
