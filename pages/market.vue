<template lang="html">
  <nuxt-child></nuxt-child>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  
  /** The market container component. It does not do much besides triggering an animation */
  @Component({})
  export default class Market extends Vue {
  }
</script>