

const helpers = {};

helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {       
    
    return next();
  }
  req.flash('success_msg', 'Inicia session!');
  res.redirect('/users/signin');
};

module.exports = helpers;