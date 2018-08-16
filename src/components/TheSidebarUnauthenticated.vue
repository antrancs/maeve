<template>
    <div>
        <p>Log in with your Apple Music to listen to full songs and manage your playlists</p>
        <button @click="authorize">Log in</button>
    </div>
</template>

<script>
export default {
  name: 'SidebarUnauthenticated',
  methods: {
    authorize() {
      console.log('Authorize');
      this.$music.authorize();
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
