<template>
  <div class="bg">
    <select-company-dialog />
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import SelectCompanyDialog from './select-company-dialog.vue';

export default defineComponent({
  components: {
    SelectCompanyDialog,
  },
  setup() {
  },
});
</script>
<style>
.bg{
  width: 100vw;
  height: 100vh;
  background: url('~@/assets/login_bg.png') center no-repeat;
  background-size: cover;
}
body{
  padding: 0;
  margin: 0;
}
</style>
