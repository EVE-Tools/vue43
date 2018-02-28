import Vue from 'vue'
import VueRouter from 'vue-router' // This is only here to load types for TS (e.g. $router reference)
import Vuetify from 'vuetify'
import Vuex, { Store } from 'vuex'
import axios from 'axios'

import '../stylus/main.styl'

Vue.use(Vuetify, { theme: {
  primary: '#faa732',
  secondary: '#ffffff',
  accent: '#006db2',
  error: '#ff5252',
  info: '#2196f3',
  success: '#4Caf50',
  warning: '#faa732'
}})

import { ClockState, clock } from './modules/clock'
import { LocationState, location } from './modules/locations'
import { MarketState, market } from './modules/markets'
import { MarketHistoryState, marketHistory } from './modules/marketHistory'
import { MarketStatisticsState, marketStatistics } from './modules/marketStats'
import { OrderHistoryState, orderHistory } from './modules/orderHistory'
import { ServerStatusState, serverStatus } from './modules/serverStatus'
import { StationState, station } from './modules/stations'
import { TypeState, type } from './modules/types'
import { UserState, user } from './modules/user'

const https = require('https')

export interface State {
  clock: ClockState,
  locations: LocationState,
  markets: MarketState,
  marketHistory: MarketHistoryState,
  marketStatistics: MarketStatisticsState,
  orderHistory: OrderHistoryState,
  serverStatus: ServerStatusState,
  stations: StationState,
  types: TypeState
}

let httpSettings = {
  baseURL: '/api',
  timeout: 30000
}

if ((process as any).server) {
  httpSettings.baseURL = 'https://element-43.com/api'
}

export const apiClient = axios.create(httpSettings)

const store = () => new Vuex.Store<State>({
  modules: {
    clock,
    location,
    marketHistory,
    market,
    marketStatistics,
    orderHistory,
    serverStatus,
    station,
    type,
    user
  }
})

export default store
