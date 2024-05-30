/* Citation for the following
   Date: 5/22/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
*/

let updateCupcakesOrderedForm = document.getElementById('update-cupcakesordered-form-ajax')

updateCupcakesOrderedForm.addEventListener("submit", function (e) {
	// prevent from submitting
	e.preventDefault()

	// get form fields\
	let chosenID = document.getElementById("update-cupcakesOrderedID")
	let inputQuantity = document.getElementById("update-quantity")

	let chosenIDValue = chosenID.value
	let quantityValue = inputQuantity.value

	if (isNaN(quantityValue) || quantityValue < 1) {
		return
	}

	let data = {
		cupcakesOrderedID: chosenIDValue,
		quantity: quantityValue
	}

	// setup AJAX request
	var xhttp = new XMLHttpRequest()
	xhttp.open("PUT", "/put-cupcakesordered-ajax", true)
	xhttp.setRequestHeader("Content-type", "application/json")

	// tell AJAX request how to resolve
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// update row in table
			updateRow(xhttp.response, chosenIDValue)
			location.reload()		// reload page *needed
		}
		else if (xhttp.readyState == 4 && xhttp.status != 200) {
			console.log("There was an error with the input")
		}
	}
	// send request and wait for response
	xhttp.send(JSON.stringify(data))
})


function updateRow(data, cupcakesOrderedID) {
	let parsedData = JSON.parse(data)

	let table = document.getElementById("cupcakesordered-table")

	for (let i = 0, row; row = table.rows[i]; i++) {
		// match ID
		if (table.rows[i].getAttribute("data-value") == cupcakesOrderedID){
			// get location of quantity col in row to update
			let updateRowIndex = table.getElementsByTagName("tr")[i]
			let td = updateRowIndex.getElementsByTagName("td")[4]
			td.innerHTML = parsedData[0].quantity
		}
	}
}