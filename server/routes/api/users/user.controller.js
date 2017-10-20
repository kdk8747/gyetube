const passport = require('passport');
const debug = require('debug')('server');
const jwt = require('jsonwebtoken');


var users = [
  {
    id: '1', name: 'giraffe',
    imageBase64: 'data:image/png;base64,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',
    imageUrl: 'http://1.bp.blogspot.com/-Gr59j-9gCqE/UZYMhp4fqeI/AAAAAAAAIR0/RpelAMDWxJg/s1600/Giraffe-Cute-Pictires-2013-0.jpg',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: '2', name: 'dog',
    imageBase64: 'data:image/png;base64,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',
    imageUrl: 'http://isseysmith.co.uk/wp-content/uploads/2011/03/dog.jpg',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: '3', name: 'cat',
    imageBase64: 'data:image/png;base64,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',
    imageUrl: 'https://3.bp.blogspot.com/-flSU2xF4YTA/UfLrruLRTWI/AAAAAAAAEd4/d-Nn6WpLCVI/s1600/Cute+Cats+6.jpg',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: '4', name: 'bunny',
    imageBase64: 'data:image/png;base64,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',
    imageUrl: 'http://2.bp.blogspot.com/-T5kqWdFlMOc/UT2nUjplytI/AAAAAAAAH_4/tyZtroEd16I/s1600/funny+cute+animals-2013-00.jpg',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: '5', name: 'fox',
    imageBase64: 'data:image/png;base64,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',
    imageUrl: 'http://3.bp.blogspot.com/-C_PqsweDoyk/UT2nSjQBHBI/AAAAAAAAH_k/IvQ52hybtXo/s1600/funny+cute+animals-2013-0.jpg',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: 'yd', name: '최연두',
    imageBase64: '',
    imageUrl: '',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: 'hk', name: '김희경',
    imageBase64: '',
    imageUrl: '',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: '471891074', name: '김동규',
    imageBase64: '',
    imageUrl: 'http://mud-kage.kakao.co.kr/14/dn/btqgWLt7ZtZ/lEmudQumElRfIWRrUvkItk/o.jpg',
    loggedInBy: 'kakao',
    permissions: { 'groups': { 'suwongreenparty': ['member', 'commitee'], 'examplelocalparty': ['reader'] } },
    uncheckedDecisions: [{group:'suwongreenparty', id:1} ],
    notifications: []
  },
  {
    id: 'sj', name: '고성준',
    imageBase64: '',
    imageUrl: '',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: 'jy', name: '신지연',
    imageBase64: '',
    imageUrl: '',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: 'ty', name: '한태연',
    imageBase64: '',
    imageUrl: '',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
  {
    id: 'jh', name: '한진희',
    imageBase64: '',
    imageUrl: '',
    loggedInBy: 'naver', permissions: { 'groups': { 'suwongreenparty': ['member'] } },
    uncheckedDecisions: [],
    notifications: []
  },
];

exports.authenticateNaver = passport.authenticate('naver');
exports.callbackByNaver = [passport.authenticate('naver', { session: false }), serialize, generateToken, respond];
exports.authenticateKakao = passport.authenticate('kakao');
exports.callbackByKakao = [passport.authenticate('kakao', { session: false }), serialize, generateToken, respond];
exports.authenticateFacebook = passport.authenticate('facebook');
exports.callbackByFacebook = [passport.authenticate('facebook', { session: false }), serialize, generateToken, respond];

function serialize(req, res, next) {
  debug(req.user);
  let i = users.findIndex(item => item.id === req.user.id);
  if (i >= 0) {
    req.user.permissions = users[i].permissions;
  } else {
    req.user.permissions = { 'groups': {} };
    req.user.uncheckedDecisions = [];
    req.user.notifications = [];
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
  if (found == undefined) {
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.send();
  }
  res.json(found); // TODO: remove permissions (with mongoDB)
}
exports.updateByID = (req, res) => {
  if (req.params.id === req.decoded.id) {
    let i = users.findIndex(item => item.id === req.params.id);
    users[i] = req.body;
    res.send();
  }
  else
    res.status(401).json({
      success: false,
      message: 'not logged in'
    });
}
exports.deleteByID = (req, res) => {
  if (req.params.id === req.decoded.id) {
    users = users.filter(h => h.id !== req.params.id);
    res.send();
  }
  else
    res.status(401).json({
      success: false,
      message: 'not logged in'
    });
}
