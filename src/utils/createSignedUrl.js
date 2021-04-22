const {sha512} = require('js-sha512');

const createSignedUrl = (isUpload, path) => {
  const url = process.env.CLOUD_URL;
  const pub = process.env.CLOUD_PUB;
  const pri = process.env.CLOUD_PRI;
  const exp = parseInt((new Date().getTime() / 1000).toFixed(0)) + (15 * 60 + 15); // 15 minutes 15 seconds from now
  const method = isUpload ? "POST" : "GET";
  const sign = sha512(pri + method + url + path + exp.toString())

  if (!path) {
    path = ''
  }

  return `${url}/signed/files/${isUpload ? 'upload' : 'download'}${path}?ALG=SHA512&PUB=${pub}&SIG=${sign}&EXP=${exp}`;
}

module.exports = createSignedUrl;