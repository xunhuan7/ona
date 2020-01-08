<template>
  <div class="view">
<!--    <iframe src="http://eboher.im:3000/"></iframe>-->
    <iframe src="https://www.google.com/"></iframe>
   <div v-html="html"></div>
  </div>
</template>

<script>
  import axios from 'axios';

  export default {
    name: 'Document',
    data() {
      return {
        html: ''
      };
    },
    created() {
      axios.get('https://www.google.com/')
        .then(res => {
          this.html = res.data;
        });
    }
  };
</script>

<style scoped>

</style>
