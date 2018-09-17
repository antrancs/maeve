<template>
  <div class="app-body" @click="closeContextMenu">
    <app-sidebar :is-logged-in="false"></app-sidebar>
    <div :class="['main-content-wrapper', { 'context-menu-showing': contextMenu.isContextMenuShowing }]">
      <router-view class="main-content"></router-view>
      <context-menu ref='contextMenu'>
        <context-menu-item :on-click="addNext">Play next</context-menu-item>
        <context-menu-item :on-click="handleAddToQueue">Add to queue</context-menu-item>
        <context-menu-item :on-click="handleAddToLibrary">Add to playlist</context-menu-item>
      </context-menu>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import { State, Mutation, Action } from 'vuex-class';

import AppSidebar from './../components/TheSidebar.vue';
import ContextMenu from '@/components/ContextMenu.vue';
import ContextMenuItem from '@/components/ContextMenuItem.vue';
import {
  ContextMenuState,
  AppendSongsPayload,
  AddToLibraryPayload
} from '@/store/types';
import { ADD_TO_LIBRARY } from '@/store/actions.type';

@Component({
  components: {
    AppSidebar,
    ContextMenuItem,
    ContextMenu
  }
})
export default class AppBody extends Vue {
  @State contextMenu!: ContextMenuState;

  @Mutation setShowingContextMenu!: (showing: boolean) => void;

  @Action appendSongs!: (payload: AppendSongsPayload) => void;
  @Action addToLibrary!: (payload: AddToLibraryPayload) => void;

  @Watch('contextMenu.isContextMenuShowing')
  onContextMenuShowingChanged(newVal: boolean, oldVal: boolean) {
    // console.log('isContextMenuShowing');
    // console.log(newVal, oldVal);
    if (newVal === true) {
      // @ts-ignore
      this.$refs.contextMenu.show(
        this.contextMenu.displayPositionPageX,
        this.contextMenu.displayPositionPageY
      );
    } else {
      // @ts-ignore
      this.$refs.contextMenu.close();
    }
  }

  closeContextMenu() {
    // console.log('closeContextMenu');
    if (this.contextMenu.isContextMenuShowing) {
      this.setShowingContextMenu(false);
    }
  }

  handleAddToQueue(event: MouseEvent) {
    console.log('Add to queue');
    if (!this.contextMenu.selectedTrack) {
      return;
    }

    this.appendSongs({ items: [this.contextMenu.selectedTrack] });
  }

  addNext() {}

  handleAddToLibrary() {
    console.log('Add to library');
    if (!this.contextMenu.selectedTrack) {
      return;
    }

    this.addToLibrary({
      itemIds: [this.contextMenu.selectedTrack.id],
      type: 'songs'
    });
  }
}
</script>

<style lang="scss" scoped>
.app-body {
  display: flex;
  flex: 1;
  // height: calc(100% - 50px);
  overflow-y: auto;
}

.main-content-wrapper {
  display: flex;
  flex-direction: column;
  flex: 1;
  overflow-y: auto;

  &.context-menu-showing {
    overflow-y: hidden;
  }
}

.main-content::after {
  content: '';
  display: block;
  padding-bottom: 100px;
}
</style>
