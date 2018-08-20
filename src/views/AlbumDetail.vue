<template>
  <div>
    <div class="album-detail-header">
        <div class="content">
            <h2>Perception</h2>
        </div>
        <picture class="album-detail-header--banner">
            <source
              media="(max-width: 540px)"
              srcset="https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/44/c6/9d/44c69d97-bde4-492f-e766-1de73580eaf0/UMG_cvrart_00851365006516_01_RGB72_1800x1800_16UMGIM03373.jpg/540x540bb.jpeg">

            <source
              media="(max-width: 817px)"
              srcset="https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/44/c6/9d/44c69d97-bde4-492f-e766-1de73580eaf0/UMG_cvrart_00851365006516_01_RGB72_1800x1800_16UMGIM03373.jpg/817x817bb.jpeg">

            <source
              media="(max-width: 1105px)"
              srcset="https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/44/c6/9d/44c69d97-bde4-492f-e766-1de73580eaf0/UMG_cvrart_00851365006516_01_RGB72_1800x1800_16UMGIM03373.jpg/1105x1105bb.jpeg">

            <img
              class="image"
              src="https://is1-ssl.mzstatic.com/image/thumb/Music69/v4/44/c6/9d/44c69d97-bde4-492f-e766-1de73580eaf0/UMG_cvrart_00851365006516_01_RGB72_1800x1800_16UMGIM03373.jpg/1200x1200bb.jpeg"/>
        </picture>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AlbumDetail'
};
</script>

<style lang="scss" scoped>
.album-detail-header {
  height: 350px;
  position: relative;
}

.content {
  position: relative;
  z-index: 100;
  background-color: rgba($color: (#000000), $alpha: 0.4);
  color: white;
  height: 100%;
}

.album-detail-header--banner {
  position: absolute;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>
