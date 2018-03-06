// core module
const express = require("express");
const path = require("path");
const app = express();

// bodyParser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//routing
app.use("/", require("./routes/products"));

//listen cofiguration
app.listen(4000, function() {});
