const AdminConnection = require("composer-admin").AdminConnection;
const BusinessNetworkConnection = require("composer-client")
  .BusinessNetworkConnection;
const {
  BusinessNetworkDefinition,
  CertificateUtil,
  IdCard
} = require("composer-common");

//declate namespace
const namespace = "org.example.merechain";

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require("composer-common").NetworkCardStoreManager.getCardStore(
  { type: "composer-wallet-inmemory" }
);

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = "medicalrecord-v2";
let factory;

async function importCardForIdentity(cardName, identity) {
  //use admin connection
  adminConnection = new AdminConnection();
  businessNetworkName = "medicalrecord-v2";

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
  connect: function(cardname) {
    businessNetworkConnection = new BusinessNetworkConnection();
    businessNetworkConnection
      .connect(cardname)
      .then(result => {
        businessNetworkConnection.getParticipantRegistry(namespace+".Patient").then(function(p) {
          p.getAll().then(function(all) {
            console.log(all)
          })
        })
      })
      .catch(err => {});
  }
};
