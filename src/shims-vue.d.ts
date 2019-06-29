interface Navigator {
  mediaSession: any;
}

declare module '*.vue' {
  import Vue from 'vue';
  export default Vue;
}

declare module 'vuetify/es5/components/Vuetify';
