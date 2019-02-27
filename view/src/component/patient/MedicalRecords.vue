<template>
  <div id="medical-records">
    <b-table
      selectedVariant="success"
      selectable
      select-mode="single"
      striped
      hover
      v-bind:items="medical_records"
      @row-selected="rowSelected"
    />
    <b-modal
      ref="myModalRef"
      hide-footer
      v-bind:title="'History of medical record ' + selected_item.id"
    >
      <b-table
        striped
        hover
        v-bind:items="histories_medical_record"
      />
    </b-modal>
  </div>
</template>

<script>
export default {
  name: "medical-records",
  props: {
    medical_records: {
      type: Array
    }
  },
  data() {
    return {
      histories_medical_record: [],
      selected_item: {
        id: ""
      }
    };
  },
  methods: {
    rowSelected(items) {
      self = this;
      console.log(items);
      this.selected_item = items[0];
      this.$refs.myModalRef.show();
      this.$http.get("/medicalrecord-details", {params: {mr_id: items[0].id}}).then(res => {
        console.log(res);
        self.histories_medical_record = res.body;
      });
    }
  }
};
</script>

<style>
</style>
