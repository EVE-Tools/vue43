<template lang="html">
  <div>
    <ol itemscope itemtype="https://schema.org/BreadcrumbList">
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemscope itemtype="https://schema.org/Thing"
           itemprop="item">
            <span itemprop="name">Market</span>
        </a>
        <meta itemprop="position" content="1" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemscope itemtype="https://schema.org/Thing"
           itemprop="item">
          <span itemprop="name">{{ type.name }}</span>
          <img itemprop="image" :src="iconURL" :alt="type.name"/></a>
        <meta itemprop="position" content="2" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemscope itemtype="https://schema.org/Thing" :href="this.$route.path">
          <span itemprop="name">Regions</span>
        </a>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
    <v-data-table
      :headers="headers"
      :items="typeStats"
      :hide-actions="true"
      :pagination.sync="pagination"
      item-key="region_id"
      rows-per-page-text="Orders per page: "
    >
      <template slot="items" slot-scope="props">
        <td v-if="locations[props.item.region_id]">
          {{ locations[props.item.region_id].region.name }}
        </td>
        <td v-else> Unknown Region - {{ props.item.region_id }}</td>
        <td class="text-xs-right">
          <span>{{ abbreviateNumber(props.item.current_stats.average, 2) }} ISK</span>
          <span v-if="props.item.current_stats.average > props.item.week_price_weighted_average" class="green--text">&thinsp;▲</span>
          <span v-else-if="props.item.current_stats.average < props.item.week_price_weighted_average" class="red--text">&thinsp;▼</span>
          <span v-else>&thinsp;⇨</span>
        </td>
        <td class="text-xs-right">
          <span v-if="(props.item.current_stats.average - props.item.week_price_weighted_average) > 0" class="mono green--text">+{{ abbreviateNumber(props.item.current_stats.average - props.item.week_price_weighted_average, 2) }}</span>
          <span v-else-if="(props.item.current_stats.average - props.item.week_price_weighted_average) < 0" class="mono red--text">-{{abbreviateNumber(Math.abs(props.item.current_stats.average - props.item.week_price_weighted_average), 2) }}</span>
        </td>
        <td v-if="orderStats[props.item.region_id] && orderStats[props.item.region_id].topAsk !== -1" class="text-xs-right">{{ abbreviateNumber(orderStats[props.item.region_id].topAsk, 2) }} ISK</td>
        <td v-else class="text-xs-right">-</td>
        <td v-if="orderStats[props.item.region_id] && orderStats[props.item.region_id].topBid !== -1" class="text-xs-right">{{ abbreviateNumber(orderStats[props.item.region_id].topBid, 2) }} ISK</td>
        <td v-else class="text-xs-right">-</td>
        <td v-if="orderStats[props.item.region_id] && orderStats[props.item.region_id].relativeSpread !== -1 && orderStats[props.item.region_id].relativeSpread != NaN && orderStats[props.item.region_id].topAsk !== -1 && orderStats[props.item.region_id].topBid !== -1" class="text-xs-right" :data-tooltip="abbreviateNumber(orderStats[props.item.region_id].spread, 2) + ' ISK'">{{ abbreviateNumber(orderStats[props.item.region_id].relativeSpread * 100, 2) }} %</td>
        <td v-else class="text-xs-right">-</td>
        <td v-if="props.item.week_volume_relative_standard_deviation < 0.2" class="text-xs-right green--text">{{ abbreviateNumber(props.item.week_volume_relative_standard_deviation * 100, 2) }} %</td>
        <td v-else-if="props.item.week_volume_relative_standard_deviation > 0.5" class="text-xs-right red--text">{{ abbreviateNumber(props.item.week_volume_relative_standard_deviation * 100, 2) }} %</td>
        <td v-else class="text-xs-right">{{ abbreviateNumber(props.item.week_volume_relative_standard_deviation * 100, 2) }} %</td>
        <td class="text-xs-right tooltip" :data-tooltip="abbreviateNumber(props.item.week_isk_volume_average) + ' ISK'">{{ abbreviateNumber(props.item.week_volume_average) }}</td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop, Watch } from 'vue-property-decorator'

  import { unslugID } from '../../../util/slug'
  import { numberMixin } from '../../../util/formatting'
  import { Statistics } from '../../../store/modules/marketStats'
  import { TypeInfo } from '../../../store/modules/types'
  import { Order } from '../../../store/modules/markets'
  import { readLocations, dispatchLoadLocations } from '../../../store/modules/locations'

  interface OrderStatistics {
    topBid: number,
    topAsk: number,
    spread: number,
    relativeSpread: number
  }

  interface OrderStatMap {
    [region_id: number]: OrderStatistics
  }

  /** Show stats of a type's market in all regions where there is a market for this type */
  @Component({
    mixins: [numberMixin]
  })
  export default class QuicklookRegions extends Vue {
    orderStats: OrderStatMap = { }

    @Prop()
    typeStats: Statistics[]

    @Prop()
    type: TypeInfo

    @Prop()
    orders: Order[]

    pagination = {
      descending: true,
      sortBy: 'week_isk_volume_average',
      rowsPerPage: 500
    }

    headers = [
      {
        text: 'Region',
        align: 'left',
        sortable: false
      },
      { text: 'Average Price', align: 'right', value: 'week_price_weighted_average' },
      { text: '', align: 'right', sortable: false },
      { text: 'Top Ask', align: 'right', sortable: false },
      { text: 'Top Bid', align: 'right', sortable: false },
      { text: 'Rel. Spread', align: 'right', sortable: false },
      { text: 'Volatility (Volume)', align: 'right', value: 'week_volume_relative_standard_deviation' },
      { text: 'Avg. Daily Volume', align: 'right', value: 'week_isk_volume_average' },
    ]

    @Watch('orders', { immediate: true })
    onOrderUpdate (orders: Order[], _oldOrders: Order[]) {
      // Calculates stats
      if (orders.length > 0) {
        // Get top bid/ask
        for (let order of orders) {
          if (!(order.region_id in this.orderStats)) {
            this.orderStats[order.region_id] = {
              topBid: -1,
              topAsk: -1,
              spread: -1,
              relativeSpread: -1
            }
          }

          if (order.is_buy_order) {
            // Bid
            if (this.orderStats[order.region_id].topBid === -1) {
              this.orderStats[order.region_id].topBid = order.price
            } else if (order.price > this.orderStats[order.region_id].topBid) {
              this.orderStats[order.region_id].topBid = order.price
            }
          } else {
            // Ask
            if (this.orderStats[order.region_id].topAsk === -1) {
              this.orderStats[order.region_id].topAsk = order.price
            } else if (order.price < this.orderStats[order.region_id].topAsk) {
              this.orderStats[order.region_id].topAsk = order.price
            }
          }
        }

        // Calculate spreads
        for (let market in this.orderStats) {
          const topBid = this.orderStats[market].topBid
          const topAsk = this.orderStats[market].topAsk

          this.orderStats[market].spread = topAsk - topBid
          this.orderStats[market].relativeSpread = (topAsk - topBid) / topAsk
        }
      }
    }

    get locations () {
      return readLocations(this.$store)
    }

    get iconURL () {
      return 'https://image.eveonline.com/Type/' + this.type.type_id + '_64.png'
    }

    head () {
      return {
        title: this.type ? this.type.name + ' Region Overview' : 'Region Overview',
        meta: [{
          hid: 'description',
          name: 'description',
          content: (this.type ? this.type.name + ' - ' : '') + 'Global trends and prices in EVE Online on Element43.'
        }]
      }
    }
}
</script>

<style lang="scss" scoped>
  ol {
    display: none;
  }
</style>
