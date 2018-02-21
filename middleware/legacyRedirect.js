import axios from 'axios'
import { slugifyID } from '../util/slug'

export default async function ({ error, redirect, route }) {
  // Properly redirect/error legacy market routes so search engines do not break
  // The Django version of E43 only contained IDs in the URL but no slugs
  const marketRegex = /^\/market\/(\d+)(\/.*)?$/
  let matches = route.fullPath.match(marketRegex)

  if (matches) {
    const typeID = matches[1]
    const rest = matches[2] ? matches[2] : ''

    // PLEX
    if (typeID === '29668') {
      redirect('/market/PLEX-44992/')
    }

    // Get name from ESI and construct new slug if possible
    await axios.get('https://esi.tech.ccp.is/v3/universe/types/' + typeID + '/')
      .then((response) => {
        if (response.data.name && response.data.market_group_id) {
          // Redirect to new schema via code 302
          redirect('/market/' + slugifyID(typeID, response.data.name) + rest)
        } else {
          if (response.data.name) {
            // Type has a name but no group
            error({statusCode: 404, message: 'Could not find ' + response.data.name + ' on the market. Are you sure this is a valid market type which can be traded?'})
          } else {
            // Type has no name?
            error({statusCode: 404, message: 'Type with ID ' + typeID + ' could not be found on the market. Are you sure this is a valid market type which can be traded?'})
          }
        }
      }).catch((e) => {
        if (e.response.status === 404) {
          // Could not find that type on ESI
          error({statusCode: 404, message: 'Type with ID ' + typeID + ' could not be found on the market. Are you sure this is a valid market type which can be traded?'})
        } else {
          // ESI did not respond properly
          error({statusCode: 500, message: 'Could not load type info from ESI: ' + e + ' This might happen during downtime.'})
        }
      })
  }
}
