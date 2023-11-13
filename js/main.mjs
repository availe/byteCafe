import * as c from "./combine.mjs"

let data = c.Items.generateVectors([0, 1, 2])
c.createTable("#featured-products-table", data, 3, false)

data = c.Items.generateVectors("drinks")
c.createTable("#drinksTable", data, 3, true)

data = c.Items.generateVectors("foods")
c.createTable("#foodsTable", data, 3, true)