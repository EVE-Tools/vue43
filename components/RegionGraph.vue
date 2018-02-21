<template lang="html">
  <div class="chart">
    <loader v-if="loading && !this.failed"></loader>
    <loader v-if="loading && this.failed && this.retries <= 3" retry="true"></loader>
    <loader v-if="loading && this.failed && this.retries > 3" failed="true"></loader>
    <div :class="{ hide: loading }" class="history-graph" :id="graphName"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop, Watch } from 'vue-property-decorator'

  import Highcharts from 'highcharts/highstock'
  import {parseHistoryData, highchartsTheme} from '../util/chartHelpers'
  if ((process as any).browser) {
    require('highcharts/highcharts-more')(Highcharts)
  }

  import Loader from './Loader.vue'
  import { readLocations } from '../store/modules/locations'
  import { readHistory, dispatchLoadMarketHistory } from '../store/modules/marketHistory'

  /** Display a graph representing historic price data in a region. Automatically retries to draw up to three times on error */
  @Component({
    components: {
      Loader
    }
  })
  export default class RegionGraph extends Vue {
    @Prop()
    region_id: number

    @Prop()
    type_id: number

    @Watch('region_id', { immediate: true })
    onChangeRegionID (_oldID: number, _newID: number) {
      this.loadChart()
    }

    @Watch('type_id', { immediate: true })
    onChangeTypeID (_oldID: number, _newID: number) {
      this.loadChart()
    }

    created () {
      this.loadChart()
    }

    loading: boolean = true
    failed: boolean = false
    chart: any
    retries: number = 0

    get key () {
      return this.region_id + '-' + this.type_id
    }

    get graphName () {
      return 'graph-' + this.key
    }

    get history () {
      return readHistory(this.$store)[this.key]
    }

    get location () {
      return readLocations(this.$store)[this.region_id]
    }

    /** Trigger data fetching and render chart. Retry up to three times if needed. */
    async loadChart () {
      if ((process as any).browser) {
        this.loading = true
        this.failed = false

        try {
          await dispatchLoadMarketHistory(this.$store, {region_id: this.region_id, type_id: this.type_id})
          this.loading = false
          this.renderChart()
          this.retries = 0
        } catch (error) {
          this.loading = true
          this.failed = true
          console.error(error)

          if (this.retries < 3){
            this.retries = this.retries + 1
            setTimeout(this.loadChart, 1000)
          }
          return
        }
      }
    }

    /** Prepare data and render chart */
    renderChart () {
      let groupingUnits, plotData, seriesPlots

      // Use utility function for preparing series data
      plotData = parseHistoryData(this.history)

      seriesPlots = []
      groupingUnits = [['day', [1, 7]], ['week', [1, 2, 3, 4]]]

      // Add series to graph
      seriesPlots.push({
        type: 'areasplinerange',
        animation: true,
        color: '#222',
        name: 'Donchian Channel',
        data: plotData.donchian,
        dataGrouping: {
          units: groupingUnits
        }
      } as any)

      seriesPlots.push({
        type: 'spline',
        animation: true,
        color: '#999',
        name: 'Moving Weighted Average Week',
        dataGrouping: {
          units: groupingUnits
        },
        data: plotData.movingAverageWeek
      } as any)

      seriesPlots.push({
        type: 'line',
        animation: true,
        color: '#ff8800',
        name: 'Average Price',
        data: plotData.average,
        dataGrouping: {
          units: groupingUnits
        }
      } as any)

      seriesPlots.push({
        type: 'column',
        animation: true,
        color: '#2a9fd6',
        name: 'Volume',
        data: plotData.volume,
        dataGrouping: {
          units: groupingUnits
        },
        yAxis: 1
      })

      seriesPlots.push({
        type: 'column',
        animation: true,
        color: '#222',
        name: 'Order Count',
        data: plotData.orderCount,
        dataGrouping: {
          units: groupingUnits
        },
        yAxis: 2
      })

      // Set theme
      Highcharts.setOptions(highchartsTheme)

      // Draw graph
      this.chart = new Highcharts.StockChart({
        chart: {
          renderTo: this.graphName,
          animation: true
        },
        plotOptions: {
          series: {
            connectNulls: false
          }
        },
        rangeSelector: {
          selected: 2,
          inputEnabled: false
        },
        exporting: {
          enabled: false
        },
        tooltip: {
          valueDecimals: 2,
          headerFormat: (this.location ? this.location.region.name : 'Region #' + this.region_id ) + ' {point.key}<br />'
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
              enabled: false
            }
          } as any, {
            gridLineWidth: 0,
            lineWidth: 0,
            top: 300,
            height: 80,
            offset: 0,
            opposite: false,
            labels: {
              enabled: false
            }
          } as any, {
            gridLineWidth: 0,
            lineWidth: 0,
            top: 300,
            height: 80,
            offset: 0,
            opposite: true,
            labels: {
              enabled: false
            }
          } as any
        ],
        series: seriesPlots
      })
    }
  }
</script>

<style lang="css" scoped>
  .chart {
    height: 30em;
  }

  .hide {
    visibility: hidden;
  }

  .history-graph {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>
