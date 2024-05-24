/* Citation for the following:
   Date: 5/21/2024
   Adapted from:
   https://github.com/osu-cs340-ecampus/nodejs-starter-app/tree/main/Step%205%20-%20Adding%20New%20Data
*/

let addCupcakeForm = document.getElementById('add-cupcake-form-ajax')

addCupcakeForm.addEventListener("submit", function (e) {
   e.preventDefault()

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

   let data = {
      cakeFlavor: cakeFlavorVal,
      cakeColor: cakeColorVal,
      frostingFlavor: frostingFlavorVal,
      frostingColor: frostingColorVal,
      price: priceVal
   }

   var xhttp = new XMLHttpRequest()
   xhttp.open("POST", "/add-cupcake-ajax", true)
   xhttp.setRequestHeader("Content-type", "application/json")

   xhttp.onreadystatechange = () => {
      if (xhttp.readyState == 4 && xhttp.status == 200) {
         // add new data to table
         addRowToTable(xhttp.response)

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
   let currentTable = document.getElementById("cupcakes-table")
   let newRowIndex = currentTable.rows.length

   let parsedData = JSON.parse(data)
   let newRow = parsedData[parsedData.length - 1]

   let row = document.createElement("tr")
   // let editCell = document.createElement("td")
   let delCell = document.createElement("td")
   let cupcakeIDCell = document.createElement("td")
   let cakeFlavorCell = document.createElement("td")
   let cakeColorCell = document.createElement("td")
   let frostingFlavorCell = document.createElement("td")
   let frostingColorCell = document.createElement("td")
   let priceCell = document.createElement("td")

   // editCell.innerHTML = "Edit"

   delCellButton = document.createElement("button")
   delCellButton.id = "delete-button"
   delCellButton.innerHTML = "Delete"
   // delCellButton.onclick = function() {
   //    deleteCupcakesOrdered(newRow.cupcakeID)
   // }
   delCell.appendChild(delCellButton)

   cupcakeIDCell.innerText = newRow.cupcakeID
   cakeFlavorCell.innerText = newRow.cakeFlavor
   cakeColorCell.innerText = newRow.cakeColor
   frostingFlavorCell.innerText = newRow.frostingFlavor
   frostingColorCell.innerText = newRow.frostingColor
   priceCell.innerText = newRow.price

   cupcakeIDCell.style.textAlign = 'center'
   priceCell.style.textAlign = 'right'

   // row.appendChild(editCell)
   row.appendChild(delCell)
   row.appendChild(cupcakeIDCell)
   row.appendChild(cakeFlavorCell)
   row.appendChild(cakeColorCell)
   row.appendChild(frostingFlavorCell)
   row.appendChild(frostingColorCell)
   row.appendChild(priceCell)

   currentTable.appendChild(row)
}