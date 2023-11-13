import * as c from "./combine.mjs"

function createTable(selector, data, numCols, keepOptions) {
    const selectedTable = document.querySelector(selector)
    if (!sanityCheck(selectedTable, data, numCols)) return
    
    /* note that keepOptions makes hasOptions in CellStruct repetitive.
    Originally each table would have their own set of data vectors.
    Each of the vectors were independent each of other, hence why we're
    checking if the length of namesVector and imagesVector are equivalent.
    With the switch to the sub-vectors system (more details about it in 
    tables.mjs's comments), there is now one central repository of data
    instead of multiple.
    
    Table.mjs's logic was built on the idea that each data set may or may not
    include an optionsVector. But with the new system, the one and only data set
    will always have an optionsVector. To get around this, keepOptions allows you
    to set optionsVector to null if you don't want to display options, which works 
    with table.mjs's logic of how to deal non-existent optionsVectors. */
    if (!keepOptions) data.optionsVector = null
 
    populateTable(selectedTable, data, numCols)
}

/* checks if table inputs are valid before returning, probably no longer strictly
necessary after the changes in items.mjs and generateVectors*/
function sanityCheck(selectedTable, data, numCols) {
    // deconstruction, we can extract values from data class
    const { namesVector, imagesVector } = data
    return selectedTable && namesVector !== null && imagesVector !== null
        && numCols > 0 && namesVector.length === imagesVector.length
}

function populateTable(selectedTable, data, numCols) {
    let numRows = Math.ceil(data.namesVector.length / numCols)

    for (let i = 0; i < numRows; i++) {
        const row = selectedTable.insertRow()
        for (let j = 0; j < numCols; j++) {
            const cell = row.insertCell()
            // i * numCols gives the starting position of the row, + j to get index of column
            const index = (i * numCols) + j
            let cellData = returnCellData(index, data)
            if (!cellData) return
            // note that cellStruct's constructor calls the createCell() method
            let cellStruct = new CellStruct(cell, cellData)
        }
    }
}

function returnCellData(index, data) {
    if (index >= data.namesVector.length) return undefined
    const { namesVector, imagesVector, optionsVector, pricesVector } = data
    const name = namesVector[index]
    const image = imagesVector[index]
    const price = pricesVector[index]
    const options = optionsVector ? optionsVector : undefined
    return { name, image, options, price }
}

class CellStruct {
    constructor(cell, cellData) {
        this.cell = cell
        this.data = cellData
        this.hasOptions = this.data.options && this.data.options.length > 0
        this.createCell()
    }
    
    createCell() {
        this.cell.classList.add('table-cell')
        
        const imageDiv = document.createElement('div')
        const nameDiv = document.createElement('div')
        const optionDiv = document.createElement('div')
        
        imageDiv.classList.add('image-sub-cell')
        nameDiv.classList.add('name-sub-cell')
        optionDiv.classList.add('options-sub-cell')

        const img = document.createElement('img')
        img.src = this.data.image
        img.alt = this.data.image.split("/").pop().split(".")[0]
        imageDiv.append(img)

        // note that our name has format 'ITEMNAME -- $PRICE'
        const name = document.createTextNode(this.data.name + " -- $" + this.data.price)
        nameDiv.append(name)

        this.cell.append(imageDiv)
        this.cell.append(nameDiv)

        if (!this.hasOptions) return
        this.data.options.forEach((optionVectorItem) => {
            const optionBtn = document.createElement('button')
            const optionTxt = document.createTextNode(optionVectorItem)
            optionBtn.append(optionTxt)
            // optionVectorItem is a vector of strings, so we use that for class name
            optionBtn.classList.add('option:' + optionVectorItem.toLowerCase())
            optionBtn.addEventListener('click', (event) => c.optionsEvent(event))
            optionDiv.append(optionBtn)
        })
        this.cell.append(optionDiv)
    }
}

export default createTable