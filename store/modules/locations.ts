import { ActionContext, Store } from 'vuex'
import { getStoreAccessors } from 'vuex-typescript'

import { State as RootState, apiClient } from '../index'

// Types
export interface LocationState {
  locations: LocationMap,
  region_ids: number[]
}

export interface LocationMap {
  [id: number]: LocationInfo
}

export interface LocationInfo {
  station: StationInfo,
  region: RegionInfo,
  constellation: ConstellationInfo,
  solar_system: SolarSystemInfo
}

export interface StationInfo {
  id: number,
  name: string,
  type_id?: number,
  type_name?: string,
  last_seen?: string,
  first_seen?: string,
  position: {
    x: number,
    y: number,
    z: number
  }
}

export interface RegionInfo {
  id: number,
  name: string
}

export interface ConstellationInfo {
  id: number,
  name: string
}

export interface SolarSystemInfo {
  id: number,
  name: string,
  security_status: number
}

type LocationContext = ActionContext<LocationState, RootState>

// Store Module
export const location = {
  namespaced: true,

  state: {
    locations: { },
    region_ids: []
  },

  getters: {
    getLocations (state: LocationState) { return state.locations },
    getRegions (state: LocationState) { return state.region_ids.map((region_id) => state.locations[region_id]) },
    getMarketRegions (state: LocationState) {
      return state.region_ids
      .filter((region_id) => region_id < 11000000 && region_id !== 10000004 && region_id !== 10000019 ? true : false)
      .map((region_id) => state.locations[region_id])
    }
  },

  mutations: {
    addLocations (state: LocationState, newLocations: LocationMap) { state.locations = { ...state.locations, ...newLocations } },
    setRegions (state: LocationState, regions: number[]) { state.region_ids = regions }
  },

  actions: {
    async loadLocationInfo (context: LocationContext, locationIDs: number[]) {
      try {
        // Dedup and diff against locations already in cache
        const missingLocations = locationIDs
          .filter((id) => { return id != null })
          .filter((id) => { return !(context.state.locations.hasOwnProperty(id)) })
          .filter((element, position, array) => array.indexOf(element) === position)

        // Add location data to cache
        if (missingLocations.length > 0) {
          const response = await apiClient.post('/v1/universe/locations', JSON.stringify({ 'location_ids': missingLocations }), { timeout: 10000 })
          let locations: LocationMap = {}

          if (response.data.locations) {
            new Map(Object.entries(response.data.locations)).forEach((loc: any, locID: string, locs: any) => {
              locations[+locID] = stringsToNumbers(loc)
            })
          }

          commitAddLocations(context, locations)
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    },
    async loadAllRegions (context: LocationContext) {
      try {
        if (context.state.region_ids.length === 0) {
          const response = await apiClient.get('https://esi.tech.ccp.is/v1/universe/regions/')
          commitSetRegions(context, response.data)
          await dispatchLoadLocations(context, response.data)
        }
      } catch (error) {
        console.error(error)
        throw error
      }
    }
  }
}

function stringsToNumbers (loc: any) {
  // Convert protobuf strings to JS numbers
  if (loc.station) {
    loc.station.id = +loc.station.id
  }

  if (loc.constellation) {
    loc.constellation.id = +loc.constellation.id
  }

  if (loc.solar_system) {
    loc.solar_system.id = +loc.solar_system.id
  }

  if (loc.region) {
    loc.region.id = +loc.region.id
  }

  return loc
}

// Exports
const { commit, read, dispatch } = getStoreAccessors<LocationState, RootState>('location')

const getters = location.getters

export const readLocations = read(getters.getLocations)
export const readRegions = read(getters.getRegions)
export const readMarketRegions = read(getters.getMarketRegions)

const actions = location.actions

export const dispatchLoadLocations = dispatch(actions.loadLocationInfo)
export const dispatchLoadAllRegions = dispatch(actions.loadAllRegions)

const mutations = location.mutations

export const commitAddLocations = commit(mutations.addLocations)
export const commitSetRegions = commit(mutations.setRegions)
