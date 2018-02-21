import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState } from '../index'

// Types
export interface ClockState {
  time: Date
}

type ClockContext = ActionContext<ClockState, RootState>

// Store Module
export const clock = {
  namespaced: true,

  state: { time: new Date() },

  getters: {
    getTime (state: ClockState) { return state.time }
  },

  mutations: {
    setTime (state: ClockState, newTime: Date) { state.time = newTime }
  },

  actions: {
    updateTime (context: ClockContext) { commitSetTime(context, new Date()) }
  }
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<ClockState, RootState>('clock')

const getters = clock.getters

export const readTime = read(getters.getTime)

const actions = clock.actions

export const dispatchUpdateTime = dispatch(actions.updateTime)

const mutations = clock.mutations

export const commitSetTime = commit(mutations.setTime)
