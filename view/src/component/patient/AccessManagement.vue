<template>
import { log } from 'util';
  <div id="access-management">
    <div class="mt-3 mb-3">
      <b-button variant="primary" @click="showGrantModal()">Grant new practitioner</b-button>
    </div>
    <br>
    <div class="row m-0">
      <div v-for="prac in list_prac.list_authorized_prac" class="col-md-3 mb-1">
        <div class="p-3" style="background-color: #eee">
          <p class="m-1 title">{{ prac.firstname + " " + prac.lastname }}</p>
          <p class="m-0 info">{{ "ID: " + prac.id}}</p>
          <p class="m-0 info">{{ prac.email }}</p>
          <div>
            <b-button variant="danger" @click="revoke(prac)">Revoke</b-button>
          </div>
        </div>
      </div>
    </div>
    <b-modal
      ref="grant_modal"
      size="lg"
      hide-footer
      title="Grant new practitioner"
    >
      <div class="row">
        <div class="col-md-12" v-for="prac in list_prac.list_unauthorized_prac">
          <div class="p-2" style="background-color: #eee">
            <p class="m-1 title">
              {{ prac.firstname + " " + prac.lastname}}
            </p>
            <p class="m-0 info">{{ "ID: " + prac.id}}</p>
            <p class="m-0 info">{{ prac.email }}</p>
            <div>
              <b-button variant="primary" @click="grant_new(prac)">Grant</b-button>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "access-management",
  props: {
    list_prac: {
      type: Object
    }
  },
  data: {
    
  },
  methods: {
    showGrantModal() {
      this.$refs.grant_modal.show();
    },
    grant_new(prac) {
      self = this;
      
      this.$http.post("/grant-access-medical-record", {
        pat_id: self.$localStorage.get("user_id"),
        prac_id: prac.id
      }).then((res) => {
        if (res.body.message == "success") {
          self.list_prac.list_authorized_prac.push(prac);

          for (var i = 0; i < self.list_prac.list_unauthorized_prac.length ; i++) {
            if (self.list_prac.list_unauthorized_prac[i].id == prac.id) {
              self.list_prac.list_unauthorized_prac.splice(i, 1);
            }
          }

          this.$refs.grant_modal.hide();
        }
      }).catch((err) => {
        
      });
    },
    revoke(prac) {
      self = this;

      this.$http.post("/revoke-access-medical-record", {
        pat_id: self.$localStorage.get("user_id"),
        prac_id: prac.id
      }).then((res) => {
        if (res.body.message == "success") {
          self.list_prac.list_unauthorized_prac.push(prac);
          for (var i = 0; i < self.list_prac.list_authorized_prac.length ; i++) {
            if (self.list_prac.list_authorized_prac[i].id == prac.id) {
              self.list_prac.list_authorized_prac.splice(i, 1);
            }
          }
        }
      }).catch((err) => {
        
      });
    }
  }
}
</script>

<style>
.title {
  font-size: 22px;
  font-weight: 700;
}

.info {
  font-size: 14px;
  font-weight: 300;
  color: #aaa;
}
</style>
