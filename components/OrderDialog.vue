<template>
  <v-dialog v-model="dialog" max-width="900">
    <v-card style="background-color: rgba(0,0,0,0.9);">
      <v-card-title class="headline">Order History</v-card-title>
      <v-card-text>
        <v-tabs fixed-tabs>
          <v-tabs-slider color="primary"></v-tabs-slider>
          <v-tab>Graph</v-tab>
          <v-tab>Table</v-tab>
          <v-tab-item>
            <div id="ordergraph"></div>
          </v-tab-item>
          <v-tab-item>
            <v-data-table
              :headers="headers"
              :items="orderHistory"
              :rows-per-page-items="[10,25,50,{'text':'All','value':-1}]"
              :pagination.sync="paginationSyncer"
              item-key="order_id"
              rows-per-page-text="Orders per page: "
            >
              <template slot="items" slot-scope="props">
                <tr>
                  <td>{{ props.item.seen_at | moment("lll") }}</td>
                  <td class="text-xs-right">{{ formatISK(props.item.price) }}</td>
                  <td class="text-xs-right">
                    <span>{{ formatNumber(props.item.volume_remain) + '/' + formatNumber(props.item.volume_total) + ' [' + formatNumber(props.item.min_volume) + ']' }}</span>
                  </td>
                </tr>
              </template>
            </v-data-table>
          </v-tab-item>
        </v-tabs>
      <span class="grey--text"><i>Data is collected every 5 minutes.</i></span>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" flat @click.native="dialog = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop, Watch } from 'vue-property-decorator'

  import Highcharts from 'highcharts/highstock'
  import { highchartsTheme } from '../util/chartHelpers'
  if ((process as any).browser) {
    require('highcharts/highcharts-more')(Highcharts)
  }

  import { numberMixin } from '../util/formatting'
  import { readSelectedOrder, readOrderHistory, commitSetSelectedOrder, orderHistory } from '../store/modules/orderHistory'

  import Loader from './Loader.vue'

  @Component({
    components: { Loader },
    mixins: [numberMixin]
  })
  export default class OrderDialog extends Vue {
    dialog = false
    chart: any

    paginationSyncer = {
      descending: true,
      sortBy: 'seen_at'
    }

    headers = [
      { text: 'Seen At', align: 'left', value: 'seen_at', sortable: false},
      { text: 'Price', align: 'right', value: 'price', sortable: false},
      { text: 'Quantity', align: 'right', value: 'volume_remain', sortable: false }
    ]

    get selectedOrder() {
      return readSelectedOrder(this.$store)
    }

    get orderHistory() {
      return readOrderHistory(this.$store)
    }

    @Watch('selectedOrder', { immediate: true })
    onSelectedOrderChanged (selectedOrder: number, oldSelectedOrder: number) {
      if (selectedOrder !== -1) {
        this.dialog = true
        this.renderChart()
      }
    }

    @Watch('dialog', { immediate: true })
    onDialogChanged (newDialog: boolean, oldDialog: boolean) {
      if (newDialog === false) {
        commitSetSelectedOrder(this.$store, -1)
      }
    }

    /** Prepare data and render chart */
    renderChart () {
      let groupingUnits, plotData, seriesPlots

      // Use utility function for preparing series data
      plotData = {
        price: this.orderHistory.map((order: any) => { return [Date.parse(order.seen_at), order.price] }),
        volEntered: this.orderHistory.map((order: any) => { return [Date.parse(order.seen_at), order.volume_total] }),
        volRemaining: this.orderHistory.map((order: any) => { return [Date.parse(order.seen_at), order.volume_remain] }),
      }

      seriesPlots = []
      groupingUnits = [['day', [1, 7]], ['week', [1, 2, 3, 4]]]

      // Add series to graph
      seriesPlots.push({
        type: 'line',
        animation: true,
        name: 'Price',
        data: plotData.price,
        color: '#ff8800',
        marker: { enabled: true, radius: 3, symbol: 'square' },
        dataGrouping: {
          units: groupingUnits
        },
        yAxis: 0
      } as any)

      seriesPlots.push({
        type: 'line',
        animation: true,
        name: 'Remaining Volume',
        color: '#2a9fd6',
        marker: { enabled: true, radius: 3, symbol: 'triangle' },
        data: plotData.volRemaining,
        dataGrouping: {
          units: groupingUnits
        },
        yAxis: 1
      } as any)

      seriesPlots.push({
        type: 'line',
        animation: true,
        name: 'Entered Volume',
        color: '#333333',
        marker: { enabled: true, radius: 3, symbol: 'triangle' },
        data: plotData.volEntered,
        dataGrouping: {
          units: groupingUnits
        },
        yAxis: 1
      } as any)

      // Set theme
      Highcharts.setOptions(highchartsTheme)

      // Draw graph
      this.chart = new Highcharts.StockChart({
        chart: {
          renderTo: 'ordergraph',
          animation: true
        },
        plotOptions: {
          series: {
            connectNulls: false
          }
        },
        rangeSelector: {
          enabled: false
        },
        scrollbar: {
          enabled: false
        },
        navigator: {
          enabled: false
        },
        exporting: {
          enabled: false
        },
        tooltip: {
          valueDecimals: 2,
          headerFormat: '{point.key}<br />'
        },
        xAxis: [
          {
            ordinal: false
          } as any
        ],
        yAxis: [
          {
            gridLineWidth: 0,
            lineWidth: 0,
            height: 300,
            opposite: false,
            labels: {
              enabled: true
            }
          } as any, {
            gridLineWidth: 0,
            lineWidth: 0,
            height: 300,
            opposite: true,
            labels: {
              enabled: true
            }
          } as any
        ],
        series: seriesPlots
      })
    }
  }
</script>