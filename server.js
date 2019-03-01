const express = require("express");
const bodyparser = require("body-parser");
var network = require("./network");

network.connect("patient1@medicalrecord");

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

app.get("/practition", function(req, res) {
  network.getPractitionerPublicDetails(function(result) {
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
        creatorId: record.author["$identifier"],
        ownerId: record.owner["$identifier"]
      }
      data.push(r);
    });

    res.send(data);
  })
})

app.get("/medicalrecord-details", function (req, res) {
  data = req.query.data;
  network.getMedicalRecordDetails(data, function(histories) {
    res.send(histories);
  });
})

app.put("/patient", function(req, res) {
  network.updatePersonalDetails(req.body, function(message){
    if (message == "success") {
      res.json({
        message: "success"
      })
    }
    else {
      res.json({
        message: "fail"
      })
    }
  })
})

app.get("/practitioner-public-profile", function(req, res) {
  network.getPractitionerPublicProfile(function(list_authorized_prac, list_unauthorized_prac) {
    data = {
      list_authorized_prac: list_authorized_prac,
      list_unauthorized_prac: list_unauthorized_prac,
    }
    res.send(data)
  })
})

app.post("/grant-access-medical-record", function(req, res) {
  data = req.body;
  network.grantAccessMedicalRecord(data.pat_id, data.prac_id, function(message) {
    if (message == "success") {
      res.json({
        message: message
      })
    }
  })
})

app.post("/revoke-access-medical-record", function(req, res) {
  data = req.body;
  network.revokeAccessMedicalRecord(data.pat_id, data.prac_id, function(message) {
    if (message == "success") {
      res.json({
        message: message
      })
    }
  })
})

app.listen(8000, function() {
  console.log("App listening on port 8000");
})
