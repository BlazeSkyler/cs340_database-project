/* Citation for the following:
   Date: 5/21/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

let addCupcakesOrderedForm = document.getElementById('add-cupcakesordered-form-ajax')

addCupcakesOrderedForm.addEventListener("submit", function (e) {

	// prevent form from submitting
	e.preventDefault();

	let inputOrderID = document.getElementById("add-orderID")
	let inputCupcakeID = document.getElementById("add-cupcakeID")
	let inputQuantity = document.getElementById("add-quantity")

	let orderIDVal = inputOrderID.value
	let cupcakeIDVal = inputCupcakeID.value
	let quantityVal = inputQuantity.value

	let data = {
		orderID: orderIDVal,
		cupcakeID: cupcakeIDVal,
		quantity: quantityVal
	}

	// setup AJAX request
	var xhttp = new XMLHttpRequest()
	xhttp.open("POST", "/add-cupcakesordered-ajax", true)
	xhttp.setRequestHeader("Content-type", "application/json")

	// tell AJAX request how to resolve
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// add new data to table
			addRowToTable(xhttp.response)

			// clear input fields
			inputOrderID.value = ''
			inputCupcakeID.value = ''
			inputQuantity.value = ''
		}
		else if (xhttp.readyState == 4 && xhttp.status != 200) {
			console.log("There was an error with the input")
		}
	}
	// send request and wait for response
	xhttp.send(JSON.stringify(data))
})

// creates row from an Object representing a single record
addRowToTable = (data) => {
	// get location
	let currentTable = document.getElementById("cupcakesordered-table")
	let newRowIndex = currentTable.rows.length

	// get reference to object
	let parsedData = JSON.parse(data)
	let newRow = parsedData[parsedData.length - 1]

	// create a row and cells
	let row = document.createElement("tr")
	// let editCell = document.createElement("td")
	let delCell = document.createElement("td")
	let cupcakesOrderedIDCell = document.createElement("td")
	let orderIDCell = document.createElement("td")
	let cupcakeIDCell = document.createElement("td")
	let quantityCell = document.createElement("td")

	// edit and delete cells
	// editCell.innerHTML = "Edit"

	delCellButton = document.createElement("button")
	delCellButton.id = "delete-button"
	delCellButton.innerHTML = "Delete"
	delCellButton.onclick = function() {
		deleteCupcakesOrdered(newRow.cupcakesOrderedID)
	}
	delCell.appendChild(delCellButton)

	// fill cells
	cupcakesOrderedIDCell.innerText = newRow.cupcakesOrderedID
	orderIDCell.innerText = newRow.orderID
	cupcakeIDCell.innerText = newRow.cupcakeID
	quantityCell.innerText = newRow.quantity

	// set styles
	cupcakesOrderedIDCell.style.textAlign = 'center'
	orderIDCell.style.textAlign = 'center'
	cupcakeIDCell.style.textAlign = 'center'
	quantityCell.style.textAlign = 'right'

	// add cells to the row
	// row.appendChild(editCell)
	row.appendChild(delCell)
	row.appendChild(cupcakesOrderedIDCell)
	row.appendChild(orderIDCell)
	row.appendChild(cupcakeIDCell)
	row.appendChild(quantityCell)

	// add row to table
	currentTable.appendChild(row)

	// add to edit drop down list
   let selectMenu = document.getElementById("update-cupcakesOrderedID")
   let option = document.createElement("option")
   option.text = newRow.cupcakesOrderedID
   option.value = newRow.cupcakesOrderedID
   selectMenu.add(option)
}
