import { DirectiveOptions } from 'vue';
import { throttle } from 'lodash';

let throttledScrollHandler: (event: Event) => void;

const scrollDirective: DirectiveOptions = {
  bind(el, binding, vnode) {
    const { onScroll, shouldLoad, noMore } = binding.value;
    throttledScrollHandler = throttle(() => {
      const scrollTop = Math.max(
        window.pageYOffset,
        document.documentElement.scrollTop,
        document.body.scrollTop
      );
      let bottomOfWindow =
        scrollTop + window.innerHeight + 200 >=
        document.documentElement.offsetHeight;

      //@ts-ignore
      const shouldLoadData = vnode.context![shouldLoad];
      //@ts-ignore
      const shouldStopListening = vnode.context![noMore];

      // if (shouldStopListening) {
      //   console.log('unbinding');
      //   window.removeEventListener('scroll', throttledScrollHandler);
      //   return;
      // }

      if (bottomOfWindow && shouldLoadData) {
        onScroll();
      }
    }, 300);
    window.addEventListener('scroll', throttledScrollHandler);
  },

  unbind(el, binding) {
    window.removeEventListener('scroll', throttledScrollHandler);
  }
};

export default scrollDirective;
