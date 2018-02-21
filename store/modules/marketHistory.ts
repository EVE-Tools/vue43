import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'

// Types
export interface MarketHistoryState { history: HistoryMap }

export interface HistoryMap { [id: string]: HistoryDatapoint[] }

export interface HistoryDatapoint {
  highest: number,
  lowest: number,
  average: number,
  volume: number,
  order_count: number,
  date: string
}

type MarketHistoryContext = ActionContext<MarketHistoryState, RootState>

// Store Module
export const marketHistory = {
  namespaced: true,

  state: {
    history: { }
  },

  getters: {
    getHistory (state: MarketHistoryState) { return state.history }
  },

  mutations: {
    addHistory (state: MarketHistoryState, newHistory: HistoryMap) {
      state.history = { ...state.history, ...newHistory }
    },
    removeHistory (state: MarketHistoryState, id: string) {
      delete state.history[id]
    }
  },

  actions: {
    async loadMarketHistory (context: MarketHistoryContext, regionType: {region_id: number, type_id: number}) {
      let id: string = regionType.region_id + '-' + regionType.type_id

      try {
        if (!context.state.history.hasOwnProperty(regionType.region_id + '-' + regionType.type_id)) {
          let newHistory: HistoryMap = {}
          newHistory[id] = []
          commitAddHistory(context, newHistory)
          const response = await apiClient.get('https://esi.tech.ccp.is/v1/markets/' + regionType.region_id + '/history/', { params: { type_id: regionType.type_id } })
          newHistory[id] = response.data
          commitAddHistory(context, newHistory)
        }
      } catch (error) {
        commitRemoveHistory(context, id)
        console.error(error)
        throw error
      }
    }
  }
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<MarketHistoryState, RootState>('marketHistory')

const getters = marketHistory.getters

export const readHistory = read(getters.getHistory)

const actions = marketHistory.actions

export const dispatchLoadMarketHistory = dispatch(actions.loadMarketHistory)

const mutations = marketHistory.mutations

export const commitAddHistory = commit(mutations.addHistory)
export const commitRemoveHistory = commit(mutations.removeHistory)
