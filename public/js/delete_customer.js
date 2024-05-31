/* Citation for the following
   Date: 5/30/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
*/

function deleteCustomer(customerID) {
   let data = {
      id: customerID
   }

   // set up AJAX request
   var xhttp = new XMLHttpRequest()
   xhttp.open("DELETE", "/delete-customer-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   // tell AJAX request how to resolve
   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
         deleteRow(customerID)
         location.reload()
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
         console.log("Ther was an error with the input")
      }
   }
   // send request and wait for response
   xhttp.send(JSON.stringify(data))
}

function deleteRow(customerID) {
   let table = document.getElementById("customers-table")

   // find row and delete
   for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].getAttribute("data-value") == customerID) {
         table.deleteRow(i)
         break
      }
   }
}