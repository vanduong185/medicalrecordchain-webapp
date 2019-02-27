<template>
  <div id="personal-details">
    <div class="row">
      <div class="col-md-4">
        <b-form-group label="First name:">
          <b-form-input id="firstname" v-model="user_info.firstname" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Last name:">
          <b-form-input id="lastname" v-model="user_info.lastname" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Email">
          <b-form-input id="email" type="email" v-model="user_info.email" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Date of birth:">
          <b-form-input id="dob" v-model="user_info.Dob" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="City:">
          <b-form-input id="city" v-model="user_info.address.city" required/>
        </b-form-group>
      </div>
      <div class="col-md-4">
        <b-form-group label="Street:">
          <b-form-input id="street" v-model="user_info.address.street" required/>
        </b-form-group>
      </div>
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
  data: {}
};
</script>

<style>
</style>
