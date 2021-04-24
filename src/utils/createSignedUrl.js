const {sha512} = require('js-sha512');

const createSignedUrl = (isUpload, path) => {
  const url = process.env.CLOUD_URL;
  const pub = process.env.CLOUD_PUB;
  const pri = process.env.CLOUD_PRI;
  const exp = parseInt((new Date().getTime() / 1000).toFixed(0)) + (15 * 60 + 15); // 15 minutes 15 seconds from now
  const method = isUpload ? "POST" : "GET";

  if (!path) {
    path = ''
  }

  const hPath = isUpload ? '/signed/files/upload' : `/signed/files/download/${process.env.CLOUD_BUCKET}${path}`

  const sign = sha512(pri + method + url + hPath + exp.toString())

  return `${url}/signed/files/${isUpload ? 'upload' : 'download'}/${process.env.CLOUD_BUCKET}${path}?ALG=SHA512&PUB=${pub}&SIG=${sign}&EXP=${exp}`;
}

module.exports = createSignedUrl;