import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'

// Types
export interface ServerStatusState {
  players: number
}

type ServerStatusContext = ActionContext<ServerStatusState, RootState>

// Store Module
export const serverStatus = {
  namespaced: true,

  state: {
    players: -1
  },

  getters: {
    getPlayers (state: ServerStatusState) { return state.players }
  },

  mutations: {
    setPlayers (state: ServerStatusState, players: number) { state.players = players }
  },

  actions: {
    async loadServerStatus (context: ServerStatusContext) {
      try {
        const response = await apiClient.get('https://esi.tech.ccp.is/v1/status/')
        commitSetPlayers(context, response.data['players'])
      } catch (error) {
        commitSetPlayers(context, -1)
        console.error(error)
        throw error
      }
    }
  }
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<ServerStatusState, RootState>('serverStatus')

const getters = serverStatus.getters

export const readPlayers = read(getters.getPlayers)

const actions = serverStatus.actions

export const dispatchLoadServerStatus = dispatch(actions.loadServerStatus)

const mutations = serverStatus.mutations

export const commitSetPlayers = commit(mutations.setPlayers)
