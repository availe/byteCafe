import * as c from "./combine.mjs"
let dropEventsExist = false
const itemMap = new Map()

// if item doesn't exist in itemMap create entry with count of 0 and inputted price
function initializeItem(itemName, event) {
    if (itemMap.has(itemName)) return
    // remember that our name has format 'ITEMNAME -- $PRICE'
    const nameDOM = c.returnItem(event)
    const itemPrice = nameDOM.split("$")[1]

    itemMap.set(itemName, new Map([
        ['price', itemPrice],
        ['count', 0]
    ]))
}

// used for + and - operations, to keep track of quantity of item ordered
function changeItemInMap(itemName, isAdding) {
    if (!itemMap.has(itemName)) return
    const itemCount = itemMap.get(itemName).get('count')
    if (isAdding) {
        itemMap.get(itemName).set('count', itemCount + 1)
    }
    else {
        if(itemMap.get(itemName).get('count') <= 0) return
        itemMap.get(itemName).set('count', itemCount - 1)
    }
}

// resets quantity of specified item in itemMap back to 0
function clearItemInMap(itemName) {
   itemMap.get(itemName).set('count', 0)
}

// todo: make updateItemIndex() and updateCart() more modular
/* updateItemIndex() updates '.option:0' which is the button that displays
the quantity per item that we ordered. It also calculates the total price,
which is used to update #dropdown-btn (which is styled to look like a link)
on the nav bar. Finally, it calls updateCart() which focuses on the contents of
cart's dropdown menu.*/
function updateItemIndex(itemName, event) {
    // navigate DOM to the indexBtn class '.options:0'
    const optionDiv = event.target.parentElement
    const indexBtn = optionDiv.querySelector('.option\\:0')

    // updates the count for an individual item
    indexBtn.textContent = itemMap.get(itemName).get('count')
    const cartLink = document.querySelector('#dropdown-btn')
    let totalCost = 0

    // finds the total cost of all ordered items
    itemMap.forEach((item) =>{
        const itemCount = item.get('count')
        const itemPrice = item.get('price')
        const itemTotal = itemCount * itemPrice
        totalCost += itemTotal
    })
    // to avoid repetition we just reuse the result of updateCart
    const actualTotal = updateCart()

    cartLink.textContent = "Cart: $" + actualTotal
}

/* this calculates the values for what goes inside #dropdown-btn. It replaces the
original html text "No items in cart" with a table, price, tax, and discount info,
and an order button when you add an item your cart.

Note this was originally supposed to be a void func, and for the most part it acts
like one. But we return actualTotal just so we can reuse it at the end of
updateItemIndex(). */
function updateCart() {
    const taxPercent = 0.0815
    const discountPercent = 0.25

    // we will overwrite the paragraph in dropdown-menu with a table
    const cartMenu = document.querySelector('#dropdown-menu')
    let tableHTML =
        "<table id='cartItems'>" +
        "<tr><th>Price</th><th>Item</th><th>Quantity</th><th>Total</th></tr>"

    let totalPrice = 0
    itemMap.forEach((itemValue, itemKey) => {
        if (itemValue.get('count') <= 0) return

        // remember that our name has format 'ITEMNAME -- $PRICE'
        const name = itemKey.split(" -")[0]
        const amount = itemValue.get('count')
        const price = itemValue.get('price')
        const totalItemPrice = (price * amount).toFixed(2)
        // toFixed converts to string, so we need to undo it for calculations
        totalPrice += parseFloat(totalItemPrice)

        tableHTML += `<tr>
                        <td>${price}</td>
                        <td>${name}</td>
                        <td>${amount}</td>
                        <td>${totalItemPrice}</td>
                      </tr>`
    })

    totalPrice = totalPrice.toFixed(2)
    const taxOwed = (parseFloat(totalPrice) * taxPercent).toFixed(2)
    const discount = (parseFloat(totalPrice) * discountPercent).toFixed(2)
    const actualTotal = (parseFloat(totalPrice) - parseFloat(discount) + parseFloat(taxOwed)).toFixed(2)

    tableHTML +=
        `</table>
        <div id="pricesDiv">
            <p>Total: $${totalPrice}</p>
            <p>Tax: $${taxOwed}</p>
            <p>Discount: $${discount}</p>
        </div>
        <button id="cart-btn">Order: $${actualTotal}</button>`
    cartMenu.innerHTML = tableHTML

    // if event listener doesn't exist then create one
    if (!dropEventsExist) {
        addCartBtnEventListener()
        dropEventsExist = true
    }

    return actualTotal
}

// creates event listener to make pop-up alert whenever we press order button
function addCartBtnEventListener() {
    const cartBtn = document.getElementById('cart-btn')
    cartBtn.addEventListener('click', ev => {
        alert("You made your order")
    })
}

export { initializeItem, changeItemInMap, clearItemInMap, updateItemIndex }