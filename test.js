const AdminConnection = require('composer-admin').AdminConnection;
const BusinessNetworkConnection = require('composer-client').BusinessNetworkConnection;
const { BusinessNetworkDefinition, CertificateUtil, IdCard } = require('composer-common');

//declate namespace
const namespace = 'org.example.medicalchain';

//in-memory card store for testing so cards are not persisted to the file system
const cardStore = require('composer-common').NetworkCardStoreManager.getCardStore({ type: 'composer-wallet-inmemory' });

//admin connection to the blockchain, used to deploy the business network
let adminConnection;

//this is the business network connection the tests will use.
let businessNetworkConnection;

let businessNetworkName = 'medicalchain';
let factory;


/*
 * Import card for an identity
 * @param {String} cardName The card name to use for this identity
 * @param {Object} identity The identity details
 */
async function importCardForIdentity(cardName, identity) {

    //use admin connection
    adminConnection = new AdminConnection();
    businessNetworkName = 'medicalchain';

    //declare metadata
    const metadata = {
        userName: identity.userID,
        version: 1,
        enrollmentSecret: identity.userSecret,
        businessNetwork: 'medicalchain'
    };

    //get connectionProfile from json, create Idcard
    const connectionProfile = require('./local_connection.json');
    const card = new IdCard(metadata, connectionProfile);

    //import card
    await adminConnection.importCard(cardName, card);
}


/*
* Reconnect using a different identity
* @param {String} cardName The identity to use
*/
async function useIdentity(cardName) {

    //disconnect existing connection
    await businessNetworkConnection.disconnect();

    //connect to network using cardName
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardName);
}


//export module

/*
* Create patient participant and import card for identity
* @param {String} cardId Import card id for patient
* @param {String} accountNumber patient account number as identifier on network
* @param {String} firstName patient first name
* @param {String} lastName patient last name
* @param {String} phoneNumber patient phone number
* @param {String} email patient email
*/
async function registerPatient(cardId, id) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect("admin@medicalrecord");

    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    const member = factory.newResource(namespace, "Patient", id);
    member.authorized = [];
    const participantRegistry = await businessNetworkConnection.getParticipantRegistry(
        namespace + ".Patient"
    );
    await participantRegistry.add(member);

    const identity = await businessNetworkConnection.issueIdentity(
        namespace + ".Patient#" + id,
        cardId
    );

    await importCardForIdentity(cardId, identity);

    await businessNetworkConnection.disconnect("admin@medicalrecord");

    return true;
}

async function createMedicalRecord(id, description, patientId, pratitionerId) {
    businessNetworkConnection = new BusinessNetworkConnection();

    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    const medicalRecord = factory.newResource(namespace, "MedicalRecord", id);
    medicalRecord.description = description;
    medicalRecord.version = 1;
    medicalRecord.owner = factory.newRelationship(namespace, 'Patient', patientId);
    medicalRecord.author = factory.newRelationship(namespace, 'Practitioner', pratitionerId);


    const assetRegistry = await businessNetworkConnection.getAssetRegistry(
        namespace + ".MedicalRecord"
    );
    await assetRegistry.add(medicalRecord);

    //create transaction
    const createMedicalRecordTransaction = factory.newTransaction(namespace, 'CreateMedicalRecord');
    createMedicalRecordTransaction.content = description;
    createMedicalRecordTransaction.practitioner = factory.newRelationship(namespace, 'Practitioner', pratitionerId);
    createMedicalRecordTransaction.patient = factory.newRelationship(namespace, 'Patient', patientId);

    //submit transaction
    await businessNetworkConnection.submitTransaction(createMedicalRecordTransaction);

    return true;
}
async function updateMedicalRecord(idMedicalRecord,pratitionerId, content, cardName) {
    businessNetworkConnection = new BusinessNetworkConnection();
    await businessNetworkConnection.connect(cardName);


    factory = businessNetworkConnection.getBusinessNetwork().getFactory();

    //create transaction
    const updateMedicalRecordTransaction = factory.newTransaction(namespace, 'UpdateMedicalRecord');
    updateMedicalRecordTransaction.content = content;
    updateMedicalRecordTransaction.practitioner = factory.newRelationship(namespace, 'Practitioner', pratitionerId);
    updateMedicalRecordTransaction.medicalRecord = factory.newRelationship(namespace, 'MedicalRecord', idMedicalRecord);
    await businessNetworkConnection.submitTransaction(updateMedicalRecordTransaction);

    let medicalRecord = await businessNetworkConnection.getParticipantRegistry(
        namespace + ".Medicalrecord"
    );
    updateMedicalRecordTransaction.medicalRecord.description = update.content;
    updateMedicalRecordTransaction.medicalRecord.version = updateMedicalRecordTransaction.version + 1;
    medicalRecord.update(updateMedicalRecordTransaction.medicalRecord.description);
    medicalRecord.update(updateMedicalRecordTransaction.medicalRecord.version);






    await businessNetworkConnection.disconnect(cardName);
}



updateMedicalRecord('4','1', 'update+transaction', 'a@medicalrecord')





