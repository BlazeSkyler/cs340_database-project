/* Citation for the following:
   Date: 5/15/2024
   Copied from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main
*/

/*
	SETUP
*/
var express = require('express')
var app = express()
PORT = 35117

// database
var db = require('./database/db-connector')

const moment = require('moment')

// handlebars
const { engine } = require('express-handlebars')
var exphbs = require('express-handlebars')
app.engine('.hbs', engine({extname: ".hbs",
	helpers: {
		dateFormat: function (date) {
			return moment(date).format('MM-DD-YYYY');
		},
		/* Citation for the following helper:
			Date: 5/21/2024
			Adapted from:
			https://stackoverflow.com/questions/33350200/can-handlebars-set-a-javascript-variable-to-null
		*/
		checkNull: function (value) {
			return value === null ? "NULL" : value
		}
	}
}))

app.set('view engine', '.hbs')


// JSON and form data
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static(__dirname + '/public'));

/*
	ROUTES
*/
app.get(['/', '/index'], function(req, res)
	{
		let query1 = "SELECT * FROM Customers;"
		db.pool.query(query1, function(error, rows, fields){
			res.render('index', {
				title: "Customers",
				data: rows
			})
		})
	})

app.get('/workers', function(req, res)
	{
		let query1 = "SELECT * FROM Workers;"
		db.pool.query(query1, function(error,rows,fileds){
			res.render('workers', {
				title: "Workers",
				data: rows
			})
		})	
	})

app.get('/cupcakes', function(req, res)
	{
		let query1 = "SELECT * FROM Cupcakes;"
		db.pool.query(query1, function(error,rows,fileds){
			res.render('cupcakes', {
				title: "Cupcakes",
				data: rows
			})
		})	
	})

app.get('/orders', function(req, res)
	{
		let query1 = "SELECT * FROM Orders;"
		db.pool.query(query1, function(error,rows,fileds){
			res.render('orders', {
				title: "Orders",
				data: rows
			})
		})	
	})

app.get('/cupcakesordered', function(req, res)
	{
		let query1 = "SELECT * FROM CupcakesOrdered;"
		let query2 = "SELECT * FROM Orders;"
		let query3 = "SELECT * FROM Cupcakes;"

		db.pool.query(query1, function(error,rows,fileds){
			let cupcakesordered = rows

			db.pool.query(query2, (error, rows, fields) => {
				let orders = rows

				db.pool.query(query3, (error, rows, fields) => {
					let cupcakes = rows
					res.render('cupcakesordered', {
					title: "CupcakesOrdered",
					data: cupcakesordered, orders: orders, cupcakes: cupcakes
				})
			})
		})
	})	
})

app.post('/add-cupcakesordered-ajax', function(req, res)
{
	let data = req.body

	// query to run on database
	query1 = `INSERT INTO CupcakesOrdered (orderID, cupcakeID, quantity)
	VALUES (${data.orderID}, ${data.cupcakeID}, ${data.quantity})`
	db.pool.query(query1, function(error, rows, fields){

		// check for error
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			query2 = "SELECT * from CupcakesOrdered;"
			db.pool.query(query2, function(error, rows, fields){

				// check for error on query2
				if (error) {
					console.log(error)
					res.sendStatus(400)
				}
				else {
					res.send(rows)
				}
			})
		}
	})	
})

app.delete('/delete-cupcakesordered-ajax', function(req, res, next)
{
	let data = req.body
	let cupcakesOrderedID = parseInt(data.cupcakesOrderedID)
	let deleteCupcakesOrdered = "DELETE FROM CupcakesOrdered WHERE cupcakesOrderedID = ?"

	db.pool.query(deleteCupcakesOrdered, [cupcakesOrderedID], function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			res.sendStatus(204)
		}
	})
})


/*
	LISTENER
*/
app.listen(PORT, function(){
	console.log('Express started on http://localhost:' + PORT + ', press Ctrl-C to terminate.')
})