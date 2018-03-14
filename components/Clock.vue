<template lang="html">
  <v-btn flat>
    <div>
      <v-tooltip bottom>
        <span slot="activator">{{ time.getUTCHours() }}:{{ ("0" + time.getUTCMinutes()).slice(-2) }}</span>
        <span>UTC/EVE Time</span>
      </v-tooltip>
    </div>
  </v-btn>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import {readTime, dispatchUpdateTime} from '../store/modules/clock'

  /** A small UTC clock component for the title bar */
  @Component({})
  export default class Clock extends Vue {
    /** Timer handle for updating the clock */
    timer: number

    get time () {
      return readTime(this.$store)
    }

    /** Dispatch clock update at the store */
    dispatchClockUpdate () {
      dispatchUpdateTime(this.$store)
    }

    /** Start updating the clock on component's creating */
    created () {
      this.dispatchClockUpdate()
      this.timer = setInterval(this.dispatchClockUpdate, 10000)
    }

    /** Release timer on comonent's destruction */
    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>
