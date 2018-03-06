var fs = require("fs");
var allProductsPlain = fs.readFileSync("db.json", "utf8");
var products = JSON.parse(allProductsPlain);
var ignoreCase = require("ignore-case");

module.exports = {
  get: function(params) {
    let returnProducts = products.slice(
      params.offset,
      params.offset + params.limit
    );
    return returnProducts;
  },
  add: function(params) {
    params.id = Number(products[products.length - 1].id) + 1;
    products.push(params);
    fs.writeFileSync("./db.json", JSON.stringify(products));
    return products;
  },
  update: function(params) {
    let productPresentIndex = products.findIndex(pro => pro.id == params.id);
    if (productPresentIndex > -1) {
      products[productPresentIndex] = params;
      fs.writeFileSync("./db.json", JSON.stringify(products));
      return products;
    }
  },
  remove: function(params) {
    let productPresentIndex = products.findIndex(pro => pro.id == params.id);
    if (productPresentIndex > -1) {
      products.splice(productPresentIndex, 1);
      fs.writeFileSync("./db.json", JSON.stringify(products));
      return products;
    }
  },

  searchByNameOrId: function(params) {
    if (params.id) {
      let productPresentSearchByIdIndex = products.findIndex(
        pro => pro.id == params.id
      );
      if (productPresentSearchByIdIndex > -1) {
        return products[productPresentSearchByIdIndex];
      }
    } else if (params.productName) {
      let productPresentSearchByNameIndex = products.findIndex(
        pro => pro.productName == params.productName
      );
      if (productPresentSearchByNameIndex > -1) {
        return products[productPresentSearchByNameIndex];
      }
    }
  },
  searchByName: function(params) {
    var returnProducts = products.filter(pro =>
      ignoreCase.includes(pro.productName, params.productName)
    );
    return returnProducts.slice(params.offset, params.offset + params.limit);
  },

  searchGlobally: function(params) {
    var returnProducts = [];
    var searchString = params[Object.keys(params)[0]];
    var regexp = new RegExp(searchString, "g");
    for (var i = 0; i < products.length; i++) {
      for (const key of Object.keys(products[i])) {
        if (String(products[i][key]).match(regexp)) {
          console.log(products[i]["id"]);
          let searchIndex = returnProducts.findIndex(
            id => id.id == products[i]["id"]
          );
          if (searchIndex === -1) {
            returnProducts.push(products[i]);
          }
        }
      }
    }
    return returnProducts;
  },

  groupByCategory: params => {
    let returnProducts = new Object();
    for (var i = 0; i < products.length; i++) {
      var lc = products[i]["category"];
      if (returnProducts[lc]) {
        returnProducts[lc].push(products[i]);
      } else {
        returnProducts[lc] = new Array(products[i]);
      }
    }
    return returnProducts;
  }
};
