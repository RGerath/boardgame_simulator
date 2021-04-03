const passport = require('passport');

module.exports = (app) => {
	//	on auth/google page, request google authentication
	app.get('/auth/google', passport.authenticate('google', {
		scope: ['profile', 'email']
	}));
	//	on auth/google/callback page, request
	app.get('/auth/google/callback', passport.authenticate('google'));

	app.get('/api/logout', (req, res) => {
		//	log out user
		req.logout();
		//	return now-undefined user object
		res.send(req.user);
	});

	//	log current user information to confirm log-in
	app.get('/api/current_user', (req, res) => {
		res.send(req.user);
	});
};
