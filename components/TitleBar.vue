<template lang="html">
  <section>
    <v-navigation-drawer app hide-overlay mini-variant fixed temporary v-model="drawer">
      <v-list>
        <v-list-tile>
          <v-list-tile-action>
            <v-btn icon @click.native.stop="drawer = !drawer">
              <v-icon>keyboard_arrow_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
        <v-tooltip right>
          <v-list-tile nuxt :to="{ name: 'index' }" exact slot="activator">
            <v-list-tile-action>
              <v-icon>home</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Home</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <span>Home</span>
        </v-tooltip>
        <v-tooltip right>
          <v-list-tile nuxt :to="{ name: 'trading-station-ranking' }" slot="activator">
            <v-list-tile-action>
              <v-icon>place</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Top Stations</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <span>Top Stations</span>
        </v-tooltip>
        <v-tooltip right>
          <v-list-tile href="https://news.element-43.com" target="_blank" rel="noopener" slot="activator">
            <v-list-tile-action>
              <v-icon>chat</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>News</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <span>News</span>
        </v-tooltip>
        <v-tooltip right>
          <v-list-tile nuxt :to="{ name: 'about' }" slot="activator">
            <v-list-tile-action>
              <v-icon>info</v-icon>
            </v-list-tile-action>
            <v-list-tile-content>
              <v-list-tile-title>Contact / About / Privacy</v-list-tile-title>
            </v-list-tile-content>
          </v-list-tile>
          <span>Contact / About / Privacy</span>
        </v-tooltip>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar app>
      <v-fade-transition>
        <v-toolbar-side-icon v-if="!drawer" @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      </v-fade-transition>
      <v-spacer></v-spacer>
      <v-toolbar-items>
        <clock></clock>
        <server-status></server-status>
      </v-toolbar-items>
    </v-toolbar>
  </section>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  import Clock from './Clock.vue'
  import ServerStatus from './ServerStatus.vue'

  /** The main container for the title bar's other components */
  @Component({
    components: {
      Clock,
      ServerStatus
    }
  })
  export default class TitleBar extends Vue {
    drawer = true
  }
</script>
