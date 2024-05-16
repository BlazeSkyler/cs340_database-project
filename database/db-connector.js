/* Citation for the following:
   Date: 5/15/2024
   Copied from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
*/

// Get an instance of mysql we can use in the app
var mysql = require('mysql')

// Create a 'connection pool' using the provided credentials
var pool = mysql.createPool({
	connectionLimit : 10,
	host			: 'classmysql.engr.oregonstate.edu',
	user			: '*',
	password		: '*',
	database		: '*'
})

// Export it for use in our application
module.exports.pool = pool