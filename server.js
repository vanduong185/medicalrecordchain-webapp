const express = require("express");
const bodyparser = require("body-parser");
var network = require("./network");

network.connect("patient1@medicalrecord");

//network.getMedicalRecordDetails();

const NAMESPACE = "org.example.medicalrecord"

var app = express();
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(express.static(__dirname + "/view"));

app.get("/", function(req, res) {
  res.sendfile(__dirname + "/view/index.html")
})

app.get("/patient", function(req, res) {
  network.getPersonalDetails(function(result) {
    res.send(result)
  })
})

app.get("/medicalrecord", function(req, res) {
  network.getMedicalRecords(function(result) {
    let data = [];

    result.forEach(record => {
      r = {
        id: record.id,
        version: record.version,
        content: record.description,
        creatorId: record.author["$identifier"]
      }
      data.push(r);
    });

    console.log(data);
    res.send(data);
  })
})

app.get("/medicalrecord-details", function (req, res) {
  console.log(req.query);
  mr_id = req.query.mr_id;
  network.getMedicalRecordDetails(mr_id, function(histories) {
    res.send(histories);
  });
})

app.listen(8000, function() {
  console.log("App listening on port 8000");
})
