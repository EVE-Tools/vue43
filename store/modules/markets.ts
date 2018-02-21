import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'
import { readLocations } from './locations'

// Types
export interface MarketState {
  orders: MarketMap
}

export interface MarketMap { [type_id: number]: Order[] }

export interface Order {
  order_id: number,
  region_id: number,
  location_id: number,
  type_id: number,
  seen_at: string,
  price: number,
  volume_remain: number,
  range: number,
  volume_total: number,
  min_volume: number,
  is_buy_order: boolean,
  issued: string,
  duration: number
}

const initialOrders: MarketMap = {}

const initialState = {
  lowsecFilterEnabled: false,
  typeFilter: -1,
  regionFilter: -1,
  orders: initialOrders
}

type MarketContext = ActionContext<MarketState, RootState>

// Store Module
export const market = {
  namespaced: true,

  state: initialState,

  getters: {
    getAllMarkets (state: MarketState) { return state.orders }
  },

  mutations: {
    setMarketOfType (state: MarketState, market: {type_id: number, orders: Order[]}) {
      // Construct typeMap and merge (must be done so it is reactive)
      let marketMap: MarketMap = {}
      marketMap[market.type_id] = market.orders

      state.orders = { ...state.orders, ...marketMap }
    }
  },

  actions: {
    async loadMarketForType (context: MarketContext, type_id: number) {
      try {
        const response = await apiClient.get('v1/market/orders/type/' + type_id)
        commitSetMarketOfType(context, { type_id: type_id, orders: mapOrders(response.data.orders) })
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async loadMarketForRegionType (context: MarketContext, regionType: {region_id: number, type_id: number}) {
      try {
        const response = await apiClient.get('v1/market/orders/region/' + regionType.region_id + '/type/' + regionType.type_id)
        commitSetMarketOfType(context, { type_id: regionType.type_id, orders: mapOrders(response.data.orders) })
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
}

export function mapOrders (orders: any) {
  return orders.map((order: any) => {
    order.order_id = +order.order_id
    order.type_id = +order.type_id
    order.region_id = +order.region_id
    order.location_id = +order.location_id
    order.volume_total = +order.volume_total
    order.volume_remain = +order.volume_remain
    order.is_buy_order = order.hasOwnProperty('is_buy_order') ? order.is_buy_order : false

    return order
  })
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<MarketState, RootState>('market')

const getters = market.getters

export const readAllMarkets = read(getters.getAllMarkets)

const actions = market.actions

export const dispatchLoadMarketOfType = dispatch(actions.loadMarketForType)
export const dispatchLoadMarketOfRegionType = dispatch(actions.loadMarketForRegionType)

const mutations = market.mutations

export const commitSetMarketOfType = commit(mutations.setMarketOfType)
