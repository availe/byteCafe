import * as c from "./combine.mjs"

function optionsEvent(event) {
    const btnClass = event.target.classList
    const item = returnItem(event)
    c.initializeItem(item, event)
    // note that option: is the prefix, check after the :
    // so option:+ means we're modifying the + button
    if (btnClass.contains('option:clear')) {
        c.clearItemInMap(item)
    }
    else if (btnClass.contains('option:+')) {
       c.changeItemInMap(item, true)
    }
    else if (btnClass.contains('option:-')) {
        c.changeItemInMap(item, false)
    }
    c.updateItemIndex(item, event)
}

// returns the name concatenated with the price of the item
// this is due to how const name was set up in createCell() in table.mjs
function returnItem(event) {
    const optionDiv = event.target.parentElement
    const cell = optionDiv.parentElement
    const nameDiv = cell.querySelector('.name-sub-cell')
    return nameDiv.textContent
}

export { optionsEvent, returnItem }