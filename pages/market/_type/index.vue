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
           itemprop="item" :href="this.$route.path">
          <span itemprop="name">{{ type.name }}</span>
          <img itemprop="image" :src="iconURL" :alt="type.name"/></a>
        <meta itemprop="position" content="2" />
      </li>
      ›
      <li itemprop="itemListElement" itemscope
          itemtype="https://schema.org/ListItem">
        <a itemscope itemtype="https://schema.org/Thing">
          <span itemprop="name">Overview</span>
        </a>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
    <section>
      <region-graph v-if="regionFilter !== -1" :region_id="regionFilter" :type_id="type_id"></region-graph>
      <region-graph v-else region_id="10000002" :type_id="type_id"></region-graph>
      <market-stats :orders="orders"></market-stats>
    </section>
    <section>
      <h2>Top Bid</h2>
      <market-table :orders="topBid" :paginate="false" :ascending="false"></market-table>
    </section>
    <section>
      <h2>Top Ask</h2>
      <market-table :orders="topAsk" :paginate="false" :ascending="true"></market-table>
    </section>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  import MarketStats from '~/components/MarketStats.vue'
  import MarketTable from '~/components/MarketTable.vue'
  import RegionGraph from '~/components/RegionGraph.vue'

  import { unslugID } from '../../../util/slug'
  import { numberMixin } from '../../../util/formatting'

  import { Statistics } from '../../../store/modules/marketStats'
  import { Order } from '../../../store/modules/markets'
  import { TypeInfo } from '../../../store/modules/types'
  import { readLocations, dispatchLoadLocations } from '../../../store/modules/locations'

  /** Display useful information about a type's market */
  @Component({
    mixins: [numberMixin],
    components: {
      MarketStats,
      MarketTable,
      RegionGraph
    }
  })
  export default class QuicklookOverview extends Vue {
    @Prop()
    type: TypeInfo

    @Prop()
    typeStats: Statistics[]

    @Prop()
    orders: Order[]

    @Prop()
    regionFilter: number

    get type_id () {
      return this.type.type_id
    }

    get iconURL () {
      return 'https://image.eveonline.com/Type/' + this.type_id + '_64.png'
    }

    get topRegionIDsByISKVolume () {
      return this.typeStats.sort((a, b) => b.week_isk_volume_average - a.week_isk_volume_average).slice(0, 4).map((region) => region.region_id)
    }

    get topBid () {
      if (this.orders) {
        return this.orders.filter((order) => { return order.is_buy_order === true })
          .sort((a, b) => { return b.price - a.price })
          .splice(0, 5)
      } else {
        return []
      }
    }

    get topAsk () {
      if (this.orders) {
        return this.orders
          .filter((order) => { return order.is_buy_order === false })
          .sort((a, b) => { return a.price - b.price })
          .splice(0, 5)
      } else {
        return []
      }
    }

    typeDescription () {
      return this.type ? this.type.description.replace(/<{1}[^<>]{1,}>{1}/g, '') : ''
    }

    head () {
      const name = this.type ? this.type.name + ' ' : ''

      return {
        title: name + 'Market Overview, Prices and History' || '',
        meta: [{
          hid: 'description',
          name: 'description',
          content: name + 'market overview, real-time prices and price history in EVE Online on Element43.'
        }]
      }
    }
  }
</script>

<style lang="css" scoped>
  ol {
    display: none;
  }
</style>
