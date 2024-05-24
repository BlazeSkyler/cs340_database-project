/* Citation for the following:
   Date: 5/24/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

let addOrderForm = document.getElementById('add-order-form-ajax')

addOrderForm.addEventListener("submit", function (e) {
   e.preventDefault()

   let inputCustomerID = document.getElementById("add-customerID")
   let inputWorkerID = document.getElementById("add-workerID")
   let inputDatePlaced = document.getElementById("add-datePlaced")
   let inputDatePickedup = document.getElementById("add-datePickedup")
   let inputTotalPrice = document.getElementById("add-totalPrice")

   let customerIDVal = inputCustomerID.value
   let workerIDVal = inputWorkerID.value
   let datePlacedVal = inputDatePlaced.value
   let datePickedupVal = inputDatePickedup.value
   let totalPriceVal = inputTotalPrice.value

   let data = {
      customerID: customerIDVal,
      workerID: workerIDVal,
      datePlaced: datePlacedVal,
      datePickedup: datePickedupVal,
      totalPrice: totalPriceVal
   }

   var xhttp = new XMLHttpRequest()
   xhttp.open("POST", "/add-order-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
         addRowToTable(xhttp.response)

         inputCustomerID.value = ''
         inputWorkerID.value = ''
         inputDatePlaced.value = ''
         inputDatePickedup.value = ''
         inputTotalPrice.value = ''
      }
      else if (xhttp.readyState == 4 && xhttp.status != 200) {
         console.log("There was an error with the input")
      }
   }
   xhttp.send(JSON.stringify(data))
})

addRowToTable = (data) => {
   let currentTable = document.getElementById("orders-table")
   let newRowIndex = currentTable.rows.length

   let parsedData = JSON.parse(data)
   let newRow = parsedData[parsedData.length - 1]

   let row = document.createElement("tr")
   // let editCell = document.createElement("td")
   let delCell = document.createElement("td")
   let orderIDCell = document.createElement("td")
   let customerIDCell = document.createElement("td")
   let workerIDCell = document.createElement("td")
   let datePlacedCell = document.createElement("td")
   let datePickedupCell = document.createElement("td")
   let totalPriceCell = document.createElement("td")

   delCellButton = document.createElement("button")
   delCellButton.id = "delete-button"
   delCellButton.innerHTML = "Delete"
   // delCellButton.onclick = function() {
   //    deleteWorker(newRow.workerID)
   // }
   delCell.appendChild(delCellButton)

   orderIDCell.innerText = newRow.orderID
   customerIDCell.innerText = newRow.customerID
   workerIDCell.innerText = newRow.workerID
   datePlacedCell.innerText = newRow.datePlaced
   datePickedupCell.innerText = newRow.datePickedup
   totalPriceCell.innerText = newRow.totalPrice

   orderIDCell.style.textAlign = "center"
   customerIDCell.style.textAlign = "center"
   workerIDCell.style.textAlign = "center"
   datePlacedCell.style.textAlign = "center"
   datePickedupCell.style.textAlign = "center"
   totalPriceCell.style.textAlign = "right"

   // row.appendChild(editCell)
   row.appendChild(delCell)
   row.appendChild(orderIDCell)
   row.appendChild(customerIDCell)
   row.appendChild(workerIDCell)
   row.appendChild(datePlacedCell)
   row.appendChild(datePickedupCell)
   row.appendChild(totalPriceCell)

   currentTable.appendChild(row)
}
