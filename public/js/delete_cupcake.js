/* Citation for the following
   Date: 5/30/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
*/

function deleteCupcake(cupcakeID) {
   let data = {
      id: cupcakeID
   }

   // set up AJAX request
   var xhttp = new XMLHttpRequest()
   xhttp.open("DELETE", "/delete-cupcake-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   // tell AJAX request how to resolve
   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
         deleteRow(cupcakeID)
         location.reload()
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
         console.log("There was an error wtih the input")
      }
   }
   // send request and wait for response
   xhttp.send(JSON.stringify(data))
}

function deleteRow(cupcakeID) {
   let table = document.getElementById("cupcakes-table")

   // find row and delete
   for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].getAttribute("data-value") == cupcakeID) {
         table.deleteRow(i)
         break
      }
   }
}