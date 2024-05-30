/* Citation for the following
   Date: 5/29/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%208%20-%20Dynamically%20Updating%20Data
*/

let updateOrderForm = document.getElementById('update-order-form-ajax')

updateOrderForm.addEventListener("submit", function (e) {
   // prevent from submitting
   e.preventDefault()

   // get form fields
   let orderIDinput = document.getElementById("update-orderID")
   let workerIDinput = document.getElementById("update-workerID")
   let datePickedupinput = document.getElementById("update-datePickedup")

   let orderIDValue = orderIDinput.value
   let workerIDValue = workerIDinput.value
   let datePickedupValue = datePickedupinput.value

   let data = {
      orderID: orderIDValue,
      workerID: workerIDValue,
      datePickedup: datePickedupValue
   }

   // setup AJAX request
   var xhttp = new XMLHttpRequest()
   xhttp.open("PUT", "/put-order-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   // tell AJAX request how to resolve
   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
         // update row in table
         updateRow(xhttp.response, orderIDValue)
         location.reload()    // reload page *needed
      }
      else if (xhttp.readyState == 4 && xhttp.status != 200) {
         console.log("There was an error with the input")
      }
   }
   // send request and wait for response
   xhttp.send(JSON.stringify(data))
})

function updateRow(data, orderID) {
   let parsedData = JSON.parse(data)

   let table = document.getElementById("orders-table")

   // find row to update
   for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].getAttribute("data-value") == orderID) {
         let updateRowIndex = table.getElementsByTagName("tr")[i]
         let workertd = updateRowIndex.getElementsByTagName("td")[3]
         let datetd = updateRowIndex.getElementsByTagName("td")[5]

         workertd.innerHTML = parsedData[0].workerID
         datetd.innerHTML = parsedData[0].datePickedup
      }
   }
}
