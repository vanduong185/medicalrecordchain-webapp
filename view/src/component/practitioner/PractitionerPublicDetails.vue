<template>
  <div id="practitioner-public-details">
    <div class="row">
      <div class="col-md-4">
        <b-form-group label="First name:">
          <b-form-input id="practition_firstname" v-model="practition_infor.firstname" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Last name:">
          <b-form-input id="practition_lastname" v-model="practition_infor.lastname" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Email">
          <b-form-input id="practition_email" type="email" v-model="practition_infor.email" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Date of birth:">
          <b-form-input id="practition_dob" v-model="practition_infor.Dob" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="City:">
          <b-form-input id="practition_city" v-model="practition_infor.address.city" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Street:">
          <b-form-input id="practition_street" v-model="practition_infor.address.street" required/>
        </b-form-group>
      </div>
    </div>

    <div class="float-right mt-3">
      <b-button variant="outline-primary" @click="update()" >Update</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "practitioner-public-details",
  props: {
    practition_infor: {
      type: Object
    }
  },
  data: {},
  methods: {
    update: function() {
      self = this;

      this.$http.put("/practition", self.practition_infor).then(res => {
        if (res.body.message == "success") {
        }
      })
    }
  }
};
</script>

<style>
</style>
