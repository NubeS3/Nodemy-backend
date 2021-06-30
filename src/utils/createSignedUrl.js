// eslint-disable-next-line camelcase
const jwt_decode = require('jwt-decode');
const axios = require('axios')

const url = process.env.CLOUD_URL;
const pub = process.env.CLOUD_PUB;
const pri = process.env.CLOUD_PRI;
const bucket = process.env.CLOUD_BUCKET;
const bucket_id = process.env.CLOUD_BUCKET_ID;
let token = "";

const getNewToken = async () => {
  const res = await axios.post(`${url}/get-auth-token/`, {
    key_id: pub,
    key: pri
  });
  return res.data.auth_token;
}

const createVideoCloudStorageUrl = async (isUpload, path) => {
  // const exp = parseInt((new Date().getTime() / 1000).toFixed(0)) + (15 * 60 + 15); // 15 minutes 15 seconds from now
  // const method = isUpload ? "POST" : "GET";

  // if (!path) {
  //   path = ''
  // }

  // const hPath = isUpload ? '/signed/files/upload' : `/signed/files/download/${process.env.CLOUD_BUCKET}${path}`
  //
  // const sign = sha512(pri + method + url + hPath + exp.toString())
  //
  // return `${url}/signed/files/${isUpload ? 'upload' : `download/${process.env.CLOUD_BUCKET}`}${path}?ALG=SHA512&PUB=${pub}&SIG=${sign}&EXP=${exp}`;

  if (!token || token === "") {
    token = await getNewToken();
  }
  else {
    const decoded = jwt_decode(token)
    const expiredDate = decoded.exp;
    const resetTimestamp = parseInt((new Date().getTime() / 1000).toFixed(0)) - 15 * 60;
    if (resetTimestamp < expiredDate) {
      token = await getNewToken();
    }
  }

  let resUrl = "";
  if (isUpload) {
    resUrl = `${url}/accessKey/files/upload`;
  }
  else {
    resUrl = `${url}/key-query/files/download/${bucket}/${path}?authorization=${token}`;
  }

  return {
    type: isUpload ? "upload" : "download",
    resUrl,
    token,
    bucket,
    bucket_id
  }
}



module.exports = createVideoCloudStorageUrl;