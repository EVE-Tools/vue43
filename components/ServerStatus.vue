<template lang="html">
  <v-btn flat>
    <v-tooltip bottom>
      <span slot="activator" v-if="players > -1"><span class="online">•&thinsp;</span>{{ formatNumber(players) }}</span>
      <span slot="activator" v-else><span class="offline">•&thinsp;</span>offline</span>
      <span>Players Online (Tranquility)</span>
    </v-tooltip>
  </v-btn>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { numberMixin } from '../util/formatting'

  import { readPlayers, dispatchLoadServerStatus } from '../store/modules/serverStatus'

  /** A component for displaying th cluster's status in the title bar */
  @Component({
    mixins: [numberMixin]
  })
  export default class ServerStatus extends Vue {
    timer: number

    get players () {
      return readPlayers(this.$store)
    }

    dispatchServerStatusUpdate () {
      dispatchLoadServerStatus(this.$store)
    }

    mounted () {
      this.dispatchServerStatusUpdate()
      this.timer = setInterval(this.dispatchServerStatusUpdate, 30000)
    }

    beforeDestroy () {
      clearInterval(this.timer)
    }
  }
</script>

<style lang="css" scoped>
  .offline {
    color: #f00;
  }

  .online {
    color: #50c878;
  }
</style>
