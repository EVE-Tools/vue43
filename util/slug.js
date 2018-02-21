/*
  This file contains functions for performing various operations regarding URL slugs
*/

import slugify from 'slugify'

/** Take an ID and a name and slugify them */
export let slugifyID = function (id, name) {
  if (name) {
    return (slugify(name) + '-' + String(id)).replace(/'/g, '')
  } else {
    return String(id)
  }
}

/** Extract ID from a slug */
export let unslugID = function (slug) {
  if (isValidIDSlug(slug)) {
    const idRegex = /^(.*-)?(\d+)$/
    return Number(slug.match(idRegex)[2])
  }

  return -1
}

/** Check if the string is a valid slug */
export let isValidIDSlug = function (slug) {
  const idRegex = /^(.*-)?(\d+)$/
  return idRegex.test(slug)
}
