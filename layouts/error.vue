<template>
  <v-container column justify-center align-center>
    <img src="~/assets/logo.svg" alt="Element43 Logo" width="30%" />
    <h1>
      Oh no - Error {{ error.statusCode }}
    </h1>
    <h2>
      {{ error.message }}
    </h2>
    <a href="/">
      back to highsec
    </a>
  </v-container>
</template>
<script>
/** Container for displaying errors */
export default {
  props: ['error'],
  layout: 'default',
  render () {
    console.error(this.error)
  }
}
</script>