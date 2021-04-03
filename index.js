
require('./services/passport.js');

//	database
const fs = require("fs");
const dbFile = "./db/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

//	auth/cookies
const cookieSession = require('cookie-session');
const passport = require('passport');
const keys = require('./config/keys.js');

//	express app
const express = require('express');
const app = express();
//	set cookies with 30 days shelf life, encoded with key
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
	})
);
app.use(passport.initialize());
app.use(passport.session());
//	define app route handling for this app in appRoutes file
require('./routes/appRoutes.js')(app);
//	define authorization route handling for this app in authRoutes file
require('./routes/authRoutes.js')(app);

app.listen(5000);
