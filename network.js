const AdminConnection = require("composer-admin").AdminConnection;
const BusinessNetworkConnection = require("composer-client")
  .BusinessNetworkConnection;
const {
  BusinessNetworkDefinition,
  CertificateUtil,
  IdCard
} = require("composer-common");

//declate namespace
const namespace = "org.example.medicalrecord";

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require("composer-common").NetworkCardStoreManager.getCardStore(
  { type: "composer-wallet-inmemory" }
);

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = "medicalrecord";
let factory;

async function importCardForIdentity(cardName, identity) {
  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = "medicalrecord";

  //declare metadata
  const metadata = {
    userName: identity.userID,
    version: 1,
    enrollmentSecret: identity.userSecret,
    businessNetwork: businessNetworkName
  };

  //get connectionProfile from json, create Idcard
  const connectionProfile = require("./local_connection.json");
  const card = new IdCard(metadata, connectionProfile);

  //import card
  await adminConnection.importCard(cardName, card);
}

module.exports = {
  registerMember: async function(cardId, firstName, lastName, email) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect("admin@medicalrecord-v2");

    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    const member = factory.newResource(namespace, "Patient", "p1");
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(
      namespace + ".Patient"
    );
    await participantRegistry.add(member);

    const identity = await businessNetworkConnection.issueIdentity(
      namespace + ".Patient#" + "p1",
      cardId
    );

    await importCardForIdentity(cardId, identity);

    await businessNetworkConnection.disconnect("admin@clp-network");

    return true;
  },
  connect: async function(cardname) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardname);
    console.log("connected business network");

    return true;
  },
  getBusiness() {
    return businessNetworkConnection;
  },
  getPersonalDetails: function(callback) {
    businessNetworkConnection
      .getAssetRegistry(namespace + ".PersonalDetails")
      .then(p => {
        p.getAll().then(result => {
          callback(result);
        });
      });
  },
  getMedicalRecords: function(callback) {
    businessNetworkConnection
      .getAssetRegistry(namespace + ".MedicalRecord")
      .then(m => {
        m.getAll().then(result => {
          callback(result);
        });
      });
  },
  getMedicalRecordDetails: function(data, callback) {
    var histories = [];
    businessNetworkConnection
      .getTransactionRegistry(`${namespace}.UpdateMedicalRecord`)
      .then(transactionRegistry => {
        transactionRegistry.getAll().then(trans => {
          trans.forEach(t => {
            if (t.medicalRecord["$identifier"] == data.mr_id) {
              his = {
                type: "Update",
                timestamp: t.timestamp,
                content: t.content
              };
              histories.push(his);
            }
          });

          businessNetworkConnection
            .getTransactionRegistry(`${namespace}.CreateMedicalRecord`)
            .then(transactionRegistry => {
              transactionRegistry.getAll().then(trans => {
                trans.forEach(t => {
                  if (t.patient["$identifier"] == data.pat_id && t.practitioner["$identifier"] == data.prac_id) {
                    his = {
                      type: "Create",
                      timestamp: t.timestamp,
                      content: t.content
                    };
                    histories.push(his);
                  }
                });
                callback(histories);
              })
            });
        });
      });
  },
  updatePersonalDetails(data, callback) {
    let serializer = businessNetworkConnection.getBusinessNetwork().getSerializer();

    personal_details = serializer.fromJSON(data);

    businessNetworkConnection
      .getAssetRegistry(namespace + ".PersonalDetails")
      .then(p => {
        p.update(personal_details).then(() => {
          callback("success")
        });
      });
  },
  getPractitionerPublicProfile(callback) {
    businessNetworkConnection.getAssetRegistry(namespace + ".PractitionerPublicProfile").then(p => {
      p.getAll().then(practitioners => {
        businessNetworkConnection.getParticipantRegistry(namespace + ".Patient").then(participant => {
          participant.getAll().then(patients => {
            current_patient = patients[0];
            
            list_authorized_prac = [];
            list_unauthorized_prac = [];
            practitioners.forEach(prac => {
              tmp_prac = {
                "id": prac.owner["$identifier"],
                "firstname": prac.firstname,
                "lastname": prac.lastname,
                "dob": prac.Dob,
                "email": prac.email,
                "workplace": {
                  "name": prac.workplace.name,
                  "address": {
                    "street": prac.workplace.address.street,
                    "house": prac.workplace.address.house,
                    "city": prac.workplace.address.city
                  }
                },
                "qualifications": prac.qualifications
              }
              if (current_patient.authorized.indexOf(prac.owner["$identifier"]) > -1) {
                
                list_authorized_prac.push(tmp_prac)
              }
              else {
                list_unauthorized_prac.push(tmp_prac)
              }
            })
            
            callback(list_authorized_prac, list_unauthorized_prac)
          })
        })
      })
    })
  },
  grantAccessMedicalRecord(patient_id, prac_id, callback) {
    let serializer = businessNetworkConnection.getBusinessNetwork().getSerializer();

    let resource = serializer.fromJSON({
      "$class": "org.example.medicalrecord.GrantAccessMedicalRecord",
      "practitioner": `resource:org.example.medicalrecord.Practitioner#${prac_id}`,
      "patient": `resource:org.example.medicalrecord.Patient#${patient_id}`
    });

    businessNetworkConnection.submitTransaction(resource).then(result => {
      callback("success")
    })
  },
  revokeAccessMedicalRecord(patient_id, prac_id, callback) {
    let serializer = businessNetworkConnection.getBusinessNetwork().getSerializer();

    let resource = serializer.fromJSON({
      "$class": "org.example.medicalrecord.RevokeAccessMedicalRecord",
      "practitioner": `resource:org.example.medicalrecord.Practitioner#${prac_id}`,
      "patient": `resource:org.example.medicalrecord.Patient#${patient_id}`
    });

    businessNetworkConnection.submitTransaction(resource).then(result => {
      callback("success")
    })
  },
  getPractitionerPublicDetails: function(callback) {
    businessNetworkConnection
      .getAssetRegistry(namespace + ".PractitionerPublicProfile")
      .then(p => {
        p.getAll().then(result => {
          callback(result);
        });
      });
  }
};
