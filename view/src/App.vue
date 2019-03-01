<template>
  <div id="app">
    <div>
        <b-navbar toggleable="lg" type="dark" variant="info">
          <b-navbar-brand href="#">
            Electronic Medical Record
            <button class="btn btn-danger" @click=" logout()">Log out</button>
          </b-navbar-brand>

          <b-navbar-toggle target="nav_collapse"/>

          <b-collapse is-nav id="nav_collapse">
            <!-- Right aligned nav items -->
            <b-navbar-nav class="ml-auto"></b-navbar-nav>
          </b-collapse>
        </b-navbar>
    </div>
    <div>
      <b-jumbotron header="Hi patient" lead="Have a good day!" class="m-0"></b-jumbotron>
    </div>
    <b-tabs content-class="mt-3" pills card>
      <b-tab title="Personal details" active>
        <personal-details v-bind:user_info="user_info"></personal-details>
      </b-tab>
      <b-tab title="Practitioner Public details" active>
        <practitioner-public-details v-bind:practition_infor="practition_infor"></practitioner-public-details>
      </b-tab>
      <b-tab title="Medical Record">
        <medical-records v-bind:medical_records="medical_records"></medical-records>
      </b-tab>
      <b-tab title="Access management">
        <access-management :list_prac="list_prac"></access-management>
      <b-tab title="Register">
        <register></register>
      </b-tab>
      <b-tab title="LogIn">
        <login></login>
      </b-tab>
    </b-tabs>
  </div>
</template>

<script>
import PersonalDetails from "./component/patient/PersonalDetails";
import MedicalRecords from "./component/patient/MedicalRecords";
import AccessManagement from "./component/patient/AccessManagement";
import { log } from 'util';
import practitionerPublicDetails from "./component/practitioner/PractitionerPublicDetails";
import Register from "./component/register/Register";
import LogIn from "./component/login/LogIn";

export default {
  name: "app",
  components: {
    "personal-details": PersonalDetails,
    "medical-records": MedicalRecords,
    "access-management": AccessManagement,
    "practitioner-public-details":practitionerPublicDetails,
    register: Register,
    login: LogIn
  },
  data() {
    return {
      user_info: {},
      medical_records: [],
      list_prac: [],
      practition_infor:{},
      medical_records: []
    };
  },
  mounted: function() {
    self = this;

    this.$http.get("/patient").then(res => {
      let data = res.body;
      self.user_info = data[0];
      self.$localStorage.set("user_id", self.user_info.owner.split("#")[1]);
    });

    this.$http.get("/practition").then(res => {
      let data = res.body;
      self.practition_infor = data[0];
    });

    this.$http.get("/medicalrecord").then(res => {
      self.medical_records = res.body;
    });

    this.$http.get("/practitioner-public-profile").then(res => {
      self.list_prac = res.body
    })

  },
  methods: {
    logout() {
      self = this;
      console.log(this.id);
      this.$http.post("/logout", {
        idCard: self.user_info.idCard
      });
    }
  }
};
</script>

<style>
#app {
  position: relative;
  text-align: center;
  margin-top: 15px;
  margin-bottom: 15px;
}

button {
  float: right;
}
</style>
