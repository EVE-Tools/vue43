import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'
import { readLocations } from './locations'

// Types
export interface UserState {
  markets: {
    lowsecFilterEnabled: boolean,
    typeFilter: number,
    regionFilter: number,
    favoriteTypes: number[]
  }
}

const initialState = {
  markets: {
    lowsecFilterEnabled: false,
    typeFilter: -1,
    regionFilter: -1,
    favoriteTypes: [34, 35, 36, 37, 38, 39, 40, 44992, 40520, 4247, 4051, 4312, 4246]
  }
}

type UserContext = ActionContext<UserState, RootState>

// Store Module
export const user = {
  namespaced: true,

  state: initialState,

  getters: {
    getLowsecFilterEnabled (state: UserState) { return state.markets.lowsecFilterEnabled },
    getRegionFilter (state: UserState) { return state.markets.regionFilter },
    getTypeFilter (state: UserState) { return state.markets.typeFilter },
    getFavoriteTypes (state: UserState) { return state.markets.favoriteTypes }
  },

  mutations: {
    enableLowsecFilter (state: UserState) { state.markets.lowsecFilterEnabled = true },
    disableLowsecFilter (state: UserState) { state.markets.lowsecFilterEnabled = false },
    setTypeFilter (state: UserState, type_id: number) { state.markets.typeFilter = type_id },
    setRegionFilter (state: UserState, region_id: number) { state.markets.regionFilter = region_id },
    setFavoriteTypes (state: UserState, types: number[]) { state.markets.favoriteTypes = types },
    deleteFavoriteType (state: UserState, type: number) {
      state.markets.favoriteTypes = state.markets.favoriteTypes.filter((id) => id !== type)
    },
    addFavoriteType (state: UserState, type: number) {
      if (state.markets.favoriteTypes.indexOf(type) === -1) {
        state.markets.favoriteTypes.push(type)
      }
    }
  },

  actions: {}
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<UserState, RootState>('user')

const getters = user.getters

export const readLowsecFilterEnabled = read(getters.getLowsecFilterEnabled)
export const readRegionFilter = read(getters.getRegionFilter)
export const readTypeFilter = read(getters.getTypeFilter)
export const readFavoriteTypes = read(getters.getFavoriteTypes)

const actions = user.actions

const mutations = user.mutations

export const commitEnableLowsecFilter = commit(mutations.enableLowsecFilter)
export const commitDisableLowsecFilter = commit(mutations.disableLowsecFilter)
export const commitSetTypeFilter = commit(mutations.setTypeFilter)
export const commitSetRegionFilter = commit(mutations.setRegionFilter)
export const commitSetFavoriteTypes = commit(mutations.setFavoriteTypes)
export const commitDeleteFavoriteType = commit(mutations.deleteFavoriteType)
export const commitAddFavoriteType = commit(mutations.addFavoriteType)
