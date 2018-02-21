<template lang="html">
  <v-container grid-list-md>
    <h1>Top Stations in EVE Online</h1>
    <v-layout row>
      <v-flex offset-md10 md2>
        <v-switch
          v-model="citadelsOnly"
          label="Citadels Only"
        ></v-switch>
      </v-flex>
    </v-layout>
    <v-data-table
      :headers="headers"
      :items="topStations"
      :rows-per-page-items="[15,50,100,{'text':'All','value':-1}]"
      :pagination.sync="pagination"
      rows-per-page-text="Stations per page: "
    >
      <template slot="items" slot-scope="props">
        <td v-if="locations[props.item.id]">
          <span :class="secClass(props.item.id)">• {{ trueSec(props.item.id) }}&thinsp;</span>
          <span>{{ locations[props.item.id].region.name}} -&thinsp;</span>
          <span>{{ locations[props.item.id].station.name }}</span>
        </td>
        <td v-else>• -.- Unknown - {{ props.item.id }}</td>
        <td class="text-xs-right">{{ abbreviateNumber(props.item.bid_volume) }} ISK</td>
        <td class="text-xs-right" v-if="props.item.ask_volume">{{ abbreviateNumber(props.item.ask_volume) }} ISK</td>
        <td class="text-xs-right" v-else>-</td>
        <td class="text-xs-right">{{ abbreviateNumber(props.item.total_volume) }} ISK</td>
        <td class="text-xs-right">{{ formatNumber(props.item.total_orders) }}</td>
      </template>
    </v-data-table>
    <span>Updated hourly.</span>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'

  import { numberMixin, securityMixin } from '../../../util/formatting'

  import { readStations, dispatchLoadStations } from '../../../store/modules/stations'
  import { readLocations, dispatchLoadLocations } from '../../../store/modules/locations'

  /** Display a ranking table for all stations in EVE */
  @Component({
    mixins: [numberMixin, securityMixin]
  })
  export default class Ranking extends Vue {
    citadelsOnly: boolean = false
    transition = 'overlay-fade'
    headers = [
      {
        text: 'Name',
        align: 'left',
        sortable: false
      },
      { text: 'Bid Volume', align: 'right', value: 'bid_volume' },
      { text: 'Ask Volume', align: 'right', value: 'ask_volume' },
      { text: 'Total Volume', align: 'right', value: 'total_volume' },
      { text: 'Number of Orders', align: 'right', value: 'total_orders' }
    ]

    pagination = {
      descending: true,
      sortBy: 'total_orders'
    }

    get stations () {
      return readStations(this.$store)
    }

    get locations () {
      return readLocations(this.$store)
    }

    get topStations () {
      if (this.citadelsOnly) {
        const stations = this.stations.filter((station) => {
          return station.id > 1000000000000
        })

        const location_ids = stations.map((station) => { return station.id })

        if (location_ids && location_ids.length > 0) {
          dispatchLoadLocations(this.$store, location_ids)
        }

        return stations
      } else {
        return this.stations.sort((a, b) => { return b.total_orders - a.total_orders }).slice(0, 100)
      }
    }

    head () {
      return {
        title: 'Top Stations in EVE Online',
        meta: [{
          hid: 'description',
          name: 'description',
          content: 'Top citadels and stations in EVE Online. Economic ranking on Element43.'
        }]
      }
    }

    async fetch ({ store }: any) {
      await dispatchLoadStations(store)
      const location_ids = readStations(store).sort((a, b) => { return b.total_orders - a.total_orders }).slice(0, 100).map((station) => {
        return station.id
      })
      await dispatchLoadLocations(store, location_ids)
    }
  }
</script>