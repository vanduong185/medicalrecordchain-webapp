<template>
  <div id="register" class="container">
    <div class="page-header">
      <h1>Log In</h1>
    </div>
    <div class="panel panel-primary">
      <div class="panel-body">
        <form>
          <div class="form-group">
            <!-- <div class="input-group-prepend">
            </div> -->
            <input type="idcard" class="form-control" id="idcard" placeholder="ID Card" v-model="idCard" required>
          </div>
          <div class="form-group">
            <button class="btn btn-primary btn-block" @click="login()">LogIn</button>
          </div>
          <!-- form-group// -->
          <p class="text-center">
            Not registered?
            <a href>Create an account</a>
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
      idCard:""
      
    };
  },
  methods: {
    login() {
      this.$http.post("/register", {
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
