<template lang="html">
  <v-container>
    <h1 v-if="types[type_id]">{{ typeName(types[type_id]) }}</h1>
    <h1 v-else>&nbsp;</h1>
    <nav>
      <v-layout row>
        <v-flex md6>
          <v-tabs>
            <v-tab nuxt :to="{ name: 'market-type', params: { type: this.$route.params.type } }" exact>Overview</v-tab>
            <v-tab nuxt :to="{ name: 'market-type-regions', params: { type: this.$route.params.type } }" append>Regions</v-tab>
            <v-tab nuxt :to="{ name: 'market-type-bid', params: { type: this.$route.params.type } }" append>Bid / Buy</v-tab>
            <v-tab nuxt :to="{ name: 'market-type-ask', params: { type: this.$route.params.type } }" append>Ask / Sell</v-tab>
            <v-tabs-slider color="primary"></v-tabs-slider>
          </v-tabs>
        </v-flex>
        <v-flex md6>
          <v-layout row reverse align-end>
            <v-flex md4 pt-3 pl-3>
              <v-switch label="Hide Lowsec" v-model="lowsecFilter"></v-switch>
            </v-flex>
            <v-flex md4>
              <v-select name="region-filter" v-model="regionFilter" :items="regionsByName" item-value="region.id" item-text="region.name">
                <option :value="-1">All Regions</option>
              </v-select>
            </v-flex>
            <!---
            FEATURE: Favorites
            <span :class="[{favorite: isFavorite}, 'favbutton']" v-on:click="makeFavorite" style="padding-left: 1em;">
              <icon name="star" scale="1" class="icon"></icon>
            </span>
            !-->
          </v-layout>
        </v-flex>
      </v-layout>
    </nav>
    <v-flex md12 pt-5>
      <nuxt-child :type="type" :typeStats="statsForCurrentType" :orders="filteredOrders" :regionFilter="regionFilter"></nuxt-child>
    </v-flex>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  if ((process as any).browser) {
    // These imports are broken in SSR, but work client-side
    require('vue-awesome/icons/star')
  }

  import TypeIndex from './_type/index.vue'
  import { isValidIDSlug, unslugID } from '../../util/slug'

  import * as user from '../../store/modules/user'
  import { readStatistics, dispatchLoadStatisticsOfType } from '../../store/modules/marketStats'
  import { readTypes, dispatchLoadType, TypeInfo } from '../../store/modules/types'
  import { readLocations, dispatchLoadLocations, LocationInfo, location } from '../../store/modules/locations'
  import { readAllMarkets, dispatchLoadMarketOfType, Order } from '../../store/modules/markets'

  /** Main component for the quicklook views. It handles data acquisition and simply 'passes-down' data to child-components via props */
  @Component({
    components: { TypeIndex }
  })
  export default class Quicklook extends Vue {
    get lowsecFilter () {
      return user.readLowsecFilterEnabled(this.$store)
    }

    set lowsecFilter (enable: boolean) {
      if (enable) {
        user.commitEnableLowsecFilter(this.$store)
      } else {
        user.commitDisableLowsecFilter(this.$store)
      }
    }

    get regionFilter () {
      return user.readRegionFilter(this.$store)
    }

    set regionFilter (region_id: number) {
      user.commitSetRegionFilter(this.$store, region_id)
    }

    get typeFilter () {
      return user.readTypeFilter(this.$store)
    }

    get types () {
      return readTypes(this.$store)
    }

    get typeStats () {
      return readStatistics(this.$store)
    }

    get locations () {
      return readLocations(this.$store)
    }

    get type_id () {
      return unslugID(this.$route.params.type)
    }

    get type () {
      return this.types[this.type_id]
    }

    get isFavorite () {
      return user.readFavoriteTypes(this.$store).indexOf(this.type_id) !== -1 ? true : false
    }

    get statsForCurrentType () {
      return Object.keys(this.typeStats).filter((key: string) => {
        return this.typeStats[key].type_id === this.type_id ? true : false
      }).map((validKey: string) => {
        return this.typeStats[validKey]
      })
    }

    get allMarkets () {
      return readAllMarkets(this.$store)
    }

    get filteredOrders () {
      let orders: Order[] = []

      // Add depending on type filter
      if (this.typeFilter === -1) {
        for (let type_id of Object.keys(this.allMarkets)) {
          orders.concat(this.allMarkets[Number(type_id)])
        }
      } else {
        if (this.allMarkets.hasOwnProperty(this.typeFilter)) {
          orders = this.allMarkets[this.typeFilter]
        }
      }

      // Now filter by region
      if (this.regionFilter !== -1) {
        orders = orders.filter(order => {
          return order.region_id === this.regionFilter ? true : false
        })
      }

      // Finally, apply lowsec filter
      if (this.lowsecFilter) {
        orders = orders.filter(order => {
          // Show unknown locations, filter lowsec
          if (this.locations[order.location_id] && this.locations[order.location_id].solar_system.security_status < 0.45) {
            return false
          } else {
            return true
          }
        })
      }

      return orders
    }

    /* Returns regions for which we have stats available */
    get regionsByName () {
      let regionIDs : number[] = []

      let orderRegions = this.allMarkets[this.type_id].forEach((order) => {
        if (regionIDs.indexOf(order.region_id) === -1) {
          regionIDs.push(order.region_id)
        }
      })

      let regionsFromStore = this.statsForCurrentType.slice(0).forEach(stat => {
        if (regionIDs.indexOf(stat.region_id) === -1) {
          regionIDs.push(stat.region_id)
        }
      })

      let allRegions : LocationInfo[] = regionIDs
        .map((region_id) => { return this.locations[region_id] })
        .filter(region => region ? true : false)
        .sort((a, b) => {
          if (a && b) {
            return a.region.name.localeCompare(b.region.name)
          } else {
            return 0
          }
        })

      allRegions.unshift({
        region: {
          id: -1,
          name: "All Regions"
        }
      } as LocationInfo)

      return allRegions
    }

    typeName (type: TypeInfo) {
      return type ? type.name : ''
    }

    head () {
      const name = this.types[this.type_id] ? this.types[this.type_id].name + ' ' : ''

      return {
        title: name
      }
    }

    validate ({ params }: any) {
      return isValidIDSlug(params.type)
    }

    async fetch ({ store, params }: any) {
      const type_id: number = unslugID(params.type)
      user.commitSetTypeFilter(store, type_id)

      // Fire-off requests in parallel
      const typePromise = dispatchLoadType(store, type_id)
      const statisticsPromise = dispatchLoadStatisticsOfType(store, type_id)
      const marketPromise = dispatchLoadMarketOfType(store, type_id)

      // Await stats and market because we need the locations, type can wait till render
      await Promise.all([statisticsPromise, marketPromise])

      // Collect locations
      let locationIDs: number[] = []

      // We can't access getters here so we must duplicate code :(
      const relevantStats = Object.keys(readStatistics(store)).filter((key: string) => {
        return readStatistics(store)[key].type_id === type_id ? true : false
      }).map((validKey: string) => {
        return readStatistics(store)[validKey]
      })

      for (let stat of relevantStats) {
        locationIDs.push(stat.region_id)
      }

      if ((process as any).server) {
        // Fetch top 30 locations for bid / display
        readAllMarkets(store)[type_id]
          .filter(order => order.is_buy_order)
          .sort((a, b) => { return b.price - a.price })
          .slice(0, 30)
          .forEach(order => {
            locationIDs.push(order.location_id)

            if (locationIDs.indexOf(order.region_id) == -1) {
              locationIDs.push(order.region_id)
            }
          })

        // Fetch top 30 locations for ask / display
        readAllMarkets(store)[type_id]
          .filter(order => !order.is_buy_order)
          .sort((a, b) => { return a.price - b.price })
          .slice(0, 30)
          .forEach(order => {
            locationIDs.push(order.location_id)

            if (locationIDs.indexOf(order.region_id) == -1) {
              locationIDs.push(order.region_id)
            }
          })
      } else {
        // Load all locations
        readAllMarkets(store)[type_id]
          .forEach(order => {
            locationIDs.push(order.location_id)

            if (locationIDs.indexOf(order.region_id) == -1) {
              locationIDs.push(order.region_id)
            }
          })
      }

      const locationPromise = dispatchLoadLocations(store, locationIDs)

      // Render instantly in browser, wait when SSR
      if ((process as any).server) {
        await typePromise
        await locationPromise
      }
    }

    makeFavorite() {
      if (this.isFavorite) {
        user.commitDeleteFavoriteType(this.$store, this.type_id)
      } else {
        user.commitAddFavoriteType(this.$store, this.type_id)
      }
    }
  }
</script>

<style>
  .theme--dark .tabs__bar {
    background-color: rgba(0, 0, 0, 0);
  }
</style>