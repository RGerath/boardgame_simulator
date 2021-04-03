const passport = require('passport');

//	route to index.html if not logged in, route to game board if logged in
module.exports = (app) => {
	app.get("/", (req, res) => {
		res.sendFile('../views/index.html');
	});
}
