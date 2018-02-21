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
          <span itemprop="name">Bid/Buy</span>
        </a>
        <meta itemprop="position" content="3" />
      </li>
    </ol>
    <market-table :paginate="true" :orders="orderedOrders"  :ascending="false"></market-table>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  import { Order } from '../../../store/modules/markets'
  import { TypeInfo } from '../../../store/modules/types'

  import MarketTable from '~/components/MarketTable.vue'

  /** Display a sorted table of all bid orders passed via prop  */
  @Component({
    components: {
      MarketTable
    }
  })
  export default class QuicklookBid extends Vue {
    @Prop()
    type: TypeInfo

    @Prop()
    orders: Order[]

    get iconURL () {
      return 'https://image.eveonline.com/Type/' + this.type.type_id + '_64.png'
    }

    get orderedOrders () {
        if (this.orders) {
          return this.orders.filter((order) => { return order.is_buy_order === true })
            .sort((a, b) => { return b.price - a.price })
        } else {
          return []
        }
      }

    head () {
      const name = this.type ? this.type.name + ' ' : ''

      return {
        title: name + 'Bid/Buy Orders',
        meta: [{
          hid: 'description',
          name: 'description',
          content: name + 'Real-time bid/buy orders and prices in EVE Online on Element43.'
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
