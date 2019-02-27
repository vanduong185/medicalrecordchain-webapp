<template>
  <div id="app">
    <div>
      <b-navbar toggleable="lg" type="dark" variant="info">
        <b-navbar-brand href="#">Electronic Medical Record</b-navbar-brand>

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
      <b-tab title="Medical Record">
        <medical-records v-bind:medical_records="medical_records"></medical-records>
      </b-tab>
      <b-tab title="Access management"></b-tab>
    </b-tabs>
  </div>
</template>

<script>
import PersonalDetails from "./component/patient/PersonalDetails";
import MedicalRecords from "./component/patient/MedicalRecords";

export default {
  name: "app",
  components: {
    "personal-details": PersonalDetails,
    "medical-records": MedicalRecords
  },
  data() {
    return {
      user_info: {},
      medical_records: []
    };
  },
  mounted: function() {
    self = this;

    this.$http.get("/patient").then(res => {
      console.log(res);
      let data = res.body;
      self.user_info = data[0];
      console.log(self.user_info);
    });

    this.$http.get("/medicalrecord").then(res => {
      self.medical_records = res.body;
      console.log(self.medical_records);
    });
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

h1,
h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
