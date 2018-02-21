import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'

// Types
export interface StationState {
  stations: Station[]
}

export interface Station {
  ask_volume: number,
  id: number,
  bid_volume: number,
  total_volume: number,
  total_orders: number
}

type StationContext = ActionContext<StationState, RootState>

// Store Module
export const station = {
  namespaced: true,

  state: {
    stations: []
  },

  getters: {
    getStations (state: StationState) { return state.stations }
  },

  mutations: {
    setStations (state: StationState, stations: Station []) { state.stations = stations }
  },

  actions: {
    async loadStations (context: StationContext) {
      try {
        const response = await apiClient.get('v1/market/stats/stations/top')
        let stations = response.data.stations.map((station: any) => {
          // Convert ID from string to number
          station.id = +station.id
          return station
        })

        commitSetStations(context, stations)
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<StationState, RootState>('station')

const getters = station.getters

export const readStations = read(getters.getStations)

const actions = station.actions

export const dispatchLoadStations = dispatch(actions.loadStations)

const mutations = station.mutations

export const commitSetStations = commit(mutations.setStations)
