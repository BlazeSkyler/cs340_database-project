/* Citation for the following:
   Date: 5/21/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

let addCupcakeForm = document.getElementById('add-cupcake-form-ajax')

addCupcakeForm.addEventListener("submit", function (e) {
   // prevent from submitting
   e.preventDefault()

   // get input values
   let inputCakeFlavor = document.getElementById("add-cakeFlavor")
   let inputCakeColor = document.getElementById("add-cakeColor")
   let inputFrostingFlavor = document.getElementById("add-frostingFlavor")
   let inputFrostingColor = document.getElementById("add-frostingColor")
   let inputPrice = document.getElementById("add-price")

   let cakeFlavorVal = inputCakeFlavor.value
   let cakeColorVal = inputCakeColor.value
   let frostingFlavorVal = inputFrostingFlavor.value
   let frostingColorVal = inputFrostingColor.value
   let priceVal = inputPrice.value

   // set values in data
   let data = {
      cakeFlavor: cakeFlavorVal,
      cakeColor: cakeColorVal,
      frostingFlavor: frostingFlavorVal,
      frostingColor: frostingColorVal,
      price: priceVal
   }

   // setup AJAX request
   var xhttp = new XMLHttpRequest()
   xhttp.open("POST", "/add-cupcake-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
         // add new data to table
         addRowToTable(xhttp.response)

         // clear inputs
         inputCakeFlavor.value = ''
         inputCakeColor.value = ''
         inputFrostingFlavor.value = ''
         inputFrostingColor.value = ''
         inputPrice.value = ''
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
   let currentTable = document.getElementById("cupcakes-table")
   let newRowIndex = currentTable.rows.length

   // get reference of object
   let parsedData = JSON.parse(data)
   let newRow = parsedData[parsedData.length - 1]

   // create rows and cells
   let row = document.createElement("tr")
   // let editCell = document.createElement("td")
   let delCell = document.createElement("td")
   let cupcakeIDCell = document.createElement("td")
   let cakeFlavorCell = document.createElement("td")
   let frostingFlavorCell = document.createElement("td")
   let cakeColorCell = document.createElement("td")
   let frostingColorCell = document.createElement("td")
   let priceCell = document.createElement("td")

   // editCell.innerHTML = "Edit"

   // create delete button
   delCellButton = document.createElement("button")
   delCellButton.id = "delete-button"
   delCellButton.innerHTML = "Delete"
   delCellButton.onclick = function() {
      deleteCupcake(newRow.cupcakeID)
   }
   delCell.appendChild(delCellButton)

   // fill cells
   cupcakeIDCell.innerText = newRow.cupcakeID
   cakeFlavorCell.innerText = newRow.cakeFlavor
   frostingFlavorCell.innerText = newRow.frostingFlavor
   cakeColorCell.innerText = newRow.cakeColor
   frostingColorCell.innerText = newRow.frostingColor
   priceCell.innerText = newRow.price

   // styles
   cupcakeIDCell.style.textAlign = 'center'
   priceCell.style.textAlign = 'right'

   // add cells to row
   // row.appendChild(editCell)
   row.appendChild(delCell)
   row.appendChild(cupcakeIDCell)
   row.appendChild(cakeFlavorCell)
   row.appendChild(frostingFlavorCell)
   row.appendChild(cakeColorCell)
   row.appendChild(frostingColorCell)
   row.appendChild(priceCell)

   // add row to table
   currentTable.appendChild(row)
}