// middlewares/AdminAuth.js (new version)
module.exports = (req, res, next) => {
  if (req.session && req.session.user) {
    return next(); // Microsoft-authenticated
  }
  return res.redirect('/api/admin/login');
};
