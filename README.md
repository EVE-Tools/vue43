# vue43
[![Build Status](https://drone.element-43.com/api/badges/EVE-Tools/vue43/status.svg)](https://drone.element-43.com/EVE-Tools/vue43) [![Docker Image](https://images.microbadger.com/badges/image/evetools/vue43.svg)](https://microbadger.com/images/evetools/vue43)

Vue43 is Element43's SPA frontend which is based on Vue.js, Nuxt.js, Vuetify and TypeScript. 

Issues can be filed [here](https://github.com/EVE-Tools/element43). Pull requests can be made in this repo.

## Installation
To host a local copy of the app simply use the Docker image. If you need a local development environment running against the production API install `yarn` and `TypeScript`, then:

* Clone this repo
* Run `yarn install`
* Run `yarn dev` and wait a while
* Disable CORS-checks in your browser while developing (easiest in Safari), maybe install Vue devtools
* Access the URL displayed in your console once the build finished
