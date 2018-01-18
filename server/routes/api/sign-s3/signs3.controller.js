const crypto = require('crypto');
const debug = require('debug')('sign-s3');

exports.authCreate = (req, res, next) => {
  const CREATE = 1;
  if (req.permissions[req.params.category] & CREATE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

exports.authDelete = (req, res, next) => {
  const DELETE = 8;
  if (req.permissions[req.params.category] & DELETE)
    next();
  else
    res.status(403).json({
      success: false,
      message: 'permission denied'
    });
}

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  let kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  let kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  let kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  let kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

exports.getPostSign = (req, res) => {
  const amzDate = req.query['amz-date'];
  let authDate = amzDate.split('T')[0];
  let credential = `${process.env.AWS_ACCESS_KEY_ID}/${authDate}/ap-northeast-2/s3/aws4_request`;
  let keyPath = req.permissions.group_id + '/' + req.params.category + '/' + amzDate + '-' + Math.random().toString().substr(2);

  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 3);
  let policy = {
    'expiration': expiration,
    'conditions': [
      { 'bucket': process.env.S3_BUCKET_NAME },
      ['starts-with', '$key', keyPath],
      ['starts-with', '$Content-Type', 'image/'],
      { 'acl': 'public-read' },
      { 'x-amz-server-side-encryption': 'AES256' },
      { 'success_action_status': '201' },
      { 'x-amz-credential': credential },
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
      { 'x-amz-date': amzDate }
    ]
  };

  let policyString = JSON.stringify(policy);
  let stringToSign = new Buffer(policyString).toString('base64');
  let signingKey = getSignatureKey(process.env.AWS_SECRET_ACCESS_KEY, authDate, 'ap-northeast-2', 's3', 'aws4_request');
  let signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  let returnData = {
    stringToSign: stringToSign,
    signature: signature,
    keyPath: keyPath,
    credential: credential
  };
  res.write(JSON.stringify(returnData));
  res.end();
}

exports.getDeleteSign = (req, res) => {
  const amzDate = req.query['amz-date'];
  const keyPath = req.query['key-path'];
  const payload = '';//req.query['payload'];
  let authDate = amzDate.split('T')[0];
  let scope = `${authDate}/ap-northeast-2/s3/aws4_request`;
  let credential = `${process.env.AWS_ACCESS_KEY_ID}/${scope}`;

  let hashedPayload = crypto.createHash('sha256').update(payload).digest('hex');
  let canonicalRequest = `\
DELETE\n\
/${keyPath}\n\
\n\
host:${process.env.S3_BUCKET_NAME}.s3.amazonaws.com\n\
x-amz-content-sha256:${hashedPayload}\n\
x-amz-date:${amzDate}\n\
\n\
host;x-amz-content-sha256;x-amz-date\n\
${hashedPayload}`;

  let stringToSign = `\
AWS4-HMAC-SHA256\n\
${amzDate}\n\
${scope}\n\
${crypto.createHash('sha256').update(canonicalRequest).digest('hex')}`;

  let signingKey = getSignatureKey(process.env.AWS_SECRET_ACCESS_KEY, authDate, 'ap-northeast-2', 's3', 'aws4_request');
  let signature = crypto.createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  let returnData = {
    stringToSign: stringToSign,
    signature: signature,
    keyPath: keyPath,
    credential: credential,
    hashedPayload: hashedPayload
  };
  res.write(JSON.stringify(returnData));
  res.end();
}
