let fs = require('fs')
let zlib = require('zlib')
let sm = require('sitemap')
let axios = require('axios')
let slugify = require('slugify')

console.log('Generating sitemap...')

// Add root
let urls = [
  { url: '/', changefreq: 'weekly', priority: 0.6 },
  { url: '/about/', changefreq: 'weekly', priority: 1.0 },
  { url: '/trading/station/ranking', changefreq: 'hourly', priority: 0.8 }
]

// Add market-types
axios.get('https://crest-tq.eveonline.com/market/types/').then(
  function (response) {
    const pageCount = response.data.pageCount
    let promises = []

    for (let page = 1; page <= pageCount; page++) {
      promises.push(axios.get('https://crest-tq.eveonline.com/market/types/?page=' + page))
    }

    return axios.all(promises)
  }).then(function (results) {
  let types = [].concat.apply([], results.map(function (response) { return response.data.items }))
  types.forEach(function (type) {
    const slug = (slugify(type.type.name) + '-' + String(type.type.id)).replace(/'/g, '')
    urls.push({ url: '/market/' + slug + '/', changefreq: 'hourly' })
    urls.push({ url: '/market/' + slug + '/regions/', changefreq: 'hourly' })
    urls.push({ url: '/market/' + slug + '/bid/', changefreq: 'hourly' })
    urls.push({ url: '/market/' + slug + '/ask/', changefreq: 'hourly' })
  })

  return true
}).then(function (_ignoredResult) {
  // Creates a sitemap object given the input configuration with URLs
  let sitemap = sm.createSitemap({
    hostname: 'https://element-43.com',
    urls: urls
  })

  // Generates XML with a callback function
  sitemap.toXML(function (err, xml) { if (err) { console.error(err) } })

  // Dump XML to file
  let xml = sitemap.toString()
  let outputStream = fs.createWriteStream('./static/sitemap.xml.gz')
  let compressor = zlib.createGzip()

  compressor.pipe(outputStream)
  compressor.write(xml)
  compressor.end()

  console.log('Done!')
}).catch(function (error) {
  console.error(error)
  console.error('Something went wrong with CREST!')
})
