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
		},
		displayPrice: function (price) {
			return price.toFixed(2)
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
		let query2 = "SELECT * FROM Customers;"
		let query3 = "SELECT * FROM Workers"
		db.pool.query(query1, function(error,rows,fileds){
			let orders = rows

			db.pool.query(query2, (error, rows, fields) => {
				let customers = rows

				db.pool.query(query3, (error, rows, fields) => {
					let workers = rows
					res.render('orders', {
					title: "Orders",
					data: orders, customers: customers, workers: workers
				})
			})
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


app.post('/add-customer-ajax', function(req, res)
{
	let data = req.body

	let email = data.email
	let phoneNum = data.phoneNum

	// set NULLs
	if (email == ''){
		email = 'NULL'
	}
	if (phoneNum == ''){
		phoneNum = 'NULL'
	}

	query1 = `INSERT INTO Customers (firstName, lastName, email, phoneNum)
	VALUES ('${data.firstName}', '${data.lastName}', '${email}', '${phoneNum}')`
	db.pool.query(query1, function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			query2 = "SELECT * FROM Customers;"
			db.pool.query(query2, function(error, rows, fields) {
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

app.post('/add-worker-ajax', function(req, res)
{
	let data = req.body

	let email = data.email
	let phoneNum = data.phoneNum

	// set NULLs
	if (email == ''){
		email = 'NULL'
	}
	if (phoneNum == ''){
		phoneNum = 'NULL'
	}

	query1 = `INSERT INTO Workers (firstName, lastName, email, phoneNum)
	VALUES ('${data.firstName}', '${data.lastName}', '${email}', '${phoneNum}')`
	db.pool.query(query1, function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			query2 = "SELECT * FROM Workers;"
			db.pool.query(query2, function(error, rows, fields) {
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

app.post('/add-cupcake-ajax', function(req, res)
{
	let data = req.body

	let cakeColor = data.cakeColor
	let frostingColor = data.frostingColor

	if (cakeColor == ''){
		cakeColor = 'NULL'
	}
	if (frostingColor == ''){
		frostingColor = 'NULL'
	}

	query1 = `INSERT INTO Cupcakes (cakeFlavor, cakeColor, frostingFlavor, frostingColor, price)
	VALUES ('${data.cakeFlavor}', '${cakeColor}', '${data.frostingFlavor}', '${frostingColor}', ${data.price})`
	db.pool.query(query1, function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			query2 = "SELECT * FROM Cupcakes;"
			db.pool.query(query2, function(error, rows, fields) {
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

app.post('/add-order-ajax', function(req, res)
{
	let data = req.body

	let workerID = parseInt(data.workerID)
	let datePickedup = data.datePickedup

	if (isNaN(workerID)){
		workerID = 'NULL'
	}
	if (datePickedup == ''){
		datePickedup = 'NULL'
	}

	query1 = `INSERT INTO Orders (customerID, workerID, datePlaced, datePickedup, totalPrice)
	VALUES (${data.customerID}, ${workerID}, '${data.datePlaced}', '${datePickedup}', ${data.totalPrice})`
	db.pool.query(query1, function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			query2 = "SELECT * FROM Orders;"
			db.pool.query(query2, function(error, rows, fields) {
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

app.post('/add-cupcakesordered-ajax', function(req, res)
{
	let data = req.body

	// query to run on database
	query1 = `INSERT INTO CupcakesOrdered (orderID, cupcakeID, quantity)
	VALUES (${data.orderID}, ${data.cupcakeID}, ${data.quantity})`
	db.pool.query(query1, function(error, rows, fields) {

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
	let cupcakesOrderedID = parseInt(data.id)
	let delete_CupcakesOrdered = "DELETE FROM CupcakesOrdered WHERE cupcakesOrderedID = ?"

	db.pool.query(delete_CupcakesOrdered, [cupcakesOrderedID], function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			res.sendStatus(204)
		}
	})
})

app.put('/put-cupcakesordered-ajax', function(req, res, next)
{
	let data = req.body

	let cupcakesOrderedID = parseInt(data.cupcakesOrderedID)
	let quantity = parseInt(data.quantity)

	let queryUpdateQuantity = "UPDATE CupcakesOrdered SET quantity = ? WHERE cupcakesOrderedID = ?"

	// run first query
	db.pool.query(queryUpdateQuantity, [quantity, cupcakesOrderedID], function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		// run second query
		else {
			res.send(rows)
		}
	})
})


/*
	LISTENER
*/
app.listen(PORT, function(){
	console.log('Express started on http://localhost:' + PORT + ', press Ctrl-C to terminate.')
})