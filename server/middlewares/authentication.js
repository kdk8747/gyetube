const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  /*if (req.method === 'GET') {
    next();
    return;
  }*/
  // read the token from header
  let token = null;
  if (req.headers && req.headers.authorization) {
    let parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      let scheme = parts[0];
      let credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    }
  }

  // token does not exist
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'not logged in'
    });
  }

  // create a promise that decodes the token
  const p = new Promise(
    (resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(err);
        resolve(decoded);
      });
    }
  );

  // if it has failed to verify, it will return an error message
  const onError = (error) => {
    res.status(401).json({
      success: false,
      message: error.message
    });
  };

  // process the promise
  p.then((decoded) => {
    req.decoded = decoded;
    /*if (req.method === 'GET') {
      next();
      return;
    } else */{
      if (decoded.permissions.groups['suwongreenparty'] === 'admin') {
        next();
        return;
      }
    }
    res.status(401).json({
      success: false,
      message: error.message
    });
  }).catch(onError);
}
