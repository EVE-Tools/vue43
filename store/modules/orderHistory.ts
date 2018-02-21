import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'

import { Order, mapOrders } from './markets'

// Types
export interface OrderHistoryState {
  selectedOrder: number,
  history: Order[]
}

type OrderHistoryContext = ActionContext<OrderHistoryState, RootState>

// Store Module
export const orderHistory = {
  namespaced: true,

  state: {
    selectedOrder: -1,
    history: []
  },

  getters: {
    getSelectedOrder (state: OrderHistoryState) { return state.selectedOrder },
    getOrderHistory (state: OrderHistoryState) { return state.history }
  },

  mutations: {
    setSelectedOrder (state: OrderHistoryState, selectedOrder: number) { state.selectedOrder = selectedOrder },
    setOrderHistory (state: OrderHistoryState, history: Order[]) { state.history = history }
  },

  actions: {
    async loadOrderHistory (context: OrderHistoryContext, orderID: number) {
      try {
        if (context.state.selectedOrder !== orderID) {
          const response = await apiClient.get('v1/market/orders/order/' + orderID)
          commitSetOrderHistory(context, mapOrders(response.data.orders))
          commitSetSelectedOrder(context, orderID)
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<OrderHistoryState, RootState>('orderHistory')

const getters = orderHistory.getters

export const readSelectedOrder = read(getters.getSelectedOrder)
export const readOrderHistory = read(getters.getOrderHistory)

const actions = orderHistory.actions

export const dispatchLoadOrderHistory = dispatch(actions.loadOrderHistory)

const mutations = orderHistory.mutations

export const commitSetSelectedOrder = commit(mutations.setSelectedOrder)
export const commitSetOrderHistory = commit(mutations.setOrderHistory)
