

const NodemyResponseError = require('../../utils/NodemyResponseError');

const loginAdminRequest = ({ body }) => {
  if (typeof body !== 'object') {
    throw new NodemyResponseError(401, 'Unable to login!');
  }

  const {  adminUsername, password, ...rest } = body;
  if (Object.keys(rest).length !== 0) {
    throw new NodemyResponseError(401, 'Unable to login!');
  }

  if (typeof adminUsername !== 'string') {
    throw new NodemyResponseError(401, 'Unable to login!');
  }

  if (typeof password !== 'string') {
    throw new NodemyResponseError(401, 'Unable to login!');
  }
};

module.exports = loginAdminRequest;


