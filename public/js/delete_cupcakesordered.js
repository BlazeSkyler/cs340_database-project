/* Citation for the following
   Date: 5/21/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
*/

function deleteCupcakesOrdered(cupcakesOrderedID) {
	let data = {
		id: cupcakesOrderedID
	}

	// setup AJAX request
	var xhttp = new XMLHttpRequest()
	xhttp.open("DELETE", "/delete-cupcakesordered-ajax", true)
	xhttp.setRequestHeader("Content-type", "application/json")

	xhttp.onreadystatechange = () => {
		if (xhttp.readyState == 4 && xhttp.status == 204) {
			// delete row from table
			deleteRow(cupcakesOrderedID)
			location.reload()			// reload page *needed
		}
		else if (xhttp.readyState == 4 && xhttp.status != 204) {
			console.log("There was an error with the input")
		}
	}
	// send request and wait for response
	xhttp.send(JSON.stringify(data))
}

function deleteRow(cupcakesOrderedID) {
	let table = document.getElementById("cupcakesordered-table")

	// find row and delete
	for (let i = 0, row; row = table.rows[i]; i++) {
		if (table.rows[i].getAttribute("data-value") == cupcakesOrderedID) {
			table.deleteRow(i)
			deleteDropDownMenu(cupcakesOrderedID)
			break
		}
	}
}

function deleteDropDownMenu(cupcakesOrderedID) {
   let selectMenu = document.getElementById("update-cupcakesOrderedID")
   for (let i = 0; i < selectMenu.length; i++) {
      if (Number(selectMenu.options[i].value) === Number(cupcakesOrderedID)) {
         selectMenu[i].remove()
         break
      }
   }
}