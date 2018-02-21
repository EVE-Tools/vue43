import Vue from 'vue'
import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'

// Types
export interface TypeState {
  types: TypeMap
}

export interface TypeMap {
  [id: number]: TypeInfo
}

export interface TypeInfo {
  type_id: number,
  name: string,
  description: string,
  published: boolean,
  group_id: number,
  market_group_id: number,
  radius: number,
  volume: number,
  packaged_volume: number,
  icon_id: number,
  capacity: number,
  portion_size: number,
  mass: number
}

type TypeContext = ActionContext<TypeState, RootState>

// Store Module
export const type = {
  namespaced: true,

  state: {
    types: { }
  },

  getters: {
    getTypes (state: TypeState) { return state.types }
  },

  mutations: {
    addType (state: TypeState, newType: TypeInfo) {
      // Construct typeMap and merge (must be done so it is reactive)
      let typeMap: TypeMap = {}
      typeMap[newType.type_id] = newType

      state.types = { ...state.types, ...typeMap }
    }
  },

  actions: {
    async loadType (context: TypeContext, type_id: number) {
      try {
        // Load if needed
        if (!context.state.types.hasOwnProperty(type_id)) {
          const response = await apiClient.get('https://esi.tech.ccp.is/v3/universe/types/' + type_id + '/')
          commitAddType(context, response.data)
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<TypeState, RootState>('type')

const getters = type.getters

export const readTypes = read(getters.getTypes)

const actions = type.actions

export const dispatchLoadType = dispatch(actions.loadType)

const mutations = type.mutations

export const commitAddType = commit(mutations.addType)
