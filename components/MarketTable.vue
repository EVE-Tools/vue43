<template lang="html">
  <v-data-table
      :headers="headers"
      :items="orders"
      :rows-per-page-items="[15,50,100,{'text':'All','value':-1}]"
      :hide-actions="!paginate"
      :pagination.sync="paginationSyncer"
      item-key="order_id"
      rows-per-page-text="Orders per page: "
    >
    <template slot="items" slot-scope="props">
      <tr @click="showDialogForOrder(props.item.order_id)" class="orderrow">
        <td v-if="locations[props.item.location_id]" style="max-width: 100px;">
            <span>{{ locations[props.item.location_id].region.name }}</span>
        </td>
        <td v-else><span>Unknown region</span></td>
        <td v-if="locations[props.item.location_id]">
            <span :class="secClass(props.item.location_id)">• {{ trueSec(props.item.location_id) }}&thinsp; </span>
            <span>{{ locations[props.item.location_id].station.name }}</span>
        </td>
        <td v-else>• -.- Unknown - {{ props.item.location_id }}</td>
        <td class="text-xs-right">{{ formatISK(props.item.price) }}</td>
        <td class="text-xs-right">
          <v-tooltip right color="black">
            <span slot="activator">
              <span>{{ abbreviateNumber(props.item.volume_remain) }}</span>
              <span v-if="props.item.min_volume != 1">
                [{{ abbreviateNumber(props.item.min_volume) }}]
              </span>
            </span>
            <span>{{ formatNumber(props.item.volume_remain) + '/' + formatNumber(props.item.volume_total) + ' [' + formatNumber(props.item.min_volume) + ']' }}</span>
          </v-tooltip>
        </td>
        <td class="text-xs-right">{{ props.item.seen_at | moment("from") }}</td>
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop, Watch } from 'vue-property-decorator'

  import { numberMixin, securityMixin } from '../util/formatting'
  import OrderDialog from './OrderDialog.vue'
  import { Order } from '../store/modules/markets'
  import { readLocations, dispatchLoadLocations } from '../store/modules/locations'
  import { dispatchLoadOrderHistory } from '../store/modules/orderHistory'

  /** A generic table for displaying orders. Optionally supports pagination. */
  @Component({
    mixins: [numberMixin, securityMixin]
  })
  export default class MarketTable extends Vue {
    @Prop()
    orders: Order[]

    @Prop()
    paginate: boolean

    @Prop()
    ascending: boolean

    paginationSyncer = {
      descending: !this.ascending,
      sortBy: 'price'
    }

    headers = [
      {
        text: 'Region',
        align: 'left',
        sortable: false
      },
      {
        text: 'Location',
        align: 'left',
        sortable: false
      },
      { text: 'Price', align: 'right', value: 'price' },
      { text: 'Quantity', align: 'right', value: 'volume_remain' },
      { text: 'Last Change', align: 'right', value: 'seen_at' }
    ]

    get locations() {
      return readLocations(this.$store)
    }

    @Watch('orders', { immediate: true })
    onOrdersChanged (orders: Order[], oldOrders: Order[]) {
      if (this.orders && this.orders.length > 0) {
        this.fetchTableLocations()
      }
    }

    fetchTableLocations () {
      let locationIDs = []

      locationIDs = this.orders.map((order) => { return order.location_id })

      return dispatchLoadLocations(this.$store, locationIDs)
    }

    showDialogForOrder(orderID: number) {
      dispatchLoadOrderHistory(this.$store, orderID)
    }
  }
</script>

<style>
  tr.orderrow {
    cursor: pointer;
  }
</style>
