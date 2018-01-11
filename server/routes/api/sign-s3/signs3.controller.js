const crypto = require('crypto');

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

function getSignatureKey(key, dateStamp, regionName, serviceName) {
  let kDate = crypto.createHmac('sha256', 'AWS4' + key).update(dateStamp).digest();
  let kRegion = crypto.createHmac('sha256', kDate).update(regionName).digest();
  let kService = crypto.createHmac('sha256', kRegion).update(serviceName).digest();
  let kSigning = crypto.createHmac('sha256', kService).update('aws4_request').digest();
  return kSigning;
}

exports.getSign = (req, res) => {
  const amzDate = req.query['amz-date'];
  let authDate = amzDate.split('T')[0];
  let credential = `${process.env.AWS_ACCESS_KEY_ID}/${authDate}/ap-northeast-2/s3/aws4_request`;
  let keyPath = req.permissions.group_id + '/' + req.params.category + '/';

  let expiration = new Date();
  expiration.setMinutes(expiration.getMinutes() + 3);
  let policy = {
    'expiration': expiration,
    'conditions': [
      { 'bucket': 'grassroots-groups' },
      ['starts-with', '$key', keyPath],
      { 'acl': 'public-read' },
      { 'x-amz-meta-uuid': '14365123651274' },
      { 'x-amz-server-side-encryption': 'AES256' },
      { 'success_action_status': '201' },
      { 'x-amz-credential': credential },
      { 'x-amz-algorithm': 'AWS4-HMAC-SHA256' },
      { 'x-amz-date': amzDate }
    ]
  };
  if (req.params.category != 'documents')
    policy.conditions.push(['starts-with', '$Content-Type', 'image/']);

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
