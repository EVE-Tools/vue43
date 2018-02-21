<template lang="html">
  <div v-if="loading" class="loader">
    <div class="loader-wrapper">
      <img class="logo" src="~/assets/logo.svg">
      <div class="bar-wrapper">
        <div class="loader-bar">
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  /** This is a full-page overlay loader */
  @Component
  export default class FullPageLoader extends Vue {
    /** Is the loader active? */
    @Prop()
    loading: boolean = false

    /** Display loader */
    start () {
      this.loading = true
    }

    /** Hide laoder */
    finish () {
      this.loading = false
    }
  }
</script>

<style lang="scss" scoped>
  .loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, .7);
    text-align: center;
    z-index: 10000;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .loader-wrapper {
    max-width: 50%;
  }

  .bar-wrapper {
    width: 200px;
    height: 3px;
    background-color: #333;
    animation: bar-wrapper-load 1s ease-out 1;
  }

  @keyframes bar-wrapper-load {
    0% {
      opacity: 0;
    }

    100% {
      opacity: 1;
    }
  }

  .loader-bar {
    width: 100%;
    height: 100%;
    background-color: #fff;
    animation: loader 1s infinite;
    animation-timing-function: ease-in-out;
  }

  @keyframes loader {
    0%,
    50%,
    100% {
      transform: translateX(0%) scaleX(1);
    }

    25% {
      transform: translateX(-50%) scaleX(0);
    }

    75% {
      transform: translateX(50%) scaleX(0);
    }
  }

  .logo {
    width: 200px;
    height: 100px;
    animation: load 1s ease-out 1;
  }

  @keyframes load {
    0% {
      opacity: 0;
      padding-bottom: 50px;
    }

    100% {
      opacity: 1;
      padding-bottom: 0;
    }
  }
</style>
