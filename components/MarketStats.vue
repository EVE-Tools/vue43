<template lang="html">
  <v-layout justify-space-around row class="stats text-xs-center">
    <v-flex md1>
      <div class="value">
        {{ abbreviateNumber(bestBid, 2) }} ISK
      </div>
      <div class="annotation">
        Top Bid
      </div>
    </v-flex>
    <v-flex md1>
      <div class="value">
        {{ abbreviateNumber(bestAsk, 2) }} ISK
      </div>
      <div class="annotation">
        Top Ask
      </div>
    </v-flex>
    <v-flex md1>
      <div class="value">
        {{ abbreviateNumber(bestAsk - bestBid, 2) }} ISK
      </div>
      <div class="annotation">
        Abs. Spread
      </div>
    </v-flex>
    <v-flex md1>
      <div v-if="bestAsk > 0" class="value">
        {{ abbreviateNumber(((bestAsk - bestBid) / bestAsk) * 100, 2) }} %
      </div>
      <div v-else class="value">
        0.00 %
      </div>
      <div class="annotation">
        Rel. Spread
      </div>
    </v-flex>
    <v-flex md1>
      <div class="value">
        {{ abbreviateNumber(supplyVolISK) }} ISK
      </div>
      <div class="annotation">
        Supply
      </div>
    </v-flex>
    <v-flex md1>
      <div class="value">
        {{ abbreviateNumber(demandVolISK) }} ISK
      </div>
      <div class="annotation">
        Demand
      </div>
    </v-flex>
    <v-flex md1>
      <div class="value">
        {{ formatNumber(numOrders) }}
      </div>
      <div class="annotation">
        Orders
      </div>
    </v-flex>
    <v-flex md1>
      <div class="value">
        {{ numRegions }}
      </div>
      <div class="annotation">
        Regions
      </div>
    </v-flex>
    <v-flex md1>
      <div class="value">
        {{ numStations }}
      </div>
      <div class="annotation">
        Stations
      </div>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop, Watch } from 'vue-property-decorator'

  import _ from 'lodash'
  import { numberMixin } from '../util/formatting'
  import { Order } from '../store/modules/markets'

  /** Display various statistics about a list of orders, math should be self-explanatory */
  @Component({
    mixins: [numberMixin]
  })
  export default class MarketStats extends Vue {
    numOrders: number = 0
    numRegions: number = 0
    numStations: number = 0
    supplyVolISK: number = 0.0
    supplyLot: number = 1
    demandVolISK: number = 0.0
    demandLot: number = 1
    bestBid: number = 0
    bestAsk: number = 0

    @Prop()
    orders: Order[]

    @Watch('orders')
    onOrdersChanged (_orders: Order[], _oldOrders: Order[]) {
      this.calculateMetrics()
    }

    created () {
      this.calculateMetrics()
    }

    calculateMetrics () {
      let orders = this.orders
      if (orders) {
        this.numOrders = orders.length
        this.numRegions = Object.keys(_.groupBy(orders, (order) => order.region_id)).length
        this.numStations = Object.keys(_.groupBy(orders, (order) => order.location_id)).length

        let bids = orders.filter((order) => { return order.is_buy_order })
        let asks = orders.filter((order) => { return !order.is_buy_order })

        this.supplyVolISK = asks.reduce((accumulator, current) => {
          return accumulator + (current.price * current.volume_remain)
        }, 0.0)
        this.supplyLot = asks.reduce((accumulator, current) => {
          return accumulator + current.volume_remain
        }, 0)
        this.demandVolISK = bids.reduce((accumulator, current) => {
          return accumulator + (current.price * current.volume_remain)
        }, 0.0)
        this.demandLot = bids.reduce((accumulator, current) => {
          return accumulator + current.volume_remain
        }, 0)
        this.bestBid = bids.reduce((accumulator, current) => {
          return current.price > accumulator ? current.price : accumulator
        }, bids.length > 0 ? bids[0].price : 0)
        this.bestAsk = asks.reduce((accumulator, current) => {
          return current.price < accumulator ? current.price : accumulator
        }, asks.length > 0 ? asks[0].price : 0)
      }
    }
  }
</script>

<style lang="css" scoped>
  .stats {
    padding-top: 1em;
    padding-bottom: 1em;
  }

  .value {
    font-size: 1.2em;
    padding-bottom: 0;
  }

  .annotation {
    text-transform: uppercase;
    color: #555;
    font-weight: bold;
  }
</style>
