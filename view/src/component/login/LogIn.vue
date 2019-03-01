<template>
  <div id="register" class="container">
    <div class="page-header">
      <h1>LogIn</h1>
    </div>
    <div class="panel panel-primary">
      <div class="panel-body">
        <form>
          <div class="form-group">
            <div class="input-group-prepend">
              <span class="input-group-text">
                <i class="fa fa-lock"></i>
              </span>
            </div>
            <input
              type="cardName"
              class="form-control"
              id="cardName"
              placeholder="Card Name"
              v-model="cardName"
              required
            >
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
  name: "login",
  data() {
    return {
      cardName: ""
    };
  },
  methods: {
    login() {
      self = this;
      this.$http.post("/login", {
        "cardName": self.cardName
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
