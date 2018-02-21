<template lang="html">
  <v-layout row wrap class="mt-5 mb-5">
    <v-flex xs0 md4>
    </v-flex>
    <v-flex xs12 md4>
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
        autocomplete>
        <template slot="selection" slot-scope="data">
          {{ data.item.name }}
        </template>
        <template slot="item" slot-scope="data">
          <template v-if="typeof data.item == 'object'">
            <v-list-tile-avatar>
              <img :src="'https://image.eveonline.com/Type/' + data.item.type_id + '_64.png'">
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
            </v-list-tile-content>
          </template>
        </template>
      </v-select>
    </v-flex>
    <v-flex xs0 md4>
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Watch } from 'vue-property-decorator'

  import { slugifyID } from '../util/slug'

  import { apiClient } from '../store/index'
  import { readTypes, dispatchLoadType, TypeInfo } from '../store/modules/types'

  /** The main search component. SearchResults are displayed in a SearchResultList. */
  @Component({})
  export default class Search extends Vue {
    searchResults: TypeInfo[] = []
    query = ''
    loading = false
    selected: any = {}

    get types() {
      return readTypes(this.$store)
    }

    mounted () {
      if (this.$route.query.search) {
        this.query = this.$route.query.search
      }
    }

    @Watch('selected')
    onSelectItem (selected: TypeInfo) {
      this.$router.push({name: 'market-type', params: { type: slugifyID(selected.type_id, selected.name) }})
    }

    @Watch('query')
    async onChangeQuery (query: string) {
      // Get results from ESI, load type info to determine if types are on market, then display results
      if (this.query.length > 2) {
        try {
          this.loading = true
          const response = await apiClient.get('https://esi.tech.ccp.is/v1/search/', {params: {categories: 'inventorytype', search: this.query}})

          // Slice top 10 results
          const rawResults = response.data.inventorytype.slice(0, 25)

          // Get type info of results
          let promises = rawResults.map((type_id: number) => {
            return dispatchLoadType(this.$store, type_id)
          })
          await Promise.all(promises)

          // Filter results
          const finalResults: TypeInfo[] = rawResults
            .filter((type_id: number) => {
              const type = this.types[type_id]
              if (type && type.published && type.market_group_id) {
                return true
              }
              return false
            })
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