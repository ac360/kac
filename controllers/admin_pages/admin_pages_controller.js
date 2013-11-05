
/*
 * GET Admin Home Page.
 */

exports.index = function(req, res){
  res.render('admin/index', { title: 'Keep-A-Contact Admin Page' });
};