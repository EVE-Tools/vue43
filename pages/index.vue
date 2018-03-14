<template lang="html">
  <div class="home">
    <v-layout row wrap class="mt-5 mb-5">
      <v-flex xs3 md3></v-flex>
      <v-flex xs6 md6>
        <img class="main-logo" alt="element43" src="~/assets/logo.svg" style="transform: scale(0.6);"/>
      </v-flex>
      <v-flex xs3 md3></v-flex>
    </v-layout>
    <v-layout row wrap class="mt-5 mb-5">
      <v-flex xs0 md4></v-flex>
      <v-flex xs12 md4>
        <search :autofocus="true"></search>
      </v-flex>
      <v-flex xs0 md4></v-flex>
    </v-layout>
    <v-container grid-list-md class="mt-5">
      <v-layout row wrap class="mt-5">
        <v-flex xs12 md4>
          <h2>Free</h2>
          <p>
            Element43 is a non-commercial, neutral, ad-free, open source service that is offered free of charge to all players of EVE online.
          </p>
        </v-flex>
        <v-flex xs12 md4>
          <h2>Open</h2>
          <p>
            Element43 is a modern, polyglot, open source project. Feel free to contact us if you have any suggestions or want to contribute. More info can be found on our about page.
          </p>
        </v-flex>
        <v-flex xs12 md4>
          <h2>Data</h2>
          <p>
            Trading sounds simple. Buy low, sell high. But where to find the best deals? Element43 provides you with all the data you need to get the most out of your hard earned ISK!
          </p>
        </v-flex>
      </v-layout>
    </v-container>
    <ticker :region_id="region" :type_ids="favorites"></ticker>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Watch } from 'vue-property-decorator'

  import Ticker from '../components/Ticker.vue'
  import Search from '../components/Search.vue'

  import { dispatchLoadType } from '../store/modules/types'
  import { dispatchLoadLocations } from '../store/modules/locations'
  import { dispatchLoadStatisticsOfRegionType } from '../store/modules/marketStats'
  import { readFavoriteTypes, readRegionFilter } from '../store/modules/user'

  /** The main page, for performance reasons the ticker is loaded client-side */
  @Component({
    components: {
      Search,
      Ticker
    }
  })
  export default class Index extends Vue {
    @Watch('region', { immediate: true })
    onChangeRegion (_oldID: number, _newID: number) {
      this.loadData()
    }

    @Watch('favorites', { immediate: true })
    onChangeFavorites (_oldID: number, _newID: number) {
      this.loadData()
    }

    head () {
      return {
        titleTemplate: ''
      }
    }

    serverCacheKey () {
      // Will change every hour
      return Math.floor(Date.now() / 3600000)
    }

    get favorites() {
      return readFavoriteTypes(this.$store)
    }

    get region() {
      let currentRegion = readRegionFilter(this.$store)
      if (currentRegion === -1) {
        return 10000002
      }

      return currentRegion
    }

    loadData () {
      for (let type_id of this.favorites) {
        dispatchLoadLocations(this.$store, [this.region])
        dispatchLoadType(this.$store, type_id)
        dispatchLoadStatisticsOfRegionType(this.$store, {region_id: this.region, type_id: type_id})
      }
    }
  }
</script>

<style scoped>
  .home {
    padding-top: 8em;
  }
</style>