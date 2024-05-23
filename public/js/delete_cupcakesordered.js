/* Citation for the following
   Date: 5/21/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
*/

function deleteCupcakesOrdered(id) {
	let data = {
		cupcakesOrderedID: id
	}

	// setup AJAX request
	var xhttp = new XMLHttpRequest()
	xhttp.open("DELETE", "/delete-cupcakesordered-ajax", true)
	xhttp.setRequestHeader("Content-type", "application/json")

	// tell AJAX request how to resolve
	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4 && xhttp.status == 204) {
			// delete row from table
			deleteRow(id)
		}
		else if (xhttp.readyState == 4 && xhttp.status != 204) {
			console.log("There was an error with the delete")
		}
	}

	// send request and wait for response
	xhttp.send(JSON.stringify(data))
}

function deleteRow(id) {
	let table = document.getElementById("cupcakesordered-table")

	// find row and delete
	for (let i = 0, row; row = table.rows[i]; i++) {
		if (table.rows[i].getAttribute("data-value") == id) {
			table.deleteRow(i)
			break
		}
	}
}