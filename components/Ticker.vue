<template lang="html">
  <div class="ticker-wrapper hidden-sm-and-down" v-if="visible">
    <div class="ticker">
      <div v-for="type_id in type_ids" v-if="statsLoaded(type_id) && types[type_id]" class="ticker-item">
        <img class="ticker-icon" :src="iconURL(type_id)" alt="market ticker icon"/>
        <router-link :to="{ name: 'market-type', params: { type: slug(type_id, types[type_id].name) }}">{{types[type_id].name}}</router-link>
        <span v-if="trend(type_id) > 0" class="green--text">▲</span>
        <span v-if="trend(type_id) < 0" class="red--text">▼</span>
        <span>{{ abbreviateNumber(currentPrice(type_id), 2) }}</span>
        <span v-if="movement(type_id) > 0" class="green--text">+{{ abbreviateNumber(movement(type_id), 2) }}</span>
        <span v-if="movement(type_id) == 0">0.00</span>
        <span v-if="movement(type_id) < 0" class="red--text">{{ abbreviateNumber(movement(type_id), 2) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'
  import { numberMixin } from '../util/formatting'
  import { slugifyID } from '../util/slug'

  import { TypeInfo, readTypes } from '../store/modules/types'
  import { readStatistics } from '../store/modules/marketStats'
  import { setTimeout } from 'timers';

  /** A pretty ticker for the landing page */
  @Component({
    mixins: [numberMixin]
  })
  export default class Ticker extends Vue {
    @Prop()
    region_id: number

    @Prop()
    type_ids: number[]

    visible = false

    get marketStats () {
      return readStatistics(this.$store)
    }

    get types () {
      return readTypes(this.$store)
    }

    mounted () {
      setTimeout(() => { this.visible = true }, 1000)
    }

    typeName (type: TypeInfo) {
      return type ? type.name : ''
    }

    iconURL (type_id: number) {
      return 'https://image.eveonline.com/Type/' + type_id + '_64.png'
    }

    statsLoaded (type_id: number) {
      if (this.marketStats[this.region_id + '-' + type_id]) {
        return true
      }

      return false
    }

    currentPrice (type_id: number) {
      return this.marketStats[this.region_id + '-' + type_id].current_stats.average
    }

    movement (type_id: number) {
      return this.marketStats[this.region_id + '-' + type_id].current_stats.average - this.marketStats[this.region_id + '-' + type_id].previous_stats.average
    }

    trend (type_id: number) {
      return this.marketStats[this.region_id + '-' + type_id].current_stats.average - this.marketStats[this.region_id + '-' + type_id].week_price_weighted_average
    }

    slug (type_id: number, typeName: string) {
      return slugifyID(type_id, typeName)
    }
  }
</script>

<style lang="scss" scoped>
@keyframes ticker-load {
    0% {
        transform: translate3d(0, 100%, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}

// Thanks to Lewis Carey!
@keyframes ticker {
    0% {
        transform: translate3d(0, 0, 0);
        visibility: visible;
    }
    100% {
        transform: translate3d(-100%, 0, 0);
    }
}

.ticker-wrapper {
    position: fixed;
    bottom: 0;
    width: 100%;
    overflow: hidden;
    height: 2em;
    background-color: rgba(#000, 0.8);
    padding-left: 100%;

    animation-timing-function: linear;
    animation-name: ticker-load;
    animation-duration: 0.4s;
}

.ticker-icon {
    width: 1.5em;
    height: 1.5em;
    vertical-align: middle;
    padding-right: 0.2em;
}

.ticker {
    display: inline-block;
    height: 2em;
    line-height: 2em;
    white-space: nowrap;
    padding-right: 100%;
    animation-iteration-count: infinite;
    animation-timing-function: linear;
    animation-name: ticker;
    animation-duration: 60s;
    animation-delay: -15s;

    &:hover {
      animation-play-state: paused;
    }

    &-item {
        display: inline-block;
        padding: 0 1em;
        font-size: 1em;
        color: #ddd;
        cursor: pointer;
    }

    a {
      padding-left: 0.5em;
      color: #009bff;
    }

    span {
      padding-left: 0.5em;
    }
}
</style>
