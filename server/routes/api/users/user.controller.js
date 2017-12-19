const passport = require('passport');
const debug = require('debug')('user');
const jwt = require('jsonwebtoken');
const db = require('../../../database');


exports.authenticateNaver = passport.authenticate('naver');
exports.callbackByNaver = [passport.authenticate('naver', { session: false }), serialize, generateToken, respond];
exports.authenticateKakao = passport.authenticate('kakao');
exports.callbackByKakao = [passport.authenticate('kakao', { session: false }), serialize, generateToken, respond];
exports.authenticateFacebook = passport.authenticate('facebook');
exports.callbackByFacebook = [passport.authenticate('facebook', { session: false }), serialize, generateToken, respond];

async function serialize(req, res, next) {
  debug(req.user);
  try {
    let result = await db.execute(
      'SELECT P.group_id, P.member, P.role, P.proceeding, P.decision, P.activity, P.receipt\
      FROM user U\
      LEFT JOIN user_permission P ON P.user_id=U.user_id\
      WHERE U.third_party=? AND U.third_party_access_token=?', [req.user.third_party, req.user.third_party_access_token]);
    debug(result[0]);

    req.user.permissions = { 'groups': {} };
    if (result[0][0]){
      for (let i = 0; i < result[0].length; i ++){
        let p = result[0][i];
        req.user.permissions.groups[p.group_id] = {
          'member':p.member,
          'role': p.role,
          'proceeding':p.proceeding,
          'decision':p.decision,
          'activity':p.activity,
          'receipt':p.receipt
        };
      }
    }
    else {
      let result = await db.execute(
        'INSERT INTO user VALUE(UNHEX(REPLACE(UUID(), "-","")), ?, ?, ?, ?)', [
          req.user.image_url,
          req.user.third_party,
          req.user.third_party_access_token,
          req.user.name
        ]);
      debug(result[0]);
    }

    next();
  }
  catch (err) {
    res.status(500).json({
      success: false,
      message: err
    });
  }
}

function generateToken(req, res, next) {
  req.token =
    jwt.sign({
      id: 'test_fixme',
      name: encodeURIComponent(req.user.name),
      image_url: req.user.image_url,
      third_party: req.user.third_party,
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
  res.status(401).json({
    success: false,
    message: 'not logged in'
  });
}
exports.getByID = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'not logged in'
  });
}
exports.updateByID = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'not logged in'
  });
}
exports.deleteByID = (req, res) => {
  res.status(401).json({
    success: false,
    message: 'not logged in'
  });
}
