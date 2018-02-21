<template>
  <main>
    <v-app dark>
      <title-bar></title-bar>
      <v-content>
        <v-slide-y-transition mode="out-in">
          <nuxt/>
        </v-slide-y-transition>
        <order-dialog></order-dialog>
      </v-content>
    </v-app>
  </main>
</template>

<script>
  import OrderDialog from '~/components/OrderDialog'
  import SideBar from '~/components/SideBar'
  import TitleBar from '~/components/TitleBar'

  /** Default app container */
  export default {
    components: { OrderDialog, SideBar, TitleBar }
  }
</script>

<style lang="scss">
  /* System Security Colors */
  .sec10 {
    color: #2fefef;
  }

  .sec9 {
    color: #48f0c0;
  }

  .sec8 {
    color: #00ef47;
  }

  .sec7 {
    color: #00f000;
  }

  .sec6 {
    color: #8fef2f;
  }

  .sec5 {
    color: #efef00;
  }

  .sec4 {
    color: #d77700;
  }

  .sec3 {
    color: #f06000;
  }

  .sec2 {
    color: #f04800;
  }

  .sec1 {
    color: #d73000;
  }

  .sec0 {
    color: #f00000;
  }
</style>
