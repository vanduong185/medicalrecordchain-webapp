const express = require("express");
const bodyparser = require("body-parser");
var network = require("./network");
//network.connect("admin@medicalrecord-v2");

var app = express();
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(express.static(__dirname + "/view"));

app.get("/", function(req, res) {
  res.sendfile(__dirname + "/view/index.html")
})

app.listen(8000, function() {
  console.log("App listening on port 8000");
})
