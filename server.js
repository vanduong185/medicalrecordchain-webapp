const express = require("express");
const bodyparser = require("body-parser");
var network = require("./network");


//network.getMedicalRecordDetails();

const NAMESPACE = "org.example.medicalrecord"

var app = express();
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(express.static(__dirname + "/view"));

app.get("/", function (req, res) {
  res.sendfile(__dirname + "/view/index.html")
})

app.get("/patient", function (req, res) {
  network.getPersonalDetails(function (result) {
    res.send(result)
  })
})

app.get("/medicalrecord", function (req, res) {
  network.getMedicalRecords(function (result) {
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
  network.getMedicalRecordDetails(data, function (histories) {
    res.send(histories);
  });
})

app.put("/patient", function (req, res) {
  network.updatePersonalDetails(req.body, function (message) {
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
app.post("/register", function (req, res) {
  network.registerPatient(req.body.id, req.body.cardName).then((response) => {
    if (message == "success") {
      response.json({
        message: "success"
      })
    }
    else {
      response.json({
        message: "fail"
      })
    }
  })
})
app.post("/login", function (req, res) {
  network.connect(req.body.cardName).then((response) => {
    if (message == "success") {
      response.json({
        message: "success"
      })
    }
    else {
      response.json({
        message: "fail"
      })
    }
  })
})
app.post("/logout", function (req, res) {
  network.logout(req.body.cardName).then((response) => {
    if (message == "success") {
      response.json({
        message: "success"
      })
    }
    else {
      response.json({
        message: "fail"
      })
    }
  })
})
//create medical record
app.post("/create-medicalrecord", function (req, res) {
  network.createMedicalRecord(req.body.id, req.body.description, req.body.patientId, req.body.pratitionerId)
    .then((response) => {
      if (message == "success") {
        response.json({
          message: "success"
        })
      }
      else {
        response.json({
          message: "fail"
        })
      }
    })
})
//update medical record 
app.put("/update-medicalrecord", function (req, res) {
  network.createMedicalRecord(req.body.id, req.body.pratitionerId, req.body.content)
    .then((response) => {
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

app.listen(8000, function () {
  console.log("App listening on port 8000");
})
