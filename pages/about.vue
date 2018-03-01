<template lang="html">
  <v-container grid-list-lg>
    <v-layout column>
      <v-layout row>
        <v-flex md12>
          <h1>About Element43</h1>
          <p>
            Element43 is a non-commercial open source site to track <a href="https://eveonline.com" target="_blank" rel="noopener">EVE Online's</a> markets. The project is developed and run by a loose collective of developers spread all over the world. Our goal with Element43 is to provide you, the capsuleer, with everything you need to successfully manage your EVE-wide enterprises. Contributing to the project is easy - read the boxes below for some examples on how to get involved.
          </p>
          <p>
            For everything else please contact us via <a href="mailto:info@element-43.com">info@element-43.com</a>.
          </p>
        </v-flex>
      </v-layout>
      <v-layout row wrap>
        <v-flex md6>
          <h2>Users</h2>
          <p>
            You found a bug or have suggestions for a new or existing feature? Great! Contact us on the Tweetfleet Slack in the channel #element43 or drop us an e-mail.
          </p>
          <v-list>
            <v-list-tile>
              <a href="slack://channel?team=T03CDJ6FV&id=C1WMJBE30" target="_blank" rel="noopener">Join #element43 on Tweetfleet</a>
            </v-list-tile>
            <v-list-tile>
              <a href="https://www.fuzzwork.co.uk/tweetfleet-slack-invites/" target="_blank" rel="noopener">Tweetfleet Invites</a>
            </v-list-tile>
            <v-list-tile>
              <a href="mailto:info@element-43.com">info@element-43.com</a>
            </v-list-tile>
          </v-list>
        </v-flex>
        <v-flex md6>
          <h2>Developers</h2>
          <p>
            Element43 is built on a multitude of technologies. We are an open source project available on GitHub and embracing a modern, polyglot, microservices stack. No matter what background you are coming from, be it Python, .NET or PHP, getting started with development is straightforward.
          </p>
          <v-list>
            <v-list-tile>
              <a href="slack://channel?team=T03CDJ6FV&id=C1WMJBE30" target="_blank" rel="noopener">Join #element43 on Tweetfleet</a>
            </v-list-tile>
            <v-list-tile>
              <a href="https://github.com/EVE-Tools">Source Code Repositories</a>
            </v-list-tile>
          </v-list>
        </v-flex>
      </v-layout>
      <h2>Privacy Notice</h2>
      <v-layout row>
        <v-flex md12>
          <p>
            <i>Last update: 2018-02-21</i>
          </p>
          <p>
            We (Element43's team) respect our user's privacy. In this section we inform you about the way we collect data about you (the user) when you use Element43 (this website) and Journal43 (the news section).
          </p>
          <h3>What information do we collect about you?</h3>
          <p>
            We collect the information you supply when contacting us. This can for example be your e-mail address if you contact us via e-mail. 
          </p>
          <h4>Third parties</h4>
          <p>
            Element43 relies on services provided by CCP hf. (e.g. the ESI API for displaying the server status and EVE Online's image server for displaying icons). By using Element43 you also access these embedded services. You can find their privacy policy <a href="https://community.eveonline.com/support/policies/privacy-cookies-policy-en/" target="_blank" rel="noopener">here</a>.
          </p>
          <h3>How will we use the information?</h3>
          <p>
            We use that information for processing your contact request.
          </p>
          <h3>Access to your information and correction</h3>
          <p>
            You have a right to request a copy of the information we collected about you. Please contact us (see below) if you wish to do so.
            You may ask us to correct or remove information you think is inaccurate.
          </p>
          <h3>Removal of your information</h3>
          <p>
            If you want us to delete any data we collected about you, please contact us (see below).
          </p>
          <h3>How to contact us</h3>
          <p>
            You can contact us via e-mail at <a href="mailto:info@element-43.com">info@element-43.com</a>.
          </p>
        </v-flex>
      </v-layout>
      <h2>Element43 Team</h2>
      <v-layout row wrap>
        <v-flex md4>
          <h3>Project Leads</h3>
          <a href="mailto:zweizeichen@element-43.com">Sebastian / zweizeichen</a><br />
          <a href="mailto:greg@element-43.com">Greg Oberfield</a><br />
          <h3>Incredible Code / Support / Help</h3>
          <a href="https://gc-taylor.com/">Greg Taylor</a>
        </v-flex>
        <v-flex md4>
          <h3>Developers</h3>
          <a href="mailto:zweizeichen@element-43.com">Sebastian / zweizeichen</a><br />
          <a href="https://gc-taylor.com/">Greg Taylor</a><br />
          <a href="mailto:greg@element-43.com">Greg Oberfield</a><br />
          <a href="mailto:jens@element-43.com">Jens Lauterbach</a><br />
        </v-flex>
        <v-flex md4>
          <h3>Ops</h3>
          <a href="mailto:zweizeichen@element-43.com">Sebastian / zweizeichen</a>
          <h3>Special Thanks</h3>
          <a href="mailto:snipa@element-43.com">Snipa</a><br />
          <a href="http://k162space.com/">Blake</a><br />
        </v-flex>
      </v-layout>
      <h2>Copyright Notice</h2>
      <v-layout row>
        <v-flex md12>
          <p>
            EVE Online and the EVE logo are the registered trademarks of CCP hf. All rights are reserved worldwide. All other trademarks are the property of their respective owners. EVE Online, the EVE logo, EVE and all associated logos and designs are the intellectual property of CCP hf. All artwork, screenshots, characters, vehicles, storylines, world facts or other recognizable features of the intellectual property relating to these trademarks are likewise the intellectual property of CCP hf. CCP hf. has granted permission to element43 to use EVE Online and all associated logos and designs for promotional and information purposes on its website but does not endorse, and is not in any way affiliated with, element43. CCP is in no way responsible for the content on or functioning of this website, nor can it be liable for any damage arising from the use of this website.
          </p>
        </v-flex>
      </v-layout>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  /** Our project's about page */
  @Component({})
  export default class About extends Vue {
    head () {
      return { title: 'About' }
    }

    serverCacheKey () {
      // Will never change since it is static
      return 'aboutPage'
    }
  }
</script>

<style lang="scss" scoped>
  h2 {
    color: #faa732;
  }
</style>
