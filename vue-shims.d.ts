declare module "*.vue" {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vue/types/options' {
  import Vue from 'vue'
  interface ComponentOptions<V extends Vue> {
    layout?: string;
  }
}

declare module 'vuedraggable'
declare module 'nuxt-class-component'