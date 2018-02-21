<template lang="html">
  <nav class="sidebar">
    <icon-drawer></icon-drawer>
  </nav>
</template>

<script lang="ts">
  import Vue from 'vue'
  import Component from 'nuxt-class-component'
  import { Prop } from 'vue-property-decorator'

  import IconDrawer from './IconDrawer'

  /** The main container for the title bar's other components */
  @Component({
    components: {
      IconDrawer
    }
  })
  export default class SideBar extends Vue {
  }
</script>

<style lang="scss" scoped>
  @keyframes sidebar-load {
      0% {
          transform: translate3d(100%, 0, 0);
      }
      100% {
          transform: translate3d(0, 0, 0);
      }
  }

  .sidebar {
    display: flex;
    flex-direction: column;
    justify-content: center;
    z-index: 3;
    position: absolute;
    top: 0;
    right: 0;
    width: 3rem;
    height: 100%;
    background-color: transparent;

    animation-timing-function: linear;
    animation-name: sidebar-load;
    animation-duration: 0.4s;

    pointer-events: none;
  }
</style>
