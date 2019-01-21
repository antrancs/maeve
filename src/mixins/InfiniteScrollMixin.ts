import { Component, Vue } from 'vue-property-decorator';
import throttle from 'lodash/throttle';
import { Nullable } from '@/@types/model/model';

@Component
export default class InfiniteScrollMixin extends Vue {
  shouldLoad = true;
  noMoreData = false;
  private throttledScrollHandler!: Nullable<(event: Event) => void>;

  handleScroll() {}

  unregisterScrollEvent() {
    if (this.throttledScrollHandler) {
      window.removeEventListener('scroll', this.throttledScrollHandler);
      this.throttledScrollHandler = undefined;
    }
  }

  registerScrollEvent() {
    if (!this.throttledScrollHandler) {
      this.throttledScrollHandler = throttle(() => {
        const scrollTop = Math.max(
          window.pageYOffset,
          document.documentElement.scrollTop,
          document.body.scrollTop
        );
        let bottomOfWindow =
          scrollTop + window.innerHeight + 200 >=
          document.documentElement.offsetHeight;

        if (this.noMoreData) {
          this.unregisterScrollEvent();
          return;
        }

        if (bottomOfWindow && this.shouldLoad) {
          this.handleScroll();
        }
      }, 300);

      window.addEventListener('scroll', this.throttledScrollHandler);
    }
  }

  mounted() {
    this.registerScrollEvent();
  }

  destroyed() {
    this.unregisterScrollEvent();
  }
}
