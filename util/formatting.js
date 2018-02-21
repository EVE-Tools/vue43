/*
  This file contains various formatting helpers for use as mixin in components.
*/

import _ from 'lodash'
import { formatMoney, formatNumber } from 'accounting'

export let numberMixin = {
  methods: {
    /**
     * Make large numbers more readable e.g. '1200.0312' => '1 200.03'
     * @param {number} number The number to be formatted
     * @param {number} precision How many decimal places should be displayed
     */
    formatNumber (number, precision = 0) {
      return formatNumber(number, { precision: precision, thousand: '\u00A0' })
    },

    /**
     * Formats a number as ISK value
     * @param {number} number Number to be formatted
     */
    formatISK (number) {
      return formatMoney(number, { symbol: 'ISK', format: '%v %s', thousand: '\u00A0' })
    },

    /**
     * Shortens huge numbers for betetr readability e.g. '1000000000' => '1B'
     * @param {number} number Number to be shortened
     * @param {number} precision How many decimal places should be displayed
     */
    abbreviateNumber (number, precision = 0) {
      if (number < 1000000) {
        return formatNumber(number, { precision: precision, thousand: '\u00A0' })
      } else {
        let base = Math.floor(Math.log(Math.abs(number)) / Math.log(1000))
        let suffix = 'kMBTQ'[base - 1]
        return suffix ? Math.round(number / Math.pow(1000, base)) + suffix : '' + number
      }
    }
  }
}

export let securityMixin = {
  methods: {
    /**
     * Get the true security rating of a location's solar system
     * @param {number} locationID ID of the location
     */
    trueSec (locationID) {
      const sec = this.locations[locationID].solar_system.security_status
      return sec < 0 ? '0.0' : formatNumber(sec, 1)
    },
    /**
     * Get the corresponding CSS-class for a location's security
     * @param {number} locationID ID of the location
     */
    secClass (locationID) {
      const sec = this.locations[locationID].solar_system.security_status
      const rounded = sec < 0 ? 0 : _.round(sec, 1) * 10
      return 'sec' + rounded
    }
  }
}
