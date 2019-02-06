<template>
  <div></div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

@Component
export default class LastFmAuthSuccess extends Vue {
  created() {
    // const token = new URL(document.location.href).searchParams.get('token');

    const token = this.$route.hash.substring('#token='.length);

    if (window.opener) {
      window.opener.postMessage(
        {
          source: '/auth/lastfm/success',
          payload: {
            token
          }
        },
        'https://maevemusic.app/'
      );
    }
  }
}
</script>
