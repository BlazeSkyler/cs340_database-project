-- These are some Database Manipulation queries for a partially implemented Project Website 
-- using the Cupcakes database.

-- get all Customers
SELECT customerID, firstName, lastName, email, phoneNum FROM Customers

-- get all Workers
SELECT workerID, firstName, lastName, email, phoneNum FROM Workers

-- get all Orders
SELECT orderID, customerID, workerID, datePlaced, datePickedup, totalPrice FROM Orders

-- get all Cupcakes
SELECT cupcakeID, cakeFlavor, cakeColor, frostingFlavor, frostingColor, price FROM Cupcakes

-- get all CupcakesOrdered
SELECT cupcakesOrderedID, orderID, cupcakeID, quantity FROM CupcakesOrdered

-- get all CupcakesOrdered for a specific Order
SELECT cupcakesOrderedID, orderID, cupcakeID, quantity FROM CupcakesOrdered WHERE orderID = :orderID_selected_from_browse_order_page

-- get a single Order's data for the Update Order form
SELECT orderID, customerID, workerID, datePlaced, datePickedup, totalPrice FROM Orders WHERE orderID = :orderID_selected_from_browse_order_page

-- get all Cupcakes to populate a dropdown for associating with an Order
SELECT cupcakeID AS cid, cakeFlavor, cakeColor, frostingFlavor, frostingColor FROM Cupcakes

-- get all Orders with their current associated Cupcakes to list
SELECT orderID, cid, CONCAT(cakeFlavor,' ',cakeColor,' ',frostingFlavor,' ',frostingColor) AS cupcake, quantity
FROM Orders
INNER JOIN CupcakesOrdered ON Orders.orderID = CupcakesOrdered.orderID
INNER JOIN Cupcakes on Cupcakes.cupcakeID = CupcakesOrdered.cupcakeID
ORDER BY orderID, cupcake

-- add a new Customer
INSERT INTO Customers (firstName, lastName, email, phoneNum) VALUES (:firstNameInput, :lastNameInput, :emailInput, :phoneNumInput)

-- add a new Worker
INSERT INTO Workers (firstName, lastName, email, phoneNum) VALUES (:firstNameInput, :lastNameInput, :emailInput, :phoneNumInput)

-- add a new Order
INSERT INTO Orders (customerID, workerID, datePlaced, datePickedup, totalPrice) VALUES (:customerIDInput, :workerIDInput, :datePlacedInput, :datePickedupInput, :totalPriceInput)

-- associate an Order with a Cupcake (M-to-M relationship addition)
INSERT INTO CupcakesOrdered (orderID, cupcakeID, quantity) VALUES (:orderIDInput, :cupcakeIDInput, :quantityInput)

-- update an Order's data based on submission of the Update Order form
UPDATE Orders SET customerID = :customerIDInput, workerID = :workerIDInput, datePlaced = :datePlacedInput, datePickedup = :datePickedupInput, totalPrice = :totalPriceInput WHERE orderID = :orderID_from_the_update_form

-- delete an Order
DELETE FROM Orders WHERE orderID = :orderID_selected_from_browse_order_page
