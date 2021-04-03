const passport = require('passport');
const googlestrat = require('passport-google-oauth20').Strategy;
const keys = require('../config/keys.js');

//	connect to db
const fs = require("fs");
const dbFile = "./db/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

passport.serializeUser((user, done) => {
	//	extract from user the identifying token
	console.log(user);
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	//	retrieve user from database with id
	db.get('SELECT * FROM Players WHERE id = (?)', id, (err, rows) => {
		if (err) {
			console.log("error deserializing token for user ".concat(id));
		} else {
			console.log("deserialized user:");
			console.log(rows);
			done(null, rows);
		}
	});
});

passport.use(
	new googlestrat({
		clientID: keys.googleClientID,
		clientSecret: keys.googleClientSecret,
		callbackURL: '/auth/google/callback'
	}, async (accessToken, refreshToken, profile, done) => {
		/*console.log('access token', accessToken);
		console.log('refresh token', refreshToken);
		console.log('profile', profile);*/
		//	check whether profile.id matches id in sqlite db
		var exists = 0;
		console.log("querying database for player id");
		db.get('SELECT EXISTS (SELECT * FROM Players WHERE id = (?))', profile.id, (err, rows) => {
	    if (err) {
	      console.log("error seeking row for ".concat(profile.id));
	    } else {
	      console.log("no error on Players search");
	      console.log("Players search results:");
				console.log(JSON.stringify(rows));
				exists = JSON.stringify(rows).charAt(JSON.stringify(rows).length - 2);

				//	now run insertion if needed
				console.log("exists value:");
				console.log(exists);
				if (exists == 0) {
					//	save new row to sqlite db table "Players" with name taken from profile.displayName
					console.log("inserting:");
					console.log("ID: ".concat(profile.id));
					console.log("Name: ".concat(profile.displayName));
					insertQuery = 'INSERT INTO Players (id, name, wins, games) VALUES (\"'.concat(profile.id).concat('\", \"').concat(profile.displayName).concat('\", 0, 0)');
					console.log(insertQuery);
					db.run(insertQuery, error => {
						if (error) {
							console.log("insertion failed");
							console.log(error);
						} else {
							console.log("insertion successful for user: ".concat(profile.id));
							user = {"id": profile.id};
							//	call done function on new user record from database
							done(null, user);
						}
					});
				} else {
					console.log("user identified as returning user: ".concat(profile.id));
					user = {"id": profile.id};
					//	call done function on found user
					done(null, user);
				}
	    }
	  });
	})
);
