const AdminConnection = require("composer-admin").AdminConnection;
const BusinessNetworkConnection = require("composer-client")
  .BusinessNetworkConnection;
const {
  BusinessNetworkDefinition,
  CertificateUtil,
  IdCard
} = require("composer-common");

//declate namespace
const namespace = "org.example.medicalchain";

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
  registerPatient: async function (id, cardName) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect("admin@medicalrecord");

    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    const patient = factory.newResource(namespace, "Patient", id);
    patient.authorized = [];
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(
      namespace + ".Patient"
    );
    await participantRegistry.add(patient);

    const identity = await businessNetworkConnection.issueIdentity(
      namespace + ".Patient#" + id,
      cardName
    );

    await importCardForIdentity(cardName, identity);

    await businessNetworkConnection.disconnect("admin@medicalrecord");

    return true;
  },
  registerPratitioner: async function (id, cardName) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect("admin@medicalrecord");

    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    const practitioner = factory.newResource(namespace, "Pratitioner", id);
    practitioner.authorized = [];
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(
      namespace + ".Pratitioner"
    );
    await participantRegistry.add(practitioner);

    const identity = await businessNetworkConnection.issueIdentity(
      namespace + ".Pratitioner#" + id,
      cardName
    );

    await importCardForIdentity(cardName, identity);

    await businessNetworkConnection.disconnect("admin@medicalrecord");

    return true;
  },
  logout: async function (cardname) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.disconnect(cardname);
    console.log("connected business network");

    return true;
  },
  connect: async function (cardname) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardname);
    console.log("connected business network");

    return true;
  },
  getBusiness() {
    return businessNetworkConnection;
  },
  getPersonalDetails: function (callback) {
    businessNetworkConnection
      .getAssetRegistry(namespace + ".PersonalDetails")
      .then(p => {
        p.getAll().then(result => {
          callback(result);
        });
      });
  },
  getMedicalRecords: function (callback) {
    businessNetworkConnection
      .getAssetRegistry(namespace + ".MedicalRecord")
      .then(m => {
        m.getAll().then(result => {
          callback(result);
        });
      });
  },
  getMedicalRecordDetails: function (data, callback) {
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
  }
};