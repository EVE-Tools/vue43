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
          <span itemprop="name">Ask/Sell</span>
        </a>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
    <market-table :paginate="true" :orders="orderedOrders" :ascending="true"></market-table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  import { Order } from '../../../store/modules/markets'
  import { TypeInfo } from '../../../store/modules/types'

  import MarketTable from '~/components/MarketTable.vue'

  /** Display a sorted table of all ask orders passed via prop  */
  @Component({
    components: {
      MarketTable
    }
  })
  export default class QuicklookAsk extends Vue {
    @Prop()
    type: TypeInfo

    @Prop()
    orders: Order[]

    get iconURL () {
      return 'https://image.eveonline.com/Type/' + this.type.type_id + '_64.png'
    }

    get orderedOrders () {
      if (this.orders) {
        return this.orders.filter((order) => { return order.is_buy_order === false })
          .sort((a, b) => { return a.price - b.price })
      } else {
        return []
      }
    }

    head () {
      return {
        title: this.type ? this.type.name + ' Ask/Sell Orders' : 'Ask/Sell Orders',
        meta: [{
          hid: 'description',
          name: 'description',
          content: (this.type ? this.type.name + ' - ' : '') + 'Real-time ask/sell orders and prices in EVE Online on Element43.'
        }]
      }
    }
  }
</script>

<style lang="css">
  ol {
    display: none;
  }
</style>
