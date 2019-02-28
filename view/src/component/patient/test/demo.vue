<template>
  <div id="personal-details">
    <div class="">
      <div class="row col-md-8 d-flex justify-content-center">
        <b-form-group class="col-md-3" label="First name:">
          <b-form-input class="col-md-5" id="firstname" v-model="user_info.firstname" required/>
        </b-form-group>
      </div>
      <div class="row col-md-8 d-flex justify-content-center">
        <b-form-group class="col-md-3" label="Last name:">
          <b-form-input class="col-md-5" id="lastname" v-model="user_info.lastname" required/>
        </b-form-group>
      </div>
      <div class="row col-md-8 d-flex justify-content-center">
        <b-form-group class="col-md-3" label="Email">
          <b-form-input class="col-md-5" id="email" type="email" v-model="user_info.email" required/>
        </b-form-group>
      </div> 
      <div class="row col-md-8 d-flex justify-content-center">
        <b-form-group class="col-md-3" label="Date of birth:">
          <b-form-input class="col-md-5" id="dob" v-model="user_info.Dob" required/>
        </b-form-group>
      </div>
      <div class="row col-md-8 d-flex justify-content-center">
        <b-form-group class="col-md-3" label="City:">
          <b-form-input class="col-md-5" id="city" v-model="user_info.address.city" required/>
        </b-form-group>
      </div>
      <div class="row col-md-8 d-flex justify-content-center">
        <b-form-group class="col-md-3" label="Street:">
          <b-form-input class="col-md-5" id="street" v-model="user_info.address.street" required/>
        </b-form-group>
      </div>
    </div>

    <div class="float-right mt-3 " >
      <b-button variant="outline-primary" @click="update()" >Update</b-button>
    </div>
  </div>
</template>

<script>
export default {
  name: "personal-details",
  props: {
    user_info: {
      type: Object
    }
  },
  data: {},
  methods: {
    update: function() {
      self = this;

      this.$http.put("/patient", self.user_info).then(res => {
        if (res.body.message == "success") {

        }
      })
    }
  }
};
</script>

<style>
</style>
