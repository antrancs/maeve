<template>
  <div>
    <div class="grammy-bg" :style="bannerBackgroundImage"></div>
    <div class="text-xs-center">
      <h1 class="mb-0">The 61st GRAMMY Awards</h1>
    </div>
    <v-container>
      <v-layout column>
        <v-flex class="mt-4" v-for="group in groups" :key="group.group">
          <div class="category" :style="getCategoryBackground(group.colors)">
            <h2>{{ group.group }}</h2>
          </div>

          <div>
            <div
              v-for="(item, itemIndex) in group.items"
              :key="itemIndex"
              class="mt-3"
            >
              <GrammySongNomination
                v-if="item.type === 'songs'"
                :title="item.category"
                :winners="item.winners || []"
                :songIds="item.nominations"
              />
              <GrammyAlbumNomination
                v-else-if="item.type === 'albums'"
                :title="item.category"
                :winners="item.winners || []"
                :albumIds="item.nominations"
              />
              <GrammyArtistNomination
                v-else-if="item.type === 'artists'"
                :title="item.category"
                :winners="item.winners || []"
                :artistIds="item.nominations"
              />
            </div>
          </div>
        </v-flex>
      </v-layout>
    </v-container>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';

import GrammySongNomination from '@/components/Grammy/GrammySongNomination.vue';
import GrammyAlbumNomination from '@/components/Grammy/GrammyAlbumNomination.vue';
import GrammyArtistNomination from '@/components/Grammy/GrammyArtistNomination.vue';
import SongCollectionList from '@/components/SongCollectionList.vue';
import SongListLarge from '@/components/SongListLarge.vue';
import { getGrammyResults } from '@/utils/utils';

@Component({
  components: {
    SongCollectionList,
    SongListLarge,
    GrammySongNomination,
    GrammyAlbumNomination,
    GrammyArtistNomination
  }
})
export default class Grammy extends Vue {
  private groups: any[] = [];

  created() {
    getGrammyResults().then(result => {
      this.groups = result;
    });
  }

  getCategoryBackground(colors: string[]) {
    return {
      background: `linear-gradient(45deg, ${colors.join(',')})`
    };
  }

  get bannerBackgroundImage() {
    const baseUrl =
      'https://is4-ssl.mzstatic.com/image/thumb/Features118/v4/d4/0d/24/d40d24be-59bf-4894-76a4-d130c948132d/source/{w}x{h}sr.jpeg';

    let width: number, height: number;

    switch (this.$vuetify.breakpoint.name) {
      case 'xl':
        width = 2880;
        height = 600;
        break;
      case 'lg':
        width = 1920;
        height = 400;
        break;
      case 'md':
        width = 1440;
        height = 400;
        break;
      case 'sm':
        width = 960;
        height = 300;
        break;
      default:
        width = 500;
        height = 200;
    }

    const imageUrl = baseUrl
      .replace('{w}', width.toString())
      .replace('{h}', height.toString());
    return {
      'background-image': `url(${imageUrl})`
    };
  }
}
</script>

<style lang="scss" scoped>
.category {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 5rem;
  border-radius: 2.5rem;
}

.grammy-bg {
  background-size: cover;
  height: 40vh;
  width: 100%;
}
</style>
