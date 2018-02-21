<template lang="html">
  <div class="icon-drawer">
    <div class="item">
      <nuxt-link class="item" :to="{ name: 'user-favorites' }"><icon name="star" scale="1.5" class="icon"></icon></nuxt-link>
    </div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  import Icon from 'vue-awesome/components/Icon.vue'

  if ((process as any).browser) {
    // These imports are broken in SSR, but work client-side
    require('vue-awesome/icons/star')
  }

  /** The main container for the title bar's other components */
  @Component({
      components: {
        Icon
      }
  })
  export default class IconDrawer extends Vue {
  }
</script>

<style lang="scss" scoped>
  .item {
    color: #888;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }

  .item.nuxt-link-active {
    color: #fff;
  }

  .item:hover {
    color: #fff;
  }

  .icon-drawer {
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #000;
    border-left: 1px solid #333;
    border-top: 1px solid #333;
    border-bottom: 1px solid #333;
    padding: 0.5rem;

    pointer-events: all;
  }

  .icon {
    display: flex;
  }

  .badge {
    font-size: 0.4rem;
    font-weight: 500;
    position: absolute;
    top: 0;
    right: 0;
    z-index: 4;
    height: 1em;
    min-width: 1em;
    border-radius: 1em;
    background-color: red;
    color: white;
    padding: 0.2em;
  }

  .item:not(:last-child) {
    padding-bottom: 0.5rem;
  }
</style>
