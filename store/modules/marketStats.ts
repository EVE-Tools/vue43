import Vue from 'vue'
import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'

// Types
export interface MarketStatisticsState {
  statistics: StatisticsMap
}

export interface StatisticsMap { [id: string]: Statistics }

export interface Statistics {
  region_id: number,
  type_id: number,
  generated_at: string,
  current_stats: DayStats,
  previous_stats: DayStats,
  week_price_weighted_average: number,
  week_price_average: number,
  week_price_average_standard_deviation: number,
  week_price_average_relative_standard_deviation: number,
  week_isk_volume_average: number,
  week_isk_volume_average_standard_deviation: number,
  week_isk_volume_average_relative_standard_deviation: number,
  week_order_count_total: number,
  week_order_count_average: number,
  week_order_count_standard_deviation: number,
  week_order_count_relative_standard_deviation: number,
  week_volume_total: number,
  week_volume_average: number,
  week_volume_standard_deviation: number,
  week_volume_relative_standard_deviation: number
}

export interface DayStats {
  date: string,
  highest: number,
  lowest: number,
  average: number,
  volume: string,
  order_count: number,
}

type MarketStatisticsContext = ActionContext<MarketStatisticsState, RootState>

// Store Module
export const marketStatistics = {
  namespaced: true,

  state: {
    statistics: { }
  },

  getters: {
    getStatistics (state: MarketStatisticsState) { return state.statistics }
  },

  mutations: {
    addStatistics (state: MarketStatisticsState, newStatistics: StatisticsMap) {
      state.statistics = { ...state.statistics, ...newStatistics }
    }
  },

  actions: {
    async loadStatisticsOfRegionType (context: MarketStatisticsContext, regionType: {region_id: number, type_id: number}) {
      try {
        if (context.state.statistics[regionType.region_id + '-' + regionType.type_id] === undefined) {
          const response = await apiClient.get('v1/market/stats/history/region/' + regionType.region_id + '/type/' + regionType.type_id)
          let newMarketStats: StatisticsMap = {}
          let stats = stringsTopNumbers(response.data)

          newMarketStats[regionType.region_id + '-' + regionType.type_id] = response.data

          commitAddStatistics(context, newMarketStats)
        }
      } catch (error) {
        console.error(error)
      }
    },
    async loadStatisticsOfType (context: MarketStatisticsContext, type_id: number) {
      try {
        const response = await apiClient.get('v1/market/stats/history/type/' + type_id)
        let newMarketStats: StatisticsMap = {}

        for (let stats of response.data.history_stats) {
          newMarketStats[stats.region_id + '-' + stats.type_id] = stringsTopNumbers(stats)
        }

        commitAddStatistics(context, newMarketStats)
      } catch (error) {
        console.error(error)
      }
    }
  }
}

function stringsTopNumbers (stats: any) {
  // Convert protobuf strings to JS numbers
  stats.type_id = +stats.type_id
  stats.region_id = +stats.region_id

  stats.week_order_count_total = +stats.week_order_count_total
  stats.week_volume_total = +stats.week_volume_total

  return stats
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<MarketStatisticsState, RootState>('marketStatistics')

const getters = marketStatistics.getters

export const readStatistics = read(getters.getStatistics)

const actions = marketStatistics.actions

export const dispatchLoadStatisticsOfRegionType = dispatch(actions.loadStatisticsOfRegionType)
export const dispatchLoadStatisticsOfType = dispatch(actions.loadStatisticsOfType)

const mutations = marketStatistics.mutations

export const commitAddStatistics = commit(mutations.addStatistics)
