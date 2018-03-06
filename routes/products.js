const express = require("express");
const router = express.Router();

var ignoreCase = require("ignore-case");
const validator = require("express-joi-validation")({});
const Joi = require("joi");
var listOfAllProducts = require("../models/product");

// validation for list
const productsValidationSchemaList = Joi.object({
  limit: Joi.number().required(),
  offset: Joi.number().required()
});

// validation for add
const productsValidationSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.number().required(),
  inTheBox: Joi.string().required(),
  modelNumber: Joi.string().required(),
  size: Joi.string().required(),
  category: Joi.string().required(),
  color: Joi.string().required(),
  touchScreen: Joi.string().required(),
  image: Joi.string().required()
});
// validation for edit,delete
const productsValidationSchemaEditOrDelete = Joi.object({
  id: Joi.number().required()
});

// validation for search using Id/ProductName
const productsValidationSchemaIdOrName = Joi.object()
  .keys({
    id: Joi.number(),
    productName: Joi.string()
  })
  .or("id", "productName");

// validation for search using name
const productsValidationSchemaUsingName = Joi.object({
  limit: Joi.number().required(),
  offset: Joi.number().required(),
  productName: Joi.string().required()
});

// Validation for globalSearch
const productsValidationSchemaGlobalSearch = Joi.object().min(1);
// Validation for categorySearch
const productsValidationSchemaUsingCategory = Joi.object({
  category: Joi.string().required()
});

// 1. List products (should support pagination)
router.post("/product", function(req, res, next) {
  let checkShema = Joi.validate(req.body, productsValidationSchemaList, {
    abortEarly: false
  });

  if (checkShema.error) {
    console.log(checkShema.error.details);
    res.status(400).send(checkShema.error.details);
  } else {
    let products = listOfAllProducts.get(req.body);
    if (products.length != 0) {
      res.send(products);
    } else {
      res.status(400);
      res.send("Products not found");
    }
  }
});

//2. Add product
router.post("/product/add", function(req, res, next) {
  let checkShema = Joi.validate(req.body, productsValidationSchema, {
    abortEarly: false
  });
  if (checkShema.error) {
    console.log(checkShema.error.details);
    res.status(400).send(checkShema.error.details);
  } else {
    var products = listOfAllProducts.add(req.body);
    res.json(products);
  }
});

//3. Update product
router.put("/product/update", function(req, res, next) {
  let checkShema = Joi.validate(req.body, productsValidationSchema, {
    allowUnknown: true
  });
  if (checkShema.error) {
    res.status(400).send(checkShema.error.details);
  } else {
    var updatedProduct = listOfAllProducts.update(req.body);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(400).send("Product not found");
    }
  }
});

//4. Delete product
router.delete("/product/delete", function(req, res, next) {
  let checkShema = Joi.validate(req.body, productsValidationSchemaEditOrDelete);
  if (checkShema.error) {
    res.status(400).send(checkShema.error.details);
  } else {
    var finalProducts = listOfAllProducts.remove(req.body);
    if (finalProducts) {
      res.send(finalProducts);
    } else {
      res
        .status(400)
        .res.send("Product your are trying to delete is not found");
    }
  }
});

// 5. Get product by name / id
router.post("/product/searchByNameOrId", function(req, res, next) {
  let checkShema = Joi.validate(req.body, productsValidationSchemaIdOrName);
  if (checkShema.error) {
    res.status(400).send(checkShema.error);
  } else {
    var finalProducts = listOfAllProducts.searchByNameOrId(req.body);
    if (finalProducts) {
      res.send(finalProducts);
    } else {
      res.status(400);
      res.send("Product Your are searching is not found");
    }
  }
});

// 6. Search product by name (should support pagination)
router.post("/product/searchByName", function(req, res, next) {
  let checkShema = Joi.validate(req.body, productsValidationSchemaUsingName);
  if (checkShema.erro) {
    res.status(400).send(checkShema.error);
  } else {
    var finalProducts = listOfAllProducts.searchByName(req.body);
    if (finalProducts.length != 0) {
      res.send(finalProducts);
    } else {
      res.status(400);
      res.send("Product Your are searching is not found");
    }
  }
});

//8. global search ( using this endpoint user can search
router.post("/product/searchGlobally", function(req, res, next) {
  let checkShema = Joi.validate(req.body, productsValidationSchemaGlobalSearch);

  if (checkShema.errors) {
    res.status(400).send(checkShema.error);
  } else {
    var finalProducts = listOfAllProducts.searchGlobally(req.body);
    if (finalProducts.length != 0) {
      res.send(finalProducts);
    } else {
      res.status(400);
      res.send("Product Your are searching is not found");
    }
  }
});

//7. Get products grouped by category ( sample output )
router.post("/product/groupByCategory", function(req, res, next) {
  let checkShema = Joi.validate(
    req.body,
    productsValidationSchemaUsingCategory
  );
  if (checkShema.errors) {
    res.status(400).send(checkShema.error);
  } else {
    var finalProducts = listOfAllProducts.groupByCategory(req.body);

    if (finalProducts.length != 0) {
      res.send(finalProducts);
    } else {
      res.status(400);
      res.send("Product Your are searching is not found");
    }
  }
});

module.exports = router;
