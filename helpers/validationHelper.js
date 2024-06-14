function validatePasswordMatch(password, re_password) {
    return password === re_password;
  }
  
  module.exports = {
    validatePasswordMatch,
  };
  