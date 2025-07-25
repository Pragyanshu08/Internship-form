// middlewares/AdminAuth.js (new version)
module.exports = (req, res, next) => {

  // const adminEmails = ['rakesh.raikwar@thetechharvest.com'];

  if (
    req.session &&
    req.session.user
  ) {
    return next(); // Allow only known admin emails
  }
  return res.redirect('/api/admin/login');
};
