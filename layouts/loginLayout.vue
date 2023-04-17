<template>
  <v-app>
    <v-app-bar dense elevation="1" fixed color="#E33E3F"></v-app-bar>
    <v-main>
      <nuxt />
    </v-main>
    <v-footer class="py-10" color="#E33E3F" width="100%" dark elevation="1">
        <v-card-text class="d-flex justify-center align-center white--text pt-0">
          Copyright © {{this.year}} ASIA GOLD. All rights reserved.
        </v-card-text>
    </v-footer>
  </v-app>
</template>
<script>
export default {
  data: () => ({
    year:null
  }),
  mounted(){
    const currentYear = new Date().getFullYear()
    this.year = currentYear
  }
}
</script>
  <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Prompt:wght@100;300;500&display=swap');
* {
  font-family: 'Prompt', sans-serif;
}
.v-application {
  /* background:#ff964f; */
}
</style>