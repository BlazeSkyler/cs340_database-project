/* Citation for the following:
   Date: 5/24/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

let addWorkerForm = document.getElementById('add-worker-form-ajax')

addWorkerForm.addEventListener("submit", function (e) {
   // prevent from submitting
   e.preventDefault()

   // get elements and values
   let inputFirstName = document.getElementById("add-firstName")
   let inputLastName = document.getElementById("add-lastName")
   let inputEmail = document.getElementById("add-email")
   let inputPhoneNum = document.getElementById("add-phoneNum")

   let firstNameVal = inputFirstName.value
   let lastNameVal = inputLastName.value
   let emailVal = inputEmail.value
   let phoneNumVal = inputPhoneNum.value

   // set values to data
   let data = {
      firstName: firstNameVal,
      lastName: lastNameVal,
      email: emailVal,
      phoneNum: phoneNumVal
   }

   // setup AJAX request
   var xhttp = new XMLHttpRequest()
   xhttp.open("POST", "/add-worker-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
         addRowToTable(xhttp.response)

         // clear input fields
         inputFirstName.value = ''
         inputLastName.value = ''
         inputEmail.value = ''
         inputPhoneNum.value = ''
      }
      else if (xhttp.readyState == 4 && xhttp.status != 200) {
         console.log("There was an error with the input")
      }
   }
   // send request and wait for response
   xhttp.send(JSON.stringify(data))
})

addRowToTable = (data) => {
   // get location of new row
   let currentTable = document.getElementById("workers-table")
   let newRowIndex = currentTable.rows.length

   // get reference to object
   let parsedData = JSON.parse(data)
   let newRow = parsedData[parsedData.length - 1]

   // create row with cells
   let row = document.createElement("tr")
   // let editCell = document.createElement("td")
   let delCell = document.createElement("td")
   let workerIDCell = document.createElement("td")
   let firstNameCell = document.createElement("td")
   let lastNameCell = document.createElement("td")
   let emailCell = document.createElement("td")
   let phoneNumCell = document.createElement("td")

   // create delete button
   delCellButton = document.createElement("button")
   delCellButton.id = "delete-button"
   delCellButton.innerHTML = "Delete"
   // delCellButton.onclick = function() {
   //    deleteWorker(newRow.workerID)
   // }
   delCell.appendChild(delCellButton)

   // fill cells
   workerIDCell.innerText = newRow.workerID
   firstNameCell.innerText = newRow.firstName
   lastNameCell.innerText = newRow.lastName
   emailCell.innerText = newRow.email
   phoneNumCell.innerText = newRow.phoneNum

   // styles
   workerIDCell.style.textAlign = "center"
   phoneNumCell.style.textAlign = "center"

   // add cells to row
   // row.appendChild(editCell)
   row.appendChild(delCell)
   row.appendChild(workerIDCell)
   row.appendChild(firstNameCell)
   row.appendChild(lastNameCell)
   row.appendChild(emailCell)
   row.appendChild(phoneNumCell)

   // add row to table
   currentTable.appendChild(row)
}
