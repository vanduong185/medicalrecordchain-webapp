<template>
  <div id="register" class="container">
    <div class="page-header">
      <h1>CREATE ACCOUNT</h1>
    </div>
    <div class="panel panel-primary">
      <div class="panel-body">
        <form>
          <div class="form-group">
            <div class="input-group-prepend md-2">
              <span class="input-group-text">
                <i class="fa fa-user"></i>
              </span>
            </div>
            <input type="text" class="form-control" id="id" placeholder="ID" v-model="id" required>
          </div>
          <div class="form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-lock"></i>
              </span>
            </div>
            <input type="idcard" class="form-control" id="idcard" placeholder="ID Card" v-model="idCard" required>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" @click="register()">Create Account</button>
          </div>
          <!-- form-group// -->
          <p class="text-center">
            Have an account?
            <a href>Log In</a>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "register",
  data() {
    return {
      id:"",
      idCard:""
      
    };
  },
  methods: {
    register() {
      self = this;
      console.log(this.id)
      this.$http.post("/register", {
        "id": this.id,
        "idCard":this.idCard
      });
    }
  }
};
</script>

<style>
#register {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 500px;
  height: 500px;
  margin-top: 20px;
}
th,
#tableInput,
option {
  text-align: center;
}
img {
  width: 100px;
  height: 100px;
}
button {
  width: 100px;
  height: 50px;
}
</style>
