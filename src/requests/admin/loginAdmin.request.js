

const NodemyResponseError = require('../../utils/NodemyResponseError');

const loginAdminRequest = ({ body }) => {

  if (typeof body !== 'object') {
    throw new NodemyResponseError(401, 'Unable to login!');
  }

  const {  username, password, ...rest } = body;
  if (Object.keys(rest).length !== 0) {
    console.log('zzzz')
    throw new NodemyResponseError(401, 'Unable to login!');
  }


  if (typeof username !== 'string') {
    throw new NodemyResponseError(401, 'Unable to login!');
  }

  if (typeof password !== 'string') {
    throw new NodemyResponseError(401, 'Unable to login!');
  }


  if (password.length < 8) {
    throw new NodemyResponseError(401, 'Unable to login!');
  }
};

module.exports = loginAdminRequest;


