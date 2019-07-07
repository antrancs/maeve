<template>
  <div>
    <content-section v-if="activities.length > 0">
      <template #section-header>
        Activities & Mood
      </template>

      <template #section-content>
        <transition name="list">
          <v-layout
            row
            wrap
            v-if="activities.length > 0"
            class="section-offset"
          >
            <ActivityItem
              :activity="activity"
              v-for="activity in activities"
              :key="activity.id"
            />
          </v-layout>
        </transition>
      </template>
    </content-section>

    <content-section v-if="genreItems.length > 0">
      <template #section-header>
        Genres
      </template>

      <template #section-content>
        <GenreList :genres="genreItems" />
      </template>
    </content-section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { Component } from 'vue-property-decorator';

import ActivityItem from '@/components/ActivityItem.vue';
import GenreList from '@/components/GenreList.vue';
import { getActivities } from '../../services/musicApi.service';
import { activityIds } from '@/utils/constants';
import { getGenresForCountry } from '../../services/catalog.service';
import { GenreItem } from '../../@types/model/model';

@Component({
  components: {
    ActivityItem,
    GenreList
  }
})
export default class HomeActivities extends Vue {
  private activities: ReadonlyArray<MusicKit.Activity> = [];
  private genreItems: GenreItem[] = [];

  created() {
    this.$_fetchActivities();
    this.$_getGenres();
  }

  $_fetchActivities() {
    getActivities(activityIds)
      .then(activities => {
        this.activities = Object.freeze(activities);
      })
      .catch(err => err)
      .finally(() => this.$emit('ready'));
  }

  $_getGenres() {
    getGenresForCountry().then(genres => {
      this.genreItems = genres;
    });
  }
}
</script>
