/* Citation for the following
   Date: 5/29/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%207%20-%20Dynamically%20Deleting%20Data
*/

function deleteOrder(orderID) {
   let data = {
      id: orderID
   }

   // set up AJAX request
   var xhttp = new XMLHttpRequest()
   xhttp.open("DELETE", "/delete-order-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   // tell AJAX request how to resolve
   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 204) {
         deleteRow(orderID)
         location.reload()
      }
      else if (xhttp.readyState == 4 && xhttp.status != 204) {
         console.log("Ther was an errow tih the input")
      }
   }
   // send request and wait for response
   xhttp.send(JSON.stringify(data))
}

function deleteRow(orderID) {
   let table = document.getElementById("orders-table")

   // find row and delete
   for (let i = 0, row; row = table.rows[i]; i++) {
      if (table.rows[i].getAttribute("data-value") == orderID) {
         table.deleteRow(i)
         deleteDropDownMenu(orderID)
         break
      }
   }
}

function deleteDropDownMenu(orderID) {
   let selectMenu = document.getElementById("update-orderID")
   for (let i = 0; i < selectMenu.length; i++) {
      if (Number(selectMenu.options[i].value) === Number(orderID)) {
         selectMenu[i].remove()
         break
      }
   }
}