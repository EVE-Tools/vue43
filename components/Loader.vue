<template lang="html">
  <div class="loader">
    <img class="logo" src="~/assets/logo.svg">
    <div class="bar-wrapper">
      <div v-if="!failed && !retry" class="loader-bar loading"></div>
      <div v-else :class="[{ failed: failed, retry: retry }, 'loader-bar']"></div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  /** A small on-page loader with a continuous bar and our logo */
  @Component({})
  export default class Loader extends Vue {
    /** Has the process failed for good? */
    @Prop({default: false})
    failed: boolean

    /** Retry bar which will fill within one second */
    @Prop({default: false})
    retry: boolean
  }
</script>

<style lang="scss" scoped>
  .loader {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .bar-wrapper {
    width: 12em;
    height: 0.2em;
    margin-top: 0.5em;
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
  }

  .loading {
    animation: loader 1s infinite;
    animation-timing-function: ease-in-out;
  }

  .failed {
    background-color: rgba(255, 0, 0, 0.7);
    animation: none;
  }

  .retry {
    background-color: rgba(255, 0, 0, 0.7);
    animation: retry 1s;
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

  @keyframes retry {
    0% {
      transform: translateX(-50%) scaleX(0);
    }

    100% {
      transform: translateX(0%) scaleX(-1);
    }
  }

  .logo {
    width: 12em;
    height: 3em;
  }
</style>
