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
			const dateValue = date ? moment(date).format('MM-DD-YYYY') : "NULL"
			return dateValue
			// return moment(date).format('MM-DD-YYYY')
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
		},
		test: function (array, key, options) {
			return array[key]
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

				// display customer name instead of id
				let customermap = {}
				customers.map(customer => {
					let id = parseInt(customer.customerID, 10)

					customermap[id] = customer["firstName"] + " " + customer["lastName"]
				})

				orders = orders.map(order => {
					return Object.assign(order, {customerID: customermap[order.customerID]})
				})

				db.pool.query(query3, (error, rows, fields) => {
					let workers = rows

					let workermap = {}
					workers.map(worker => {
						let id = parseInt(worker.workerID, 10)

						workermap[id] = worker["firstName"] + " " + worker["lastName"]
					})

					// display NULL if null
					orders = orders.map(order => {
						return Object.assign(order, {workerID: order.workerID === null ? "NULL" : workermap[order.workerID]})
					})

					// console.log(workermap)

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
		let query2_5 = "SELECT * FROM Customers"
		let query3 = "SELECT * FROM Cupcakes;"

		db.pool.query(query1, function(error,rows,fileds){
			let cupcakesordered = rows

			db.pool.query(query2, (error, rows, fields) => {
				let orders = rows

				// let ordermap = {}
				// orders.map(order => {
				// 	let id = parseInt(order.orderID, 10)

				// 	ordermap[id] = order["customerID"] + " " + order["datePlaced"]
				// })

				// // map customerID in place or orderID in cupcakesordered
				// cupcakesordered = cupcakesordered.map(cupcakeorder => {
				// 	return Object.assign(cupcakeorder, {orderID: ordermap[cupcakeorder.orderID]})
				// })

				// query to display customer name in place of orderID
				db.pool.query(query2_5, (error, rows, fields) => {
					let customers = rows

					let customermap = {}
					customers.map(customer => {
						let id = parseInt(customer.customerID, 10)

						customermap[id] = customer["firstName"] + " " + customer["lastName"]
					})

					// display customer name instead of customerID in order
					orders = orders.map(order => {
						return Object.assign(order, {customerID: customermap[order.customerID]})
					})

					// display customer name instead of ID (build on last query for cupcakesordered)
					// cupcakesordered = cupcakesordered.map(cupcakeorder => {
					// 	return Object.assign(cupcakeorder, {orderID: customermap[cupcakeorder.orderID]})
					// })
				})

					db.pool.query(query3, (error, rows, fields) => {
						let cupcakes = rows

						// display cupcakes by cakeFlavor, frostingFlavor
						let cupcakemap = {}
						cupcakes.map(cupcake => {
							let id = parseInt(cupcake.cupcakeID, 10)

							cupcakemap[id] = cupcake["cakeFlavor"] + ", " + cupcake["frostingFlavor"]
						})

						cupcakesordered = cupcakesordered.map(cupcakeorder => {
							return Object.assign(cupcakeorder, {cupcakeID: cupcakemap[cupcakeorder.cupcakeID]})
						})

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
	let datePickedup = Date.parse(data.datePickedup)

	if (isNaN(workerID)){
		workerID = 'NULL'
	}

	query1 = `INSERT INTO Orders (customerID, workerID, datePlaced, datePickedup, totalPrice)
	VALUES (${data.customerID}, ${workerID}, '${data.datePlaced}', `

	// query changes to make date null
	if (isNaN(datePickedup)){
		datePickedup = null
		query1 += `${datePickedup}, ${data.totalPrice})`
	} else {
		query1 += `'${data.datePickedup}', ${data.totalPrice})`
	}

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


app.delete('/delete-order-ajax', function(req, res, next)
{
	let data = req.body
	let orderID = parseInt(data.id)
	let delete_CupcakesOrdered = "DELETE FROM CupcakesOrdered WHERE orderID = ?"
	let delete_Order = "DELETE FROM Orders WHERE orderID = ?"

	// run first query
	db.pool.query(delete_CupcakesOrdered, [orderID], function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		else {
			db.pool.query(delete_Order, [orderID], function(error, rows, fields) {
				if (error) {
					console.log(error)
					res.sendStatus(400)
				}
				else {
					res.sendStatus(204)
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


app.put('/put-order-ajax', function(req, res, next)
{
	let data = req.body

	let orderID = parseInt(data.orderID)
	let workerID = parseInt(data.workerID)
	let datePickedup = Date.parse(data.datePickedup)

	if (isNaN(workerID)){
		workerID = null
	}

	// 2 queries to update worker
	let queryUpdateWorker = `UPDATE Orders SET workerID = ? WHERE orderID = ?`
	let selectWorker = `SELECT * FROM Workers WHERE workerID = ?`

	// query to update datePickedup - different if null
	let queryUpdateDate = `UPDATE Orders SET datePickedup = `
	if (isNaN(datePickedup)){
		datePickedup = null
		queryUpdateDate += `${datePickedup} `
	} else {
		queryUpdateDate += `'${data.datePickedup}' `
	}
	queryUpdateDate += `WHERE orderID = ?`

	// run first query for workers
	db.pool.query(queryUpdateWorker, [workerID, orderID], function(error, rows, fields) {
		if (error) {
			console.log(error)
			res.sendStatus(400)
		}
		// second workers query
		else {
			db.pool.query(selectWorker, [workerID], function(error, rows, fields) {
				if (error) {
					console.log(error)
					res.sendStatus(400)
				}
				else {
					db.pool.query(queryUpdateDate, [orderID], function(error, rows, fields) {
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