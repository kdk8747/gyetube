const passport = require('passport');
const uuidv1 = require('uuid/v1');
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
    let user_id = await db.execute(
      'SELECT user_id\
      FROM user\
      WHERE third_party=? AND third_party_access_token=?', [req.user.third_party, req.user.third_party_access_token]);

    if (user_id[0][0]) {
      req.user.id = user_id[0][0].user_id.toString('hex');
    }
    else {
      req.user.id = uuidv1().replace(/-/g, '');

      await db.execute(
        'INSERT INTO user VALUE(UNHEX(?), ?, ?)', [
          req.user.id,
          req.user.third_party,
          req.user.third_party_access_token
        ]);
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
      user_id: req.user.id,
      name: encodeURIComponent(req.user.name),
      image_url: encodeURIComponent(req.user.image_url),
      third_party: req.user.third_party
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
