<template lang="html">  
  <v-select
    v-model="selected"
    :items="searchResults"
    :search-input.sync="query"
    :loading="loading"
    item-text="name"
    item-value="name"
    label="Search item..."
    no-data-text="No matching items found"
    append-icon=""
    color="white"
    clearable
    return-object
    autocomplete
    :autofocus="autofocus"
    >
    <template slot="selection" slot-scope="data">
      {{ data.item.name }}
    </template>
    <template slot="item" slot-scope="data">
      <template v-if="typeof data.item == 'object'">
        <v-list-tile-avatar>
          <img :src="'https://image.eveonline.com/Type/' + data.item.type_id + '_64.png'">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <nuxt-link :id="'searchlink-' + data.item.type_id" :to="{ name: 'market-type', params: { type: slugify(data.item.type_id, data.item.name) } }">
            <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
          </nuxt-link>
        </v-list-tile-content>
      </template>
    </template>
  </v-select>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop, Watch } from 'vue-property-decorator'

  import { slugifyID } from '../util/slug'

  import { apiClient } from '../store/index'
  import { readTypes, readMarketTypes, dispatchLoadType, dispatchLoadMarketTypes, TypeInfo } from '../store/modules/types'

  /** The main search component. */
  @Component({})
  export default class Search extends Vue {
    searchResults: TypeInfo[] = []
    query = ''
    loading = false
    selected: any = {}

    @Prop()
    autofocus: boolean

    get types() {
      return readTypes(this.$store)
    }

    mounted () {
      if (this.$route.query.search) {
        this.query = this.$route.query.search
      }
    }

    slugify (id: number, name: string) {
      return slugifyID(id, name)
    }

    @Watch('selected')
    onSelectItem (selected: TypeInfo) {
      if (selected) {
        this.$router.push({name: 'market-type', params: { type: slugifyID(selected.type_id, selected.name) }})
      }
    }

    @Watch('query')
    async onChangeQuery (query: string) {
      // Get results from ESI, load type info to determine if types are on market, then display results
      if (this.query && (this.query.length > 2)) {
        try {
          this.loading = true

          // Ensure market types are loaded, consecutive calls return immediately
          await dispatchLoadMarketTypes(this.$store)
          const marketTypes = readMarketTypes(this.$store)

          // Fire search query
          const response = await apiClient.get('https://esi.tech.ccp.is/v1/search/', {params: {categories: 'inventorytype', search: this.query}})

          // Filter market types
          const rawResults = response.data.inventorytype.filter((id: number) => {
            return marketTypes.has(id)
          })

          // Get type info of results if market type
          let promises = rawResults.map((type_id: number) => {
            return dispatchLoadType(this.$store, type_id)
          })
          await Promise.all(promises)

          // Filter results
          const finalResults: TypeInfo[] = rawResults
            .map((type_id: number): TypeInfo => {
              return this.types[type_id]
            })

          this.loading = false
          this.searchResults = finalResults
        } catch (error) {
          this.loading = false
          console.error(error)
          this.searchResults = []
        }
      }
    }
  }
</script>

<style scoped>
  .avatar img {
    border-radius: 0;
  }
</style>