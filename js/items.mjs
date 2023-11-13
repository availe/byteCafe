class Items {
    // generateVectors is how we extract the data, static items is the data
    
    /* Before each of the vectors (such as namesVector, imagesVector, optionsVector)
    were separate from each other. To improve ease of maintenance and readability
    now each item is an index in the itemsVector, and each index houses sub-vectors.
    
    As tables.mjs works with separate vectors, the idea was to use generateVectors
    in order to translate our sub-vectors into separate vectors again. Although this 
    isn't an ideal solution in the long term.*/
    static generateVectors(indices) {
        const namesVector = []
        const imagesVector = []
        const pricesVector = []
        const isDrinkVector = []
        const optionsVector = ["Clear", "-", "+", "0"]

        // we return multiple vectors per item, at a given index all 35 vectors sync up
        // so namesVector[0], pricesVector[0], and imagesVector[0] all belong to the same item
        const addInfo = (item) => {
            namesVector.push(item.name)
            imagesVector.push(item.image)
            pricesVector.push(item.price)
            isDrinkVector.push(item.isDrink)
        }

        // return vectors of all items
        if (indices === "all") {
            this.items.forEach(addInfo)
        }
        // return vectors of all drinks items
        else if (indices === "drinks") {
            this.items.forEach(item => {
                if (item.isDrink) addInfo(item)
            })
        }
        // return vectors of all foods items
        else if (indices === "foods") {
            this.items.forEach(item => {
                if (!item.isDrink) addInfo(item)
            })
        }
        // return vectors of specified indices items
        // plug in as Items.generateVectors([0, 1, 2])
        else {
            indices.forEach(i => {
                if (!this.items[i]) return
                addInfo(this.items[i])
            })
        }
        return { namesVector, imagesVector, pricesVector, isDrinkVector, optionsVector }
    }

    // start of data
    static items = [
        { // index 0
            image: "../images/an americano coffee with a spoon of coffee beans on the table.webp",
            name: "Classic Americano",
            price: 5.99,
            isDrink: true

        },
        { // index 1
            image: "../images/a delicious slice of chocolate cheesecake.jpg",
            name: "Choco Cheesecake Slice",
            price: 7.99,
            isDrink: false
        },
        { // index 2
            image: "../images/almond bubble tea on a white table.jpg",
            name: "Bubble Tea",
            price: 8.99,
            isDrink: true
        },
        { // index 3
            image: "../images/two cups of iced coffee.jpg",
            name: "Iced Coffee",
            price: 7.99,
            isDrink: true
        },
        { // index 4
            image: "../images/a delicious blueberry muffin.jpeg",
            name: "Blueberry Muffin",
            price: 7.99,
            isDrink: false
        },
        { // index 5
            image: "../images/freshly-made vanilla ice cream with strawberries.webp",
            name: "Vanilla Delight",
            price: 6.99,
            isDrink: false
        }
    ]
}

export { Items }
